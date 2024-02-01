import type { G1Element } from './G1Element';
import type { G2Element } from './G2Element';
import type { PrivateKey } from './PrivateKey';

export interface JsiPopSchemeMPL {
  skToG1(sk: PrivateKey): G1Element;
  keyGen(seed: Uint8Array): PrivateKey;
  sign(sk: PrivateKey, msg: Uint8Array): G2Element;
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
  popVerify(pk: G1Element, signatureProof: G2Element): boolean;
  popProve(sk: PrivateKey): G2Element;
  fastAggregateVerify(
    pks: G1Element[],
    msg: Uint8Array,
    sig: G2Element
  ): boolean;
}
export class PopSchemeMPL {
  static skToG1(sk: PrivateKey): G1Element {
    return global.BlsApi.PopSchemeMPL.skToG1(sk);
  }

  static keyGen(seed: Uint8Array): PrivateKey {
    return global.BlsApi.PopSchemeMPL.keyGen(seed);
  }

  static sign(sk: PrivateKey, msg: Uint8Array): G2Element {
    return global.BlsApi.PopSchemeMPL.sign(sk, msg);
  }

  static verify(pk: G1Element, msg: Uint8Array, sig: G2Element): boolean {
    return global.BlsApi.PopSchemeMPL.verify(pk, msg, sig);
  }

  static aggregate(g2s: G2Element[]): G2Element {
    return global.BlsApi.PopSchemeMPL.aggregate(g2s);
  }

  static aggregateVerify(
    pks: G1Element[],
    msgs: Uint8Array[],
    sig: G2Element
  ): boolean {
    return global.BlsApi.PopSchemeMPL.aggregateVerify(pks, msgs, sig);
  }

  static deriveChildSk(sk: PrivateKey, index: number): PrivateKey {
    return global.BlsApi.PopSchemeMPL.deriveChildSk(sk, index);
  }

  static deriveChildSkUnhardened(sk: PrivateKey, index: number): PrivateKey {
    return global.BlsApi.PopSchemeMPL.deriveChildSkUnhardened(sk, index);
  }

  static deriveChildPkUnhardened(pk: G1Element, index: number): G1Element {
    return global.BlsApi.PopSchemeMPL.deriveChildPkUnhardened(pk, index);
  }

  static popVerify(pk: G1Element, signatureProof: G2Element): boolean {
    return global.BlsApi.PopSchemeMPL.popVerify(pk, signatureProof);
  }

  static popProve(sk: PrivateKey): G2Element {
    return global.BlsApi.PopSchemeMPL.popProve(sk);
  }

  static fastAggregateVerify(
    pks: G1Element[],
    msg: Uint8Array,
    sig: G2Element
  ): boolean {
    return global.BlsApi.PopSchemeMPL.fastAggregateVerify(pks, msg, sig);
  }
}
