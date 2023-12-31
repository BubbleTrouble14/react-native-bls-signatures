declare global {
  function createG2Element(): CppG2Element;
}

export interface IG2Element {
  toBytes(): Uint8Array;
  toHex(): string;
  fromBytes(bytes: Uint8Array): IG2Element;
  fromHex(hex: string): IG2Element;
  add(g2e: IG2Element): IG2Element;
  negate(): IG2Element;
  equalTo(g2e: IG2Element): boolean;
}

type CppG2Element = Pick<
  IG2Element,
  'toBytes' | 'toHex' | 'fromBytes' | 'fromHex' | 'add' | 'negate' | 'equalTo'
>;

const createG2Element = (): CppG2Element => {
  if (global.createG2Element == null)
    throw new Error(
      'Failed to create a new G2Element instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  return global.createG2Element();
};

export class G2Element {
  private instance: CppG2Element;

  constructor(instance: CppG2Element) {
    this.instance = instance;
  }

  static fromBytes(bytes: Uint8Array): G2Element {
    return new G2Element(createG2Element().fromBytes(bytes));
  }

  static fromHex(hex: string): G2Element {
    return new G2Element(createG2Element().fromHex(hex));
  }

  toBytes(): Uint8Array {
    return this.instance.toBytes();
  }

  toHex(): string {
    return this.instance.toHex();
  }

  add(g2e: G2Element): G2Element {
    return new G2Element(this.instance.add(g2e.getCppG2Element()));
  }

  negate(): G2Element {
    return new G2Element(this.instance.negate());
  }

  equals(g2e: G2Element): boolean {
    return this.instance.equalTo(g2e.getCppG2Element());
  }

  getCppG2Element(): CppG2Element {
    return this.instance;
  }
}
