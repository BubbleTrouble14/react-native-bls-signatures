import { bls } from '../NativeBls';

export interface IBaseG1Element {
  toBytes(): Uint8Array;
  toHex(): string;
  toString(): string;
  isValid(): boolean;
  deepCopy(): G1Element;
  getFingerprint(): number;
  add(g1: G1Element): G1Element;
  negate(): G1Element;
  equals(g1: G1Element): boolean;
}

export type JsiG1Element = Pick<
  IBaseG1Element,
  | 'toBytes'
  | 'toHex'
  | 'toString'
  | 'isValid'
  | 'deepCopy'
  | 'getFingerprint'
  | 'add'
  | 'negate'
  | 'equals'
>;

export interface IG1Element extends IBaseG1Element {
  fromBytes(bytes: Uint8Array): G1Element;
  fromHex(hex: string): G1Element;
  generator(): G1Element;
}

export class G1Element implements IBaseG1Element {
  private functionCache: Partial<JsiG1Element>;
  static SIZE: number = 48;

  constructor() {
    this.functionCache = {};
  }

  private getFunctionFromCache<T extends keyof JsiG1Element>(
    functionName: T
  ): JsiG1Element[T] {
    if (this.functionCache[functionName] == null) {
      this.functionCache[functionName] = bls.G1Element[functionName];
    }
    return this.functionCache[functionName] as JsiG1Element[T];
  }

  static fromBytes(bytes: Uint8Array): G1Element {
    return bls.G1Element.fromBytes(bytes);
  }

  static fromHex(hex: string): G1Element {
    return bls.G1Element.fromHex(hex);
  }

  static generator(): G1Element {
    return bls.G1Element.generator();
  }

  toBytes(): Uint8Array {
    const func = this.getFunctionFromCache('toBytes');
    return func();
  }

  toHex(): string {
    const func = this.getFunctionFromCache('toHex');
    return func();
  }

  toString(): string {
    const func = this.getFunctionFromCache('toString');
    return func();
  }

  isValid(): boolean {
    const func = this.getFunctionFromCache('isValid');
    return func();
  }

  deepCopy(): G1Element {
    const func = this.getFunctionFromCache('deepCopy');
    return func();
  }

  getFingerprint(): number {
    const func = this.getFunctionFromCache('getFingerprint');
    return func();
  }

  add(g1: G1Element): G1Element {
    const func = this.getFunctionFromCache('add');
    return func(g1);
  }

  negate(): G1Element {
    const func = this.getFunctionFromCache('negate');
    return func();
  }

  equals(g1: G1Element): boolean {
    const func = this.getFunctionFromCache('equals');
    return func(g1);
  }
}

// export abstract class G1Element implements JsiG1Element {
// abstract toBytes(): Uint8Array;
// abstract toHex(): string;
// abstract toString(): string;
// abstract isValid(): boolean;
// abstract deepCopy(): G1Element;
// abstract getFingerprint(): number;
// abstract add(g1: G1Element): G1Element;
// abstract negate(): G1Element;
// abstract equals(g1: G1Element): boolean;

// static SIZE: number = 48;

// static fromBytes(bytes: Uint8Array): G1Element {
//   return bls.G1Element.fromBytes(bytes);
// }

// static fromHex(hex: string): G1Element {
//   return bls.G1Element.fromHex(hex);
// }

// static generator(): G1Element {
//   return bls.G1Element.generator();
// }
// }
