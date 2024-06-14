import { bls } from '../NativeBls';
export interface IBaseG2Element {
  toBytes(): Uint8Array;
  toHex(): string;
  toString(): string;
  isValid(): boolean;
  deepCopy(): G2Element;
  add(g2: G2Element): G2Element;
  negate(): G2Element;
  equals(g2: G2Element): boolean;
}

export type JsiG2Element = Pick<
  IBaseG2Element,
  | 'toBytes'
  | 'toHex'
  | 'toString'
  | 'isValid'
  | 'deepCopy'
  | 'add'
  | 'negate'
  | 'equals'
>;

export interface IG2Element extends IBaseG2Element {
  fromBytes(bytes: Uint8Array): G2Element;
  fromHex(hex: string): G2Element;
  generator(): G2Element;
}

export class G2Element implements IBaseG2Element {
  private functionCache: Partial<JsiG2Element>;
  static SIZE: number = 96;

  constructor() {
    this.functionCache = {};
  }

  private getFunctionFromCache<T extends keyof JsiG2Element>(
    functionName: T
  ): JsiG2Element[T] {
    if (this.functionCache[functionName] == null) {
      this.functionCache[functionName] = bls.G2Element[functionName];
    }
    return this.functionCache[functionName] as JsiG2Element[T];
  }

  static fromBytes(bytes: Uint8Array): G2Element {
    return bls.G2Element.fromBytes(bytes);
  }

  static fromHex(hex: string): G2Element {
    return bls.G2Element.fromHex(hex);
  }

  static generator(): G2Element {
    return bls.G2Element.generator();
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

  deepCopy(): G2Element {
    const func = this.getFunctionFromCache('deepCopy');
    return func();
  }

  add(g2: G2Element): G2Element {
    const func = this.getFunctionFromCache('add');
    return func(g2);
  }

  negate(): G2Element {
    const func = this.getFunctionFromCache('negate');
    return func();
  }

  equals(g2: G2Element): boolean {
    const func = this.getFunctionFromCache('equals');
    return func(g2);
  }
}

// export abstract class G2Element implements JsiG2Element {
// abstract toBytes(): Uint8Array;
// abstract toHex(): string;
// abstract toString(): string;
// abstract isValid(): boolean;
// abstract deepCopy(): G2Element;
// abstract getFingerprint(): number;
// abstract add(g2: G2Element): G2Element;
// abstract negate(): G2Element;
// abstract equals(g2: G2Element): boolean;

// static SIZE: number = 48;

// static fromBytes(bytes: Uint8Array): G2Element {
//   return bls.G2Element.fromBytes(bytes);
// }

// static fromHex(hex: string): G2Element {
//   return bls.G2Element.fromHex(hex);
// }

// static generator(): G2Element {
//   return bls.G2Element.generator();
// }
// }

// export interface IG2Element {
//   toBytes(): Uint8Array;
//   toHex(): string;
//   toString(): string;
//   isValid(): boolean;
//   deepCopy(): G2Element;
//   add(g2: G2Element): G2Element;
//   negate(): G2Element;
//   equals(g2: G2Element): boolean;
//   fromBytes(bytes: Uint8Array): G2Element;
//   fromHex(hex: string): G2Element;
//   generator(): G2Element;
//   bug: string;
// }

// const jsiG2Element = bls.G2Element;
// export class G2Element {
//   static SIZE: number = 96;

//   bug(): string {
//     return jsiG2Element.bug;
//   }

//   static fromBytes(bytes: Uint8Array): G2Element {
//     return jsiG2Element.fromBytes(bytes);
//   }

//   static fromHex(hex: string): G2Element {
//     return jsiG2Element.fromHex(hex);
//   }

//   static generator(): G2Element {
//     return jsiG2Element.generator();
//   }

//   toBytes(): Uint8Array {
//     return jsiG2Element.toBytes();
//   }

//   toHex(): string {
//     return jsiG2Element.toHex();
//   }

//   toString(): string {
//     return jsiG2Element.toString();
//   }

//   isValid(): boolean {
//     return jsiG2Element.isValid();
//   }

//   deepCopy(): G2Element {
//     return jsiG2Element.deepCopy();
//   }

//   add(g2: G2Element): G2Element {
//     return jsiG2Element.add(g2);
//   }

//   negate(): G2Element {
//     return jsiG2Element.negate();
//   }

//   equals(g2: G2Element): boolean {
//     return jsiG2Element.equals(g2);
//   }
// }
