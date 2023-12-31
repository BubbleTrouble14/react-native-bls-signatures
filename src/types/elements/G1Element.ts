declare global {
  function createG1Element(): CppG1Element;
}

export interface IG1Element {
  toBytes(): Uint8Array;
  toHex(): string;
  fromBytes(bytes: Uint8Array): IG1Element;
  fromHex(hex: string): IG1Element;
  getFingerprint(): number;
  add(g1e: IG1Element): IG1Element;
  negate(): IG1Element;
  equalTo(g1e: IG1Element): boolean;
}

type CppG1Element = Pick<
  IG1Element,
  | 'toBytes'
  | 'toHex'
  | 'fromBytes'
  | 'fromHex'
  | 'getFingerprint'
  | 'add'
  | 'negate'
  | 'equalTo'
>;

const createG1Element = (): CppG1Element => {
  if (global.createG1Element == null)
    throw new Error(
      'Failed to create a new G1Element instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  return global.createG1Element();
};

export class G1Element {
  private instance: CppG1Element;

  constructor(instance: CppG1Element) {
    this.instance = instance;
  }

  static fromBytes(bytes: Uint8Array): G1Element {
    return new G1Element(createG1Element().fromBytes(bytes));
  }

  static fromHex(hex: string): G1Element {
    return new G1Element(createG1Element().fromHex(hex));
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

  add(g1e: G1Element): G1Element {
    return new G1Element(this.instance.add(g1e.getCppG1Element()));
  }

  negate(): G1Element {
    return new G1Element(this.instance.negate());
  }

  equals(g1e: G1Element): boolean {
    return this.instance.equalTo(g1e.getCppG1Element());
  }

  getCppG1Element(): CppG1Element {
    return this.instance;
  }
}
