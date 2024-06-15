import { bls } from '../NativeBls';
export interface IBaseGTElement {
  toBytes(): ArrayBuffer;
  toHex(): string;
  toString(): string;
  deepCopy(): GTElement;
  equals(gT: GTElement): boolean;
}

export type JsiGTElement = Pick<
  IBaseGTElement,
  'toBytes' | 'toHex' | 'toString' | 'deepCopy' | 'equals'
>;

export interface IGTElement extends IBaseGTElement {
  SIZE: number;
  fromBytes(bytes: ArrayBuffer): GTElement;
  fromHex(hex: string): GTElement;
  unity(): GTElement;
}

export class GTElement implements IBaseGTElement {
  private functionCache: Partial<JsiGTElement>;
  static SIZE = bls.GTElement.SIZE;

  constructor() {
    this.functionCache = {};
  }

  private getFunctionFromCache<T extends keyof JsiGTElement>(
    functionName: T
  ): JsiGTElement[T] {
    if (this.functionCache[functionName] == null) {
      this.functionCache[functionName] = bls.GTElement[functionName];
    }
    return this.functionCache[functionName] as JsiGTElement[T];
  }

  static fromBytes(bytes: ArrayBuffer): GTElement {
    return bls.GTElement.fromBytes(bytes);
  }

  static fromHex(hex: string): GTElement {
    return bls.GTElement.fromHex(hex);
  }

  static unity(): GTElement {
    return bls.GTElement.unity();
  }

  toBytes(): ArrayBuffer {
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

  deepCopy(): GTElement {
    const func = this.getFunctionFromCache('deepCopy');
    return func();
  }

  equals(gT: GTElement): boolean {
    const func = this.getFunctionFromCache('equals');
    return func(gT);
  }
}

// export abstract class GTElement implements JsiGTElement {
// abstract toBytes(): ArrayBuffer;
// abstract toHex(): string;
// abstract toString(): string;
// abstract isValid(): boolean;
// abstract deepCopy(): GTElement;
// abstract getFingerprint(): number;
// abstract add(gT: GTElement): GTElement;
// abstract negate(): GTElement;
// abstract equals(gT: GTElement): boolean;

// static SIZE: number = 48;

// static fromBytes(bytes: ArrayBuffer): GTElement {
//   return bls.GTElement.fromBytes(bytes);
// }

// static fromHex(hex: string): GTElement {
//   return bls.GTElement.fromHex(hex);
// }

// static generator(): GTElement {
//   return bls.GTElement.generator();
// }
// }

// export interface JsiGTElement {
// toBytes(): ArrayBuffer;
// toHex(): string;
// toString(): string;
// deepCopy(): GTElement;
// equals(gT: GTElement): boolean;
// }

// export interface JsiGTElementWithStatic {
//   SIZE: number;
//   fromBytes(bytes: ArrayBuffer): GTElement;
//   fromHex(hex: string): GTElement;
//   unity(): GTElement;
// }

// export abstract class GTElement implements JsiGTElement {
//   abstract toBytes(): ArrayBuffer;
//   abstract toHex(): string;
//   abstract toString(): string;
//   abstract deepCopy(): GTElement;
//   abstract equals(gT: GTElement): boolean;

//   static SIZE = bls.GTElement.SIZE;

//   static fromBytes(bytes: ArrayBuffer): GTElement {
//     return bls.GTElement.fromBytes(bytes);
//   }

//   static fromHex(hex: string): GTElement {
//     return bls.GTElement.fromHex(hex);
//   }

//   static unity(): GTElement {
//     return bls.GTElement.unity();
//   }
// }
