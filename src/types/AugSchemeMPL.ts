import { G1Element } from './G1Element';
import { G2Element } from './G2Element';
import { PrivateKey } from './PrivateKey';

export interface JsiAugSchemeMPL {
  skToG1(sk: PrivateKey): G1Element;
  keyGen(seed: Uint8Array): PrivateKey;
  sign(sk: PrivateKey, msg: Uint8Array): G2Element;
  signPrepend(sk: PrivateKey, msg: Uint8Array, prependPk: G1Element): G2Element;
  verify(pk: G1Element, msg: Uint8Array, sig: G2Element): boolean;
  aggregate(g2s: G2Element[]): G2Element;
  aggregateVerify(
    pks: G1Element[],
    msgs: Uint8Array[],
    sig: G2Element
  ): boolean;
  deriveChildSk(sk: PrivateKey, index: number): PrivateKey;
  deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey;
  deriveChildPkUnhardened(pk: G1Element, index: number): G1Element;
}

export class AugSchemeMPL {
  static skToG1(sk: PrivateKey): G1Element {
    return global.BlsApi.AugSchemeMPL.skToG1(sk);
  }

  static keyGen(seed: Uint8Array): PrivateKey {
    return global.BlsApi.AugSchemeMPL.keyGen(seed);
  }

  static sign(sk: PrivateKey, msg: Uint8Array): G2Element {
    return global.BlsApi.AugSchemeMPL.sign(sk, msg);
  }

  static signPrepend(
    sk: PrivateKey,
    msg: Uint8Array,
    prependPk: G1Element
  ): G2Element {
    return global.BlsApi.AugSchemeMPL.signPrepend(sk, msg, prependPk);
  }

  static verify(pk: G1Element, msg: Uint8Array, sig: G2Element): boolean {
    return global.BlsApi.AugSchemeMPL.verify(pk, msg, sig);
  }

  static aggregate(g2s: G2Element[]): G2Element {
    return global.BlsApi.AugSchemeMPL.aggregate(g2s);
  }

  static aggregateVerify(
    pks: G1Element[],
    msgs: Uint8Array[],
    sig: G2Element
  ): boolean {
    return global.BlsApi.AugSchemeMPL.aggregateVerify(pks, msgs, sig);
  }

  static deriveChildSk(sk: PrivateKey, index: number): PrivateKey {
    return global.BlsApi.AugSchemeMPL.deriveChildSk(sk, index);
  }

  static deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey {
    return global.BlsApi.AugSchemeMPL.deriveChildSkUnhardened(sk, index);
  }

  static deriveChildPkUnhardened(pk: G1Element, index: number): G1Element {
    return global.BlsApi.AugSchemeMPL.deriveChildPkUnhardened(pk, index);
  }
}
