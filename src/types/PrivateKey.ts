import { G1Element, type IG1Element } from './elements/G1Element';
import { G2Element, IG2Element } from './elements/G2Element';

declare global {
  function createPrivateKeyInstance(): CppPrivateKey;
}

export interface IPrivateKey {
  toBytes(): Uint8Array;
  toHex(): string;
  fromBytes(bytes: Uint8Array): IPrivateKey;
  getG1(): IG1Element;
  getG2(): IG2Element;
}

type CppPrivateKey = Pick<
  IPrivateKey,
  'toBytes' | 'toHex' | 'getG1' | 'getG2' | 'fromBytes'
>;

const createPrivateKey = (): CppPrivateKey => {
  if (global.createPrivateKeyInstance == null)
    throw new Error(
      'Failed to create a new PrivateKey instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  // const buffer = global.createPrivateKeyInstance();
  return global.createPrivateKeyInstance();
};

export class PrivateKey {
  private nativeInstance: CppPrivateKey;
  private static cppInstance: CppPrivateKey = createPrivateKey();

  constructor(nativeKey: CppPrivateKey) {
    this.nativeInstance = nativeKey;
  }

  static fromBytes(bytes: Uint8Array): PrivateKey {
    return new PrivateKey(this.cppInstance.fromBytes(bytes));
  }

  toBytes(): Uint8Array {
    return this.nativeInstance.toBytes();
  }

  toHex(): string {
    return this.nativeInstance.toHex();
  }

  getG1(): G1Element {
    return new G1Element(this.nativeInstance.getG1());
  }

  getG2(): G2Element {
    return new G2Element(this.nativeInstance.getG2());
  }

  getCppPrivateKey(): CppPrivateKey {
    return this.nativeInstance;
  }
}
