import { bls } from '../NativeBls';
export interface JsiHKDF256 {
  extract(salt: ArrayBuffer, ikm: ArrayBuffer): ArrayBuffer;
  expand(prk: ArrayBuffer, info: ArrayBuffer, length: number): ArrayBuffer;
  extractExpand(
    salt: ArrayBuffer,
    ikm: ArrayBuffer,
    info: ArrayBuffer,
    length: number
  ): ArrayBuffer;
}

export class HKDF256 {
  static extract(salt: ArrayBuffer, ikm: ArrayBuffer): ArrayBuffer {
    return bls.HKDF256.extract(salt, ikm);
  }

  static expand(
    prk: ArrayBuffer,
    info: ArrayBuffer,
    length: number
  ): ArrayBuffer {
    return bls.HKDF256.expand(prk, info, length);
  }

  static extractExpand(
    salt: ArrayBuffer,
    ikm: ArrayBuffer,
    info: ArrayBuffer,
    length: number
  ): ArrayBuffer {
    return bls.HKDF256.extractExpand(salt, ikm, info, length);
  }
}
