import type { IG1Element } from './G1Element';
import type { IG2Element } from './G2Element';
import type { IGTElement } from './GTElement';
import type { IPrivateKey } from './PrivateKey';
import type { JsiAugSchemeMPL } from './AugSchemeMPL';
import type { JsiBasicSchemeMPL } from './BasicSchemeMPL';
import type { JsiPopSchemeMPL } from './PopSchemeMPL';
import type { JsiHKDF256 } from './HKDF256';

export interface Bls {
  hash256(msg: Uint8Array): Uint8Array;
  toHex(bytes: Uint8Array): string;
  fromHex(hex: string): Uint8Array;
  getRandomSeed(): Uint8Array;
  PrivateKey: IPrivateKey;
  G1Element: IG1Element;
  G2Element: IG2Element;
  GTElement: IGTElement;
  AugSchemeMPL: JsiAugSchemeMPL;
  BasicSchemeMPL: JsiBasicSchemeMPL;
  PopSchemeMPL: JsiPopSchemeMPL;
  HKDF256: JsiHKDF256;
}
