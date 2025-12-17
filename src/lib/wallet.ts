import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';
import {
  Address,
  address as asWalletAddress,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  Lamports,
  StringifiedBigInt,
  StringifiedNumber,
} from '@solana/kit';
import * as bip39 from 'bip39';

type TokenBalance = {
  tokenAccount: Address;
  mint: Address;
  owner: Address;
  amount: StringifiedBigInt;
  decimals: number | null;
  uiAmount: number | null;
  uiAmountString: StringifiedNumber;
};

const TOKEN_2022_PROGRAM_ADDRESS = asWalletAddress('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

const SOLANA_LAMPORTS_PER_SOL = 1_000_000_000;
const RPC = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
};

export const getRPC = (rpcURL?: string) => {
  const url = rpcURL || RPC.MAINNET;
  const rpc = createSolanaRpc(url);

  return rpc;
};

export const createMnemonic = (): string => {
  const mnemonic = bip39.generateMnemonic();

  return mnemonic;
};

export const restoreFromMnemonic = async (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic, '');
  const privateKeyBytes = seed.subarray(0, 32);
  const signer = await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes));

  return signer;
};

export const getWalletBalance = async (address: string, rpcURL?: string) => {
  const rpc = getRPC(rpcURL);
  const { value } = await rpc.getBalance(asWalletAddress(address)).send();

  return value;
};

export const getWalletBalanceInSOL = async (address: string, rpcURL?: string): Promise<number> => {
  const balance = await getWalletBalance(address, rpcURL);

  return convertBalanceToSOL(balance);
};

export const convertBalanceToSOL = (balance: string | Lamports): number => {
  return Number(balance) / SOLANA_LAMPORTS_PER_SOL;
};

export const getAccountInfo = async (address: string, rpcURL?: string) => {
  const rpc = getRPC(rpcURL);
  const info = await rpc.getAccountInfo(asWalletAddress(address)).send();

  return info;
};

export const getWalletTokenBalances = async (address: string, rpcURL?: string) => {
  const rpc = getRPC(rpcURL);

  const walletAddress = asWalletAddress(address);
  const options = { encoding: 'jsonParsed' } as const;
  const legacyProgram = { programId: TOKEN_PROGRAM_ADDRESS } as const;
  const token2022Program = { programId: TOKEN_2022_PROGRAM_ADDRESS } as const;

  const [legacy, token2022] = await Promise.all([
    rpc.getTokenAccountsByOwner(walletAddress, legacyProgram, options).send(),
    rpc.getTokenAccountsByOwner(walletAddress, token2022Program, options).send(),
  ]);

  const all = [...legacy.value, ...token2022.value];

  return all.map(({ pubkey, account }) => {
    if (typeof account.data !== 'object' || !('parsed' in account.data)) {
      throw new Error('Account data is not parsed');
    }

    const info = account.data.parsed.info;

    return {
      tokenAccount: pubkey,
      mint: info.mint,
      owner: info.owner,
      amount: info.tokenAmount.amount,
      decimals: info.tokenAmount.decimals,
      uiAmount: info.tokenAmount.uiAmount,
      uiAmountString: info.tokenAmount.uiAmountString,
    };
  });
};

export const getWalletTokenBalanceByToken = async (mintAddress: string, address: string, rpcURL?: string) => {
  const tokenBalances = await getWalletTokenBalances(address, rpcURL);

  return tokenBalances.find((tb) => tb.mint === mintAddress);
};

export const formatTokenAmount = (balance?: TokenBalance, suffix?: string, maxFractionDigits = 6): string => {
  const { amount, decimals } = balance || { amount: '0', decimals: 0 };
  if (decimals === null) return suffix ? `0 ${suffix}` : '0';

  const padded = amount.padStart(decimals + 1, '0');

  const integerPart = padded.slice(0, -decimals);
  let fraction = padded.slice(-decimals, -decimals + maxFractionDigits);

  fraction = fraction.replace(/0+$/, '');

  const value = fraction ? `${integerPart}.${fraction}` : integerPart;

  return suffix ? `${value} ${suffix}` : value;
};
