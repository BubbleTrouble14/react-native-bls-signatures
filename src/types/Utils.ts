import { bls } from '../NativeBls';

export const hash256 = (msg: ArrayBuffer): ArrayBuffer => {
  return bls.hash256(msg);
};

export const toHex = (bytes: ArrayBuffer): string => {
  return bls.toHex(bytes);
};

export const fromHex = (hex: string): ArrayBuffer => {
  return bls.fromHex(hex);
};

export const getRandomSeed = (): ArrayBuffer => {
  return bls.getRandomSeed();
};
