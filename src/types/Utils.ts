import { bls } from '../NativeBls';

export const hash256 = (msg: Uint8Array): Uint8Array => {
  return bls.hash256(msg);
};

export const toHex = (bytes: Uint8Array): string => {
  return bls.toHex(bytes);
};

export const fromHex = (hex: string): Uint8Array => {
  return bls.fromHex(hex);
};

export const getRandomSeed = (): Uint8Array => {
  return bls.getRandomSeed();
};
