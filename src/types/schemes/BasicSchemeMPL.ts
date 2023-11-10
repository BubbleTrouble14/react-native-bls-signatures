import type { IPrivateKey } from '../PrivateKey';
import { PrivateKey } from '../PrivateKey';
import type { IG1Element } from '../elements/G1Element';
import { G1Element } from '../elements/G1Element';
import { IG2Element, G2Element } from '../elements/G2Element';

declare global {
  function createBasicSchemeMPLInstance(): CppBasicSchemeMPL;
}

export interface IBasicSchemeMPL {
  skToG1(sk: IPrivateKey): IG1Element;
  keyGen(seed: Uint8Array): IPrivateKey;
  sign(sk: IPrivateKey, msg: Uint8Array): IG2Element;
  verify(pk: IG1Element, msg: Uint8Array, signature: IG2Element): boolean;
  aggregate(g2Elements: IG2Element[]): IG2Element;
  aggregateVerify(
    pks: IG1Element[],
    msgs: Uint8Array[],
    sig: IG2Element
  ): boolean;
  deriveChildSk(sk: IPrivateKey, index: number): IPrivateKey;
  deriveChildSkUnhardened(sk: IPrivateKey, index: number): IPrivateKey;
  deriveChildPkUnhardened(pk: IG1Element, index: number): IG1Element;
}

type CppBasicSchemeMPL = Pick<
  IBasicSchemeMPL,
  | 'skToG1'
  | 'keyGen'
  | 'sign'
  | 'verify'
  | 'aggregate'
  | 'aggregateVerify'
  | 'deriveChildSk'
  | 'deriveChildSkUnhardened'
  | 'deriveChildPkUnhardened'
>;

const createBasicSchemeMPL = (): CppBasicSchemeMPL => {
  if (global.createBasicSchemeMPLInstance == null)
    throw new Error(
      'Failed to create a new BasicSchemeMPL instance, the native initializer function does not exist. Are you trying to use BasicSchemeMPL from different JS Runtimes?'
    );
  return global.createBasicSchemeMPLInstance();
};

export class BasicSchemeMPL {
  static skToG1(sk: PrivateKey): G1Element {
    return new G1Element(createBasicSchemeMPL().skToG1(sk.getCppPrivateKey()));
  }

  static keyGen(seed: Uint8Array): PrivateKey {
    return new PrivateKey(createBasicSchemeMPL().keyGen(seed));
  }

  static sign(sk: PrivateKey, msg: Uint8Array): G2Element {
    return new G2Element(
      createBasicSchemeMPL().sign(sk.getCppPrivateKey(), msg)
    );
  }

  static verify(pk: G1Element, msg: Uint8Array, sig: G2Element): boolean {
    return createBasicSchemeMPL().verify(
      pk.getCppG1Element(),
      msg,
      sig.getCppG2Element()
    );
  }

  static aggregate(g2s: G2Element[]): G2Element {
    return new G2Element(
      createBasicSchemeMPL().aggregate(g2s.map((g2) => g2.getCppG2Element()))
    );
  }

  static aggregateVerify(
    pks: G1Element[],
    msgs: Uint8Array[],
    sig: G2Element
  ): boolean {
    return createBasicSchemeMPL().aggregateVerify(
      pks.map((pk) => pk.getCppG1Element()),
      msgs,
      sig.getCppG2Element()
    );
  }

  static deriveChildSk(sk: PrivateKey, index: number): PrivateKey {
    return new PrivateKey(
      createBasicSchemeMPL().deriveChildSk(sk.getCppPrivateKey(), index)
    );
  }

  static deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey {
    return new PrivateKey(
      createBasicSchemeMPL().deriveChildSkUnhardened(
        sk.getCppPrivateKey(),
        index
      )
    );
  }

  static deriveChildPkUnhardened(pk: G1Element, index: number): G1Element {
    return new G1Element(
      createBasicSchemeMPL().deriveChildPkUnhardened(
        pk.getCppG1Element(),
        index
      )
    );
  }
}
