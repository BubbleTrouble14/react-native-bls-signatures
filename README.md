# react-native-bls-signatures

A React Native library for bls signatures.

## Documentation

- [AugSchemeMPL](#augschemempl)
- [BasicSchemeMPL](#basicschemempl)
- [PopSchemeMPL](#popschemempl)
- [PrivateKey](#privatekey)
- [G1Element](#g1element)
- [G2Element](#g2element)
- [Utils](#utils)

## AugSchemeMPL

- **static skToG1(sk: PrivateKey)**: `G1Element`.
- **static keyGen(seed: Uint8Array)**: `PrivateKey`.
- **static sign(sk: PrivateKey, msg: Uint8Array)**: `G2Element`.
- **static signPrepend(sk: PrivateKey, msg: Uint8Array, prependPk: G1Element)**: `G2Element`.
- **static verify(pk: G1Element, msg: Uint8Array, sig: G2Element)**: Boolean.
- **static aggregate(g2s: Array<G2Element>)**: `G2Element`.
- **static aggregateVerify(pks: Array<G1Element>, msgs: Array<Uint8Array>, sig: G2Element)**: Boolean.
- **static deriveChildSk(sk: PrivateKey, index: number)**: `PrivateKey`.
- **static deriveChildSkUnhardened(sk: PrivateKey, index: number)**: `PrivateKey`.
- **static deriveChildPkUnhardened(pk: G1Element, index: number)**: `G1Element`.

## BasicSchemeMPL

- **static skToG1(sk: PrivateKey)**: `G1Element`.
- **static keyGen(seed: Uint8Array)**: `PrivateKey`.
- **static sign(sk: PrivateKey, msg: Uint8Array)**: `G2Element`.
- **static verify(pk: G1Element, msg: Uint8Array, sig: G2Element)**: Boolean.
- **static aggregate(g2s: Array<G2Element>)**: `G2Element`.
- **static aggregateVerify(pks: Array<G1Element>, msgs: Array<Uint8Array>, sig: G2Element)**: Boolean.
- **static deriveChildSk(sk: PrivateKey, index: number)**: `PrivateKey`.
- **static deriveChildSkUnhardened(sk: PrivateKey, index: number)**: `PrivateKey`.
- **static deriveChildPkUnhardened(pk: G1Element, index: number)**: `G1Element`.

## PopSchemeMPL

- **static skToG1(sk: PrivateKey)**: `G1Element`.
- **static keyGen(seed: Uint8Array)**: `PrivateKey`.
- **static sign(sk: PrivateKey, msg: Uint8Array)**: `G2Element`.
- **static verify(pk: G1Element, msg: Uint8Array, sig: G2Element)**: Boolean.
- **static aggregate(g2s: Array<G2Element>)**: `G2Element`.
- **static aggregateVerify(pks: Array<G1Element>, msgs: Array<Uint8Array>, sig: G2Element)**: Boolean.
- **static deriveChildSk(sk: PrivateKey, index: number)**: `PrivateKey`.
- **static deriveChildSkUnhardened(sk: PrivateKey, index: number)**: `PrivateKey`.
- **static deriveChildPkUnhardened(pk: G1Element, index: number)**: `G1Element`.
- **static popVerify(pk: G1Element, signatureProof: G2Element)**: Boolean.
- **static popProve(sk: PrivateKey)**: `G2Element`.
- **static fastAggregateVerify(pks: Array<G1Element>, msg: Uint8Array, sig: G2Element)**: Boolean.

## `PrivateKey`

- **static fromBytes(bytes: Uint8Array, modOrder?: boolean)**: `PrivateKey`.
- **static fromHex(hex: string)**: `PrivateKey`.
- **static aggregate(privateKeys: Array<PrivateKey>)**: `PrivateKey`.
- **toBytes()**: `Uint8Array`
- **toHex()**: String.
- **toString()**: String.
- **equalTo(value: PrivateKey)**: Boolean.
- **getG1()**: `G1Element`
- **getG2()**: `G2Element`

## `G1Element`

- **static fromBytes(bytes: Uint8Array)**: `G1Element`.
- **static fromHex(hex: string)**: `G1Element`.
- **toBytes()**: `Uint8Array`
- **toHex()**: String.
- **getFingerPrint()**: Number.
- **add(e1: G1Element)**: `G1Element`
- **negate()**: `G1Element`
- **equalTo(value: G1Element)**: Boolean.

## `G2Element`

- **static fromBytes(bytes: Uint8Array)**: `G2Element`.
- **static fromHex(hex: string)**: `G2Element`.
- **toBytes()**: `Uint8Array`
- **toHex()**: String.
- **add(e2: G2Element)**: `G2Element`
- **negate()**: `G2Element`
- **equalTo(value: G2Element)**: Boolean.

## Utils

- **hash256(msg: Uint8Array)**: SHA-256 hash.
- **toHex(bytes: Uint8Array)**: String.
- **fromHex(hex: string)**: `Uint8Array`
- **getRandomSeed()**: `Uint8Array`

## Libsodium license

The libsodium static library is licensed under the ISC license which requires
the following copyright notice.

> ISC License
>
> Copyright (c) 2013-2020
> Frank Denis \<j at pureftpd dot org\>
>
> Permission to use, copy, modify, and/or distribute this software for any
> purpose with or without fee is hereby granted, provided that the above
> copyright notice and this permission notice appear in all copies.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
> WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
> MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
> ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
> WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
> ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
> OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## BLST license

BLST is used with the
[Apache 2.0 license](https://github.com/supranational/blst/blob/master/LICENSE)

## Resources

- [Chia-Network/bls-signatures](https://github.com/Chia-Network/bls-signatures) code for bls
- [Marc Rousavy](https://github.com/mrousavy) thanks for all the examples
- [animo/react-native-bbs-signatures](https://github.com/animo/react-native-bbs-signatures) also great example
