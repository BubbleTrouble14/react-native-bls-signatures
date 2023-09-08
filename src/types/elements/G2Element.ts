declare global {
  function createG2Element(): CppG2Element;
}

export interface IG2Element {
  toBytes(): Uint8Array;
  toHex(): string;
  fromBytes(bytes: Uint8Array): IG2Element;
}

type CppG2Element = Pick<IG2Element, 'toBytes' | 'toHex' | 'fromBytes'>;

const createG2Element = (): CppG2Element => {
  if (global.createG2Element == null)
    throw new Error(
      'Failed to create a new G2Element instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  // const buffer = global.createPrivateKeyInstance();
  return global.createG2Element();
};

export class G2Element {
  private instance: CppG2Element;
  private static cppInstance: CppG2Element = createG2Element();

  constructor(instance: CppG2Element) {
    this.instance = instance;
  }

  static fromBytes(bytes: Uint8Array): G2Element {
    return new G2Element(this.cppInstance.fromBytes(bytes));
  }

  toBytes(): Uint8Array {
    return this.instance.toBytes();
  }

  toHex(): string {
    return this.instance.toHex();
  }

  getCppG2Element(): CppG2Element {
    return this.instance;
  }
}
