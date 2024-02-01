export interface IBaseGTElement {
  toBytes(): Uint8Array;
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
  fromBytes(bytes: Uint8Array): GTElement;
  fromHex(hex: string): GTElement;
  unity(): GTElement;
}

export class GTElement implements IBaseGTElement {
  private functionCache: Partial<JsiGTElement>;
  static SIZE = global.BlsApi.GTElement.SIZE;

  constructor() {
    this.functionCache = {};
  }

  private getFunctionFromCache<T extends keyof JsiGTElement>(
    functionName: T
  ): JsiGTElement[T] {
    if (this.functionCache[functionName] == null) {
      this.functionCache[functionName] = global.BlsApi.GTElement[functionName];
    }
    return this.functionCache[functionName] as JsiGTElement[T];
  }

  static fromBytes(bytes: Uint8Array): GTElement {
    return global.BlsApi.GTElement.fromBytes(bytes);
  }

  static fromHex(hex: string): GTElement {
    return global.BlsApi.GTElement.fromHex(hex);
  }

  static unity(): GTElement {
    return global.BlsApi.GTElement.unity();
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
// abstract toBytes(): Uint8Array;
// abstract toHex(): string;
// abstract toString(): string;
// abstract isValid(): boolean;
// abstract deepCopy(): GTElement;
// abstract getFingerprint(): number;
// abstract add(gT: GTElement): GTElement;
// abstract negate(): GTElement;
// abstract equals(gT: GTElement): boolean;

// static SIZE: number = 48;

// static fromBytes(bytes: Uint8Array): GTElement {
//   return global.BlsApi.GTElement.fromBytes(bytes);
// }

// static fromHex(hex: string): GTElement {
//   return global.BlsApi.GTElement.fromHex(hex);
// }

// static generator(): GTElement {
//   return global.BlsApi.GTElement.generator();
// }
// }

// export interface JsiGTElement {
// toBytes(): Uint8Array;
// toHex(): string;
// toString(): string;
// deepCopy(): GTElement;
// equals(gT: GTElement): boolean;
// }

// export interface JsiGTElementWithStatic {
//   SIZE: number;
//   fromBytes(bytes: Uint8Array): GTElement;
//   fromHex(hex: string): GTElement;
//   unity(): GTElement;
// }

// export abstract class GTElement implements JsiGTElement {
//   abstract toBytes(): Uint8Array;
//   abstract toHex(): string;
//   abstract toString(): string;
//   abstract deepCopy(): GTElement;
//   abstract equals(gT: GTElement): boolean;

//   static SIZE = global.BlsApi.GTElement.SIZE;

//   static fromBytes(bytes: Uint8Array): GTElement {
//     return global.BlsApi.GTElement.fromBytes(bytes);
//   }

//   static fromHex(hex: string): GTElement {
//     return global.BlsApi.GTElement.fromHex(hex);
//   }

//   static unity(): GTElement {
//     return global.BlsApi.GTElement.unity();
//   }
// }
