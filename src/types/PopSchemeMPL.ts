import type { G1Element } from './G1Element';
import type { G2Element } from './G2Element';
import type { PrivateKey } from './PrivateKey';
import { bls } from '../NativeBls';

export interface JsiPopSchemeMPL {
  skToG1(sk: PrivateKey): G1Element;
  keyGen(seed: ArrayBuffer): PrivateKey;
  sign(sk: PrivateKey, msg: ArrayBuffer): G2Element;
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
  popVerify(pk: G1Element, signatureProof: G2Element): boolean;
  popProve(sk: PrivateKey): G2Element;
  fastAggregateVerify(
    pks: G1Element[],
    msg: ArrayBuffer,
    sig: G2Element
  ): boolean;
}
export class PopSchemeMPL {
  static skToG1(sk: PrivateKey): G1Element {
    return bls.PopSchemeMPL.skToG1(sk);
  }

  static keyGen(seed: ArrayBuffer): PrivateKey {
    return bls.PopSchemeMPL.keyGen(seed);
  }

  static sign(sk: PrivateKey, msg: ArrayBuffer): G2Element {
    return bls.PopSchemeMPL.sign(sk, msg);
  }

  static verify(pk: G1Element, msg: ArrayBuffer, sig: G2Element): boolean {
    return bls.PopSchemeMPL.verify(pk, msg, sig);
  }

  static aggregate(g2s: G2Element[]): G2Element {
    return bls.PopSchemeMPL.aggregate(g2s);
  }

  static aggregateVerify(
    pks: G1Element[],
    msgs: ArrayBuffer[],
    sig: G2Element
  ): boolean {
    return bls.PopSchemeMPL.aggregateVerify(pks, msgs, sig);
  }

  static deriveChildSk(sk: PrivateKey, index: number): PrivateKey {
    return bls.PopSchemeMPL.deriveChildSk(sk, index);
  }

  static deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey {
    return bls.PopSchemeMPL.deriveChildSkUnhardened(sk, index);
  }

  static deriveChildPkUnhardened(pk: G1Element, index: number): G1Element {
    return bls.PopSchemeMPL.deriveChildPkUnhardened(pk, index);
  }

  static popVerify(pk: G1Element, signatureProof: G2Element): boolean {
    return bls.PopSchemeMPL.popVerify(pk, signatureProof);
  }

  static popProve(sk: PrivateKey): G2Element {
    return bls.PopSchemeMPL.popProve(sk);
  }

  static fastAggregateVerify(
    pks: G1Element[],
    msg: ArrayBuffer,
    sig: G2Element
  ): boolean {
    return bls.PopSchemeMPL.fastAggregateVerify(pks, msg, sig);
  }
}
