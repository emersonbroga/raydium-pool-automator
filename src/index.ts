import 'dotenv/config';
import { Contracts } from './lib/raydium';
import {
  createMnemonic,
  formatTokenAmount,
  getWalletBalanceInSOL,
  getWalletTokenBalanceByToken,
  restoreFromMnemonic,
} from './lib/wallet';

const { SEED } = process.env;

const setupInstructions = async () => {
  const mnemonic = createMnemonic();
  console.log(`Add the following mnemonic as SEED in your .env file.\n${mnemonic}`);

  const signer = await restoreFromMnemonic(mnemonic);
  console.log(`Add the following address as WALLET in your .env file.\n${signer.address}`);
};

const main = async () => {
  if (!SEED) {
    await setupInstructions();
    return;
  }

  const signer = await restoreFromMnemonic(SEED);
  console.log('Wallet address:', signer.address);

  const balance = await getWalletBalanceInSOL(signer.address);
  console.log(`Balance: ${balance} SOL`);

  // const tokenBalance = await getWalletTokenBalances(signer.address);
  // console.log(`Token Balance:`, tokenBalance);

  const pumpBalance = await getWalletTokenBalanceByToken(Contracts.PUMP.address, signer.address);
  console.log(`PUMP Balance:`, pumpBalance);
  console.log(`PUMP Balance:`, formatTokenAmount(pumpBalance, Contracts.PUMP.suffix));
};

main();
