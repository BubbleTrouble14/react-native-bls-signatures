import { G1Element } from './G1Element';
import { G2Element } from './G2Element';
import { PrivateKey } from './PrivateKey';
import { bls } from '../NativeBls';

export interface JsiAugSchemeMPL {
  skToG1(sk: PrivateKey): G1Element;
  keyGen(seed: ArrayBuffer): PrivateKey;
  sign(sk: PrivateKey, msg: ArrayBuffer): G2Element;
  signPrepend(
    sk: PrivateKey,
    msg: ArrayBuffer,
    prependPk: G1Element
  ): G2Element;
  verify(pk: G1Element, msg: ArrayBuffer, sig: G2Element): boolean;
  aggregate(g2s: G2Element[]): G2Element;
  aggregateVerify(
    pks: G1Element[],
    msgs: ArrayBuffer[],
    sig: G2Element
  ): boolean;
  deriveChildSk(sk: PrivateKey, index: number): PrivateKey;
  deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey;
  deriveChildPkUnhardened(pk: G1Element, index: number): G1Element;
}

export class AugSchemeMPL {
  static skToG1(sk: PrivateKey): G1Element {
    return bls.AugSchemeMPL.skToG1(sk);
  }

  static keyGen(seed: ArrayBuffer): PrivateKey {
    return bls.AugSchemeMPL.keyGen(seed);
  }

  static sign(sk: PrivateKey, msg: ArrayBuffer): G2Element {
    return bls.AugSchemeMPL.sign(sk, msg);
  }

  static signPrepend(
    sk: PrivateKey,
    msg: ArrayBuffer,
    prependPk: G1Element
  ): G2Element {
    return bls.AugSchemeMPL.signPrepend(sk, msg, prependPk);
  }

  static verify(pk: G1Element, msg: ArrayBuffer, sig: G2Element): boolean {
    return bls.AugSchemeMPL.verify(pk, msg, sig);
  }

  static aggregate(g2s: G2Element[]): G2Element {
    return bls.AugSchemeMPL.aggregate(g2s);
  }

  static aggregateVerify(
    pks: G1Element[],
    msgs: ArrayBuffer[],
    sig: G2Element
  ): boolean {
    return bls.AugSchemeMPL.aggregateVerify(pks, msgs, sig);
  }

  static deriveChildSk(sk: PrivateKey, index: number): PrivateKey {
    return bls.AugSchemeMPL.deriveChildSk(sk, index);
  }

  static deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey {
    return bls.AugSchemeMPL.deriveChildSkUnhardened(sk, index);
  }

  static deriveChildPkUnhardened(pk: G1Element, index: number): G1Element {
    return bls.AugSchemeMPL.deriveChildPkUnhardened(pk, index);
  }
}
