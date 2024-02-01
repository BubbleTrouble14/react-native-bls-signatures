import type { G1Element } from './G1Element';
import type { G2Element } from './G2Element';

export interface IBasePrivateKey {
  toBytes(): Uint8Array;
  toHex(): string;
  toString(): string;
  deepCopy(): PrivateKey;
  equals(sk: PrivateKey): boolean;
  isZero(): boolean;
  getG1(): G1Element;
  getG2(): G2Element;
  getG2Power(el: G2Element): G2Element;
  mulG1(el: G1Element): G1Element;
  mulG2(el: G2Element): G2Element;
}

export type JsiPrivateKey = Pick<
  IBasePrivateKey,
  | 'toBytes'
  | 'toHex'
  | 'toString'
  | 'deepCopy'
  | 'equals'
  | 'isZero'
  | 'getG1'
  | 'getG2'
  | 'getG2Power'
  | 'mulG1'
  | 'mulG2'
>;

export interface IPrivateKey extends IBasePrivateKey {
  SIZE: number;
  fromBytes(bytes: Uint8Array, modOrder: boolean): PrivateKey;
  fromHex(hex: string): PrivateKey;
  aggregate(pks: PrivateKey[]): PrivateKey;
}

export class PrivateKey implements IBasePrivateKey {
  private functionCache: Partial<JsiPrivateKey>;
  static SIZE: number = 32;

  constructor() {
    this.functionCache = {};
  }

  static fromBytes(bytes: Uint8Array, modOrder?: boolean): PrivateKey {
    return global.BlsApi.PrivateKey.fromBytes(bytes, modOrder ?? false);
  }

  static fromHex(hex: string): PrivateKey {
    return global.BlsApi.PrivateKey.fromHex(hex);
  }

  static aggregate(privateKeys: PrivateKey[]): PrivateKey {
    return global.BlsApi.PrivateKey.aggregate(privateKeys);
  }

  private getFunctionFromCache<T extends keyof JsiPrivateKey>(
    functionName: T
  ): JsiPrivateKey[T] {
    if (this.functionCache[functionName] == null) {
      this.functionCache[functionName] = global.BlsApi.PrivateKey[functionName];
    }
    return this.functionCache[functionName] as JsiPrivateKey[T];
  }

  toBytes(): Uint8Array {
    const func = this.getFunctionFromCache('toBytes');
    return func.bind(this)();
  }

  toHex(): string {
    const func = this.getFunctionFromCache('toHex');
    return func.bind(this)();
  }

  toString(): string {
    const func = this.getFunctionFromCache('toString');
    return func.bind(this)();
  }

  deepCopy(): PrivateKey {
    const func = this.getFunctionFromCache('deepCopy');
    return func.bind(this)();
  }

  equals(sk: PrivateKey): boolean {
    const func = this.getFunctionFromCache('equals');
    return func.bind(this)(sk);
  }

  isZero(): boolean {
    const func = this.getFunctionFromCache('isZero');
    return func.bind(this)();
  }

  getG1(): G1Element {
    const func = this.getFunctionFromCache('getG1');
    return func.bind(this)();
  }

  getG2(): G2Element {
    const func = this.getFunctionFromCache('getG2');
    return func.bind(this)();
  }

  getG2Power(el: G2Element): G2Element {
    const func = this.getFunctionFromCache('getG2Power');
    return func.bind(this)(el);
  }

  mulG1(el: G1Element): G1Element {
    const func = this.getFunctionFromCache('mulG1');
    return func.bind(this)(el);
  }

  mulG2(el: G2Element): G2Element {
    const func = this.getFunctionFromCache('mulG2');
    return func.bind(this)(el);
  }
}

// // export interface JsiPrivateKeyStatic extends JsiPrivateKey{
// //   SIZE: number;
// //   fromBytes(bytes: Uint8Array, modOrder: boolean): PrivateKey;
// //   fromHex(hex: string): PrivateKey;
// //   aggregate(pks: PrivateKey[]): PrivateKey;
// // }
// export interface JsiPrivateKey {
//   toBytes(): Uint8Array;
//   toHex(): string;
//   toString(): string;
//   deepCopy(): PrivateKey;
//   equals(sk: PrivateKey): boolean;
//   isZero(): boolean;
//   getG1(): G1Element;
//   getG2(): G2Element;
//   getG2Power(el: G1Element): G2Element;
//   mulG1(el: G1Element): G1Element;
//   mulG2(el: G2Element): G2Element;
// }

// export interface JsiPrivateKeyWithStatic extends JsiPrivateKey {
//   fromBytes(bytes: Uint8Array, modOrder: boolean): PrivateKey;
//   fromHex(hex: string): PrivateKey;
//   aggregate(pks: PrivateKey[]): PrivateKey;
// }

// export abstract class PrivateKey implements JsiPrivateKey {
//   abstract toBytes(): Uint8Array;
//   abstract toHex(): string;
//   abstract toString(): string;
//   abstract deepCopy(): PrivateKey;
//   abstract equals(sk: PrivateKey): boolean;
//   abstract isZero(): boolean;
//   abstract getG1(): G1Element;
//   abstract getG2(): G2Element;
//   abstract getG2Power(el: G2Element): G2Element;
//   abstract mulG1(el: G1Element): G1Element;
//   abstract mulG2(el: G2Element): G2Element;

//   static SIZE: number = 32;

// static fromBytes(bytes: Uint8Array, modOrder?: boolean): PrivateKey {
//   return global.BlsApi.PrivateKey.fromBytes(bytes, modOrder ?? false);
// }

// static fromHex(hex: string): PrivateKey {
//   return global.BlsApi.PrivateKey.fromHex(hex);
// }

// static aggregate(privateKeys: PrivateKey[]): PrivateKey {
//   return global.BlsApi.PrivateKey.aggregate(privateKeys);
// }
// }

// // export interface JsiPrivateKey extends JsiPrivateKey, JsiPrivateKeyStatic {}
// // export const JsiPrivateKey: JsiPrivateKeyStatic = PrivateKey;
