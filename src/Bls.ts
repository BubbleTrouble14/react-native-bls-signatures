export interface IAugSchemeMPL {
  keyGen(msg: Uint8Array): IPrivateKey;
  deriveChildSk(privateKey: IPrivateKey, index: number): IPrivateKey;
}

export interface IPrivateKey {
  toBytes(): Uint8Array;
  getG1(): IG1Element;
  toHex(): string;
}

export interface IG1Element {
  getFingerprint(): number;
  toBytes(): Uint8Array;
  toHex(): string;
}

export type NativeAugSchemeMPL = Pick<
  IAugSchemeMPL,
  'keyGen' | 'deriveChildSk'
>;

export type NativePrivateKey = Pick<IPrivateKey, 'getG1' | 'toBytes' | 'toHex'>;

export type NativeG1Element = Pick<
  IG1Element,
  'getFingerprint' | 'toBytes' | 'toHex'
>;
