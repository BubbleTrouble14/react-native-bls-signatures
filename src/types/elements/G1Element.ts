declare global {
  function createG1Element(): CppG1Element;
}

export interface IG1Element {
  toBytes(): Uint8Array;
  toHex(): string;
  getFingerprint(): number;
  add(e1: IG1Element): IG1Element;
  fromBytes(bytes: Uint8Array): IG1Element;
  fromHex(hex: string): IG1Element;
  equalTo(key: IG1Element): boolean;
}

type CppG1Element = Pick<
  IG1Element,
  | 'toBytes'
  | 'toHex'
  | 'fromBytes'
  | 'getFingerprint'
  | 'add'
  | 'equalTo'
  | 'fromHex'
>;

const createG1Element = (): CppG1Element => {
  if (global.createG1Element == null)
    throw new Error(
      'Failed to create a new G1Element instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  // const buffer = global.createPrivateKeyInstance();
  return global.createG1Element();
};

export class G1Element {
  private instance: CppG1Element;
  private static cppInstance: CppG1Element = createG1Element();

  constructor(instance: CppG1Element) {
    this.instance = instance;
  }

  static fromBytes(bytes: Uint8Array): G1Element {
    return new G1Element(this.cppInstance.fromBytes(bytes));
  }

  static fromHex(hex: string): G1Element {
    return new G1Element(this.cppInstance.fromHex(hex));
  }

  toBytes(): Uint8Array {
    return this.instance.toBytes();
  }

  toHex(): string {
    return this.instance.toHex();
  }

  getFingerPrint(): number {
    return this.instance.getFingerprint();
  }

  add(e1: G1Element): G1Element {
    return new G1Element(this.instance.add(e1.getCppG1Element()));
  }

  equalTo(value: G1Element): boolean {
    return this.instance.equalTo(value.getCppG1Element());
  }

  getCppG1Element(): CppG1Element {
    return this.instance;
  }
}
