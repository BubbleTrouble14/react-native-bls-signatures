import { bls } from '../NativeBls';
export interface JsiHKDF256 {
  extract(salt: Uint8Array, ikm: Uint8Array): Uint8Array;
  expand(prk: Uint8Array, info: Uint8Array, length: number): Uint8Array;
  extractExpand(
    salt: Uint8Array,
    ikm: Uint8Array,
    info: Uint8Array,
    length: number
  ): Uint8Array;
}

export class HKDF256 {
  static extract(salt: Uint8Array, ikm: Uint8Array): Uint8Array {
    return bls.HKDF256.extract(salt, ikm);
  }

  static expand(prk: Uint8Array, info: Uint8Array, length: number): Uint8Array {
    return bls.HKDF256.expand(prk, info, length);
  }

  static extractExpand(
    salt: Uint8Array,
    ikm: Uint8Array,
    info: Uint8Array,
    length: number
  ): Uint8Array {
    return bls.HKDF256.extractExpand(salt, ikm, info, length);
  }
}
