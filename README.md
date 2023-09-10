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

## `AugSchemeMPL`

### Static Methods:

- **`skToG1(sk: PrivateKey)`**: Returns `G1Element`
- **`keyGen(seed: Uint8Array)`**: Returns `PrivateKey`
- **`sign(sk: PrivateKey, msg: Uint8Array)`**: Returns `G2Element`
- **`signPrepend(sk: PrivateKey, msg: Uint8Array, prependPk: G1Element)`**: Returns `G2Element`
- **`verify(pk: G1Element, msg: Uint8Array, sig: G2Element)`**: Returns `boolean`
- **`aggregate(g2s: Array<G2Element>)`**: Returns `G2Element`
- **`aggregateVerify(pks: Array<G1Element>, msgs: Array<Uint8Array>, sig: G2Element)`**: Returns `boolean`
- **`deriveChildSk(sk: PrivateKey, index: number)`**: Returns `PrivateKey`
- **`deriveChildSkUnhardened(sk: PrivateKey, index: number)`**: Returns `PrivateKey`
- **`deriveChildPkUnhardened(pk: G1Element, index: number)`**: Returns `G1Element`

## `BasicSchemeMPL`

### Static Methods:

- **`skToG1(sk: PrivateKey)`**: Returns `G1Element`
- **`keyGen(seed: Uint8Array)`**: Returns `PrivateKey`
- **`sign(sk: PrivateKey, msg: Uint8Array)`**: Returns `G2Element`
- **`verify(pk: G1Element, msg: Uint8Array, sig: G2Element)`**: Returns `boolean`
- **`aggregate(g2s: Array<G2Element>)`**: Returns `G2Element`
- **`aggregateVerify(pks: Array<G1Element>, msgs: Array<Uint8Array>, sig: G2Element)`**: Returns `boolean`
- **`deriveChildSk(sk: PrivateKey, index: number)`**: Returns `PrivateKey`
- **`deriveChildSkUnhardened(sk: PrivateKey, index: number)`**: Returns `PrivateKey`
- **`deriveChildPkUnhardened(pk: G1Element, index: number)`**: Returns `G1Element`

## `PopSchemeMPL`

### Static Methods:

- **`skToG1(sk: PrivateKey)`**: Returns `G1Element`
- **`keyGen(seed: Uint8Array)`**: Returns `PrivateKey`
- **`sign(sk: PrivateKey, msg: Uint8Array)`**: Returns `G2Element`
- **`verify(pk: G1Element, msg: Uint8Array, sig: G2Element)`**: Returns `boolean`
- **`aggregate(g2s: Array<G2Element>)`**: Returns `G2Element`
- **`aggregateVerify(pks: Array<G1Element>, msgs: Array<Uint8Array>, sig: G2Element)`**: Returns `boolean`
- **`deriveChildSk(sk: PrivateKey, index: number)`**: Returns `PrivateKey`
- **`deriveChildSkUnhardened(sk: PrivateKey, index: number)`**: Returns `PrivateKey`
- **`deriveChildPkUnhardened(pk: G1Element, index: number)`**: Returns `G1Element`
- **`popVerify(pk: G1Element, signatureProof: G2Element)`**: Returns `boolean`
- **`popProve(sk: PrivateKey)`**: Returns `G2Element`
- **`fastAggregateVerify(pks: Array<G1Element>, msg: Uint8Array, sig: G2Element)`**: Returns `boolean`

## `PrivateKey`

### Static Methods:

- **`fromBytes(bytes: Uint8Array, modOrder?: boolean)`**: Returns `PrivateKey`
- **`fromHex(hex: string)`**: Returns `PrivateKey`
- **`aggregate(privateKeys: Array<PrivateKey>)`**: Returns `PrivateKey`

### Methods:

- **`toBytes()`**: Returns `Uint8Array`
- **`toHex()`**: Returns `string`
- **`toString()`**: Returns `string`
- **`equalTo(value: PrivateKey)`**: Returns `boolean`
- **`getG1()`**: Returns `G1Element`
- **`getG2()`**: Returns `G2Element`

## `G1Element`

### Static Methods:

- **`fromBytes(bytes: Uint8Array)`**: Returns `G1Element`
- **`fromHex(hex: string)`**: Returns `G1Element`

### Methods:

- **`toBytes()`**: Returns `Uint8Array`
- **`toHex()`**: Returns `string`
- **`getFingerPrint()`**: Returns `number`
- **`add(e1: G1Element)`**: Returns `G1Element`
- **`negate()`**: Returns `G1Element`
- **`equalTo(value: G1Element)`**: Returns `boolean`

## `G2Element`

### Static Methods:

- **`fromBytes(bytes: Uint8Array)`**: Returns `G2Element`
- **`fromHex(hex: string)`**: Returns `G2Element`

### Methods:

- **`toBytes()`**: Returns `Uint8Array`
- **`toHex()`**: Returns `string`
- **`add(e2: G2Element)`**: Returns `G2Element`
- **`negate()`**: Returns `G2Element`
- **`equalTo(value: G2Element)`**: Returns `boolean`

## `Utils`

- **`hash256(msg: Uint8Array)`**: Returns SHA-256 hash
- **`toHex(bytes: Uint8Array)`**: Returns `string`
- **`fromHex(hex: string)`**: Returns `Uint8Array`
- **`getRandomSeed()`**: Returns `Uint8Array`

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
