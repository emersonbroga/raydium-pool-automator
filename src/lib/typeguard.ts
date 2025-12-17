import { isAddress } from '@solana/addresses';
import { Address } from "@solana/kit";

export const isWalletAddress = (value: string): value is Address => {
  return isAddress(value);
}