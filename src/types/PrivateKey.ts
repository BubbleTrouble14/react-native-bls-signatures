import { G1Element, type IG1Element } from './elements/G1Element';
import { G2Element, IG2Element } from './elements/G2Element';

declare global {
  function createPrivateKeyInstance(): CppPrivateKey;
}

export interface IPrivateKey {
  fromBytes(bytes: Uint8Array, modOrder: boolean): IPrivateKey;
  fromHex(hex: string): IPrivateKey;
  aggregate(pks: IPrivateKey[]): IPrivateKey;
  toBytes(): Uint8Array;
  toHex(): string;
  toString(): string;
  equalTo(sk: IPrivateKey): boolean;
  getG1(): IG1Element;
  getG2(): IG2Element;
}

type CppPrivateKey = Pick<
  IPrivateKey,
  | 'toBytes'
  | 'toHex'
  | 'getG1'
  | 'getG2'
  | 'fromBytes'
  | 'fromHex'
  | 'aggregate'
  | 'toString'
  | 'equalTo'
>;

const createPrivateKey = (): CppPrivateKey => {
  if (global.createPrivateKeyInstance == null) {
    throw new Error(
      'Failed to create a new PrivateKey instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  }
  return global.createPrivateKeyInstance();
};

export class PrivateKey {
  private instance: CppPrivateKey;
  constructor(instance: CppPrivateKey) {
    this.instance = instance;
  }

  static fromBytes(bytes: Uint8Array, modOrder?: boolean): PrivateKey {
    return new PrivateKey(
      createPrivateKey().fromBytes(bytes, modOrder ?? false)
    );
  }

  static fromHex(hex: string): PrivateKey {
    return new PrivateKey(createPrivateKey().fromHex(hex));
  }

  static aggregate(privateKeys: PrivateKey[]): PrivateKey {
    return new PrivateKey(
      createPrivateKey().aggregate(
        privateKeys.map((pk) => pk.getCppPrivateKey())
      )
    );
  }

  toBytes(): Uint8Array {
    return this.instance.toBytes();
  }

  toHex(): string {
    return this.instance.toHex();
  }

  toString(): string {
    return this.instance.toString();
  }

  equals(sk: PrivateKey): boolean {
    return this.instance.equalTo(sk.getCppPrivateKey());
  }

  getG1(): G1Element {
    return new G1Element(this.instance.getG1());
  }

  getG2(): G2Element {
    return new G2Element(this.instance.getG2());
  }

  getCppPrivateKey(): CppPrivateKey {
    return this.instance;
  }
}
