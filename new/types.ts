export interface IBlsNative {
  hash256(msg: Uint8Array): Uint8Array;
  toHex(bytes: Uint8Array): string;
  fromHex(hex: string): Uint8Array;
  getRandomSeed(): Uint8Array;
}

declare global {
  var bls: IBlsNative;
}

export const { bls } = globalThis;
