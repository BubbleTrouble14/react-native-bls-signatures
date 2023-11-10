import type { IPrivateKey } from '../PrivateKey';
import { PrivateKey } from '../PrivateKey';
import type { IG1Element } from '../elements/G1Element';
import { G1Element } from '../elements/G1Element';
import { IG2Element, G2Element } from '../elements/G2Element';

declare global {
  function createAugSchemeMPLInstance(): CppAugSchemeMPL;
}

export interface IAugSchemeMPL {
  skToG1(sk: IPrivateKey): IG1Element;
  keyGen(seed: Uint8Array): IPrivateKey;
  sign(sk: IPrivateKey, msg: Uint8Array): IG2Element;
  signPrepend(
    sk: IPrivateKey,
    msg: Uint8Array,
    prependPk: IG1Element
  ): IG2Element;
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

type CppAugSchemeMPL = Pick<
  IAugSchemeMPL,
  | 'skToG1'
  | 'keyGen'
  | 'sign'
  | 'signPrepend'
  | 'verify'
  | 'aggregate'
  | 'aggregateVerify'
  | 'deriveChildSk'
  | 'deriveChildSkUnhardened'
  | 'deriveChildPkUnhardened'
>;

const createAugSchemeMPL = (): CppAugSchemeMPL => {
  if (global.createAugSchemeMPLInstance == null)
    throw new Error(
      'Failed to create a new AugSchemeMPL instance, the native initializer function does not exist. Are you trying to use AugSchemeMPL from different JS Runtimes?'
    );
  return global.createAugSchemeMPLInstance();
};

export class AugSchemeMPL {
  static skToG1(sk: PrivateKey): G1Element {
    return new G1Element(createAugSchemeMPL().skToG1(sk.getCppPrivateKey()));
  }

  static keyGen(seed: Uint8Array): PrivateKey {
    return new PrivateKey(createAugSchemeMPL().keyGen(seed));
  }

  static sign(sk: PrivateKey, msg: Uint8Array): G2Element {
    return new G2Element(createAugSchemeMPL().sign(sk.getCppPrivateKey(), msg));
  }

  static signPrepend(
    sk: PrivateKey,
    msg: Uint8Array,
    prependPk: G1Element
  ): G2Element {
    return new G2Element(
      createAugSchemeMPL().signPrepend(
        sk.getCppPrivateKey(),
        msg,
        prependPk.getCppG1Element()
      )
    );
  }

  static verify(pk: G1Element, msg: Uint8Array, sig: G2Element): boolean {
    return createAugSchemeMPL().verify(
      pk.getCppG1Element(),
      msg,
      sig.getCppG2Element()
    );
  }

  static aggregate(g2s: G2Element[]): G2Element {
    return new G2Element(
      createAugSchemeMPL().aggregate(g2s.map((g2) => g2.getCppG2Element()))
    );
  }

  static aggregateVerify(
    pks: G1Element[],
    msgs: Uint8Array[],
    sig: G2Element
  ): boolean {
    return createAugSchemeMPL().aggregateVerify(
      pks.map((pk) => pk.getCppG1Element()),
      msgs,
      sig.getCppG2Element()
    );
  }

  static deriveChildSk(sk: PrivateKey, index: number): PrivateKey {
    return new PrivateKey(
      createAugSchemeMPL().deriveChildSk(sk.getCppPrivateKey(), index)
    );
  }

  static deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey {
    return new PrivateKey(
      createAugSchemeMPL().deriveChildSkUnhardened(sk.getCppPrivateKey(), index)
    );
  }

  static deriveChildPkUnhardened(pk: G1Element, index: number): G1Element {
    return new G1Element(
      createAugSchemeMPL().deriveChildPkUnhardened(pk.getCppG1Element(), index)
    );
  }
}
