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

This scheme is from the BLS spec in the IETF. AugSchemeMPL is used by the Chia Network and is more secure but less efficient.

### static skToG1(sk)

- `sk` is a `PrivateKey`.
- Returns a `G1Element`.

### static keyGen(seed)

- `seed` is a `Uint8Array`.
- Returns a `PrivateKey`.

### static sign(sk, msg)

- `sk` is a `PrivateKey`.
- `msg` is a `Uint8Array`.
- Returns a `G2Element` signature.

### static signPrepend(sk, msg, prependPk)

- `sk` is a `PrivateKey`.
- `msg` is a `Uint8Array`.
- `prependPk` is a `G1Element`.
- Returns a `G2Element` signature.

### static verify(pk, msg, sig)

- `pk` is a `G1Element` public key.
- `msg` is a `Uint8Array`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` for if the signature is valid.

### static aggregate(g2s)

- `g2s` is an `Array<G2Element>`.
- Returns an aggregated `G2Element`.

### static aggregateVerify(pks, msgs, sig)

- `pks` is an `Array<G1Element>` of public keys.
- `msgs` is an `Array<Uint8Array>`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` for if the signatures are valid.

### static deriveChildSk(sk, index)

- `sk` is a `PrivateKey`.
- `index` is a `number`.
- Returns the hardened child `PrivateKey` at the index.

### static deriveChildSkUnhardened(sk, index)

- `sk` is a `PrivateKey`.
- `index` is a `number`.
- Returns the unhardened child `PrivateKey` at the index.

### static deriveChildPkUnhardened(pk, index)

- `pk` is a `G1Element` public key.
- `index` is a `number`.
- Returns the unhardened child `G1Element` public key at the index.

## BasicSchemeMPL

This scheme is from the BLS spec in the IETF. BasicSchemeMPL is very fast, but not as secure as the other schemes.

### static skToG1(sk)

- `sk` is a `PrivateKey`.
- Returns a `G1Element`.

### static keyGen(seed)

- `seed` is a `Uint8Array`.
- Returns a `PrivateKey`.

### static sign(sk, msg)

- `sk` is a `PrivateKey`.
- `msg` is a `Uint8Array`.
- Returns a `G2Element` signature.

### static verify(pk, msg, sig)

- `pk` is a `G1Element` public key.
- `msg` is a `Uint8Array`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` for if the signature is valid.

### static aggregate(g2s)

- `g2s` is an `Array<G2Element>`.
- Returns an aggregated `G2Element`.

### static aggregateVerify(pks, msgs, sig)

- `pks` is an `Array<G1Element>` of public keys.
- `msgs` is an `Array<Uint8Array>`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` for if the signatures are valid.

### static deriveChildSk(sk, index)

- `sk` is a `PrivateKey`.
- `index` is a `number`.
- Returns the hardened child `PrivateKey` at the index.

### static deriveChildSkUnhardened(sk, index)

- `sk` is a `PrivateKey`.
- `index` is a `number`.
- Returns the unhardened child `PrivateKey` at the index.

### static deriveChildPkUnhardened(pk, index)

- `pk` is a `G1Element` public key.
- `index` is a `number`.
- Returns the unhardened child `G1Element` public key at the index.

## PopSchemeMPL

This scheme is from the BLS spec in the IETF. PopSchemeMPL is secure, but it requires registration, for example with Ethereum 2.0 Proof of Stake.

### static skToG1(sk)

- `sk` is a `PrivateKey`.
- Returns a `G1Element`.

### static keyGen(seed)

- `seed` is a `Uint8Array`.
- Returns a `PrivateKey`.

### static sign(sk, msg)

- `sk` is a `PrivateKey`.
- `msg` is a `Uint8Array`.
- Returns a `G2Element` signature.

### static verify(pk, msg, sig)

- `pk` is a `G1Element` public key.
- `msg` is a `Uint8Array`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` for if the signature is valid.

### static aggregate(g2s)

- `g2s` is an `Array<G2Element>`.
- Returns an aggregated `G2Element`.

### static aggregateVerify(pks, msgs, sig)

- `pks` is an `Array<G1Element>` of public keys.
- `msgs` is an `Array<Uint8Array>`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` for if the signatures are valid.

### static deriveChildSk(sk, index)

- `sk` is a `PrivateKey`.
- `index` is a `number`.
- Returns the hardened child `PrivateKey` at the index.

### static deriveChildSkUnhardened(sk, index)

- `sk` is a `PrivateKey`.
- `index` is a `number`.
- Returns the unhardened child `PrivateKey` at the index.

### static deriveChildPkUnhardened(pk, index)

- `pk` is a `G1Element` public key.
- `index` is a `number`.
- Returns the unhardened child `G1Element` public key at the index.

### static popVerify(pk, signatureProof)

- `pk` is a `G1Element` public key.
- `signatureProof` is a `G2Element`.
- Returns a `boolean` indicating whether the proof of possession is valid.

### static popProve(sk)

- `sk` is a `PrivateKey`.
- Returns a `G2Element` as the proof of possession.

### static fastAggregateVerify(pks, msg, sig)

- `pks` is an `Array<G1Element>` of public keys.
- `msg` is a `Uint8Array`.
- `sig` is a `G2Element` signature.
- Returns a `boolean` indicating if the aggregated signature is valid.

## PrivateKey

### static fromBytes(bytes, modOrder)

- `bytes` is a `Uint8Array` representing the private key.
- `modOrder` is an optional `boolean` (default is `false`).
- Returns a `PrivateKey` instance.

### static fromHex(hex)

- `hex` is a `string` representing the private key in hexadecimal format.
- Returns a `PrivateKey` instance.

### static aggregate(privateKeys)

- `privateKeys` is an `Array<PrivateKey>`.
- Returns a new aggregated `PrivateKey` instance.

### toBytes()

- Returns a `Uint8Array` representing this private key.

### toHex()

- Returns a `string` representing the hexadecimal format of this private key.

### toString()

- Returns a `string` representing the string format of this private key.

### equalTo(value)

- `value` is another `PrivateKey` instance.
- Returns a `boolean` indicating if this private key is equal to the given value.

### getG1()

- Returns a `G1Element` associated with this private key.

### getG2()

- Returns a `G2Element` associated with this private key.

## G1Element

A G1Element which is used for public keys and signatures, respectively.

### static fromBytes(bytes)

- `bytes` is a `Uint8Array` representing the G1 element.
- Returns a `G1Element` instance.

### static fromHex(hex)

- `hex` is a `string` representing the G1 element in hexadecimal format.
- Returns a `G1Element` instance.

### toBytes()

- Returns a `Uint8Array` representing this G1 element.

### toHex()

- Returns a `string` representing the hexadecimal format of this G1 element.

### getFingerPrint()

- Returns a `number` representing the fingerprint of this G1 element.

### add(e1)

- `e1` is another `G1Element`.
- Returns a new `G1Element` which is the result of adding this element to `e1`.

### negate()

- Returns a new `G1Element` which is the negation of this element.

### equalTo(value)

- `value` is another `G1Element`.
- Returns a `boolean` indicating if this G1 element is equal to the given value.

## G2Element

A G2Element which is used for public keys and signatures, respectively.

### static fromBytes(bytes)

- `bytes` is a `Uint8Array` representing the G1 element.
- Returns a `G2Element` instance.

### static fromHex(hex)

- `hex` is a `string` representing the G1 element in hexadecimal format.
- Returns a `G2Element` instance.

### toBytes()

- Returns a `Uint8Array` representing this G1 element.

### toHex()

- Returns a `string` representing the hexadecimal format of this G1 element.

### add(e1)

- `e1` is another `G2Element`.
- Returns a new `G2Element` which is the result of adding this element to `e1`.

### negate()

- Returns a new `G2Element` which is the negation of this element.

### equalTo(value)

- `value` is another `G2Element`.
- Returns a `boolean` indicating if this G1 element is equal to the given value.

## Utils

This is a collection of utils that can be directly imported and called, and are not part of a class.

## hash256

Computes the SHA-256 hash of the given message.

- `msg`: `Uint8Array` - Message to be hashed.
- Returns: `Uint8Array` - SHA-256 hash of the message.

---

## toHex

Converts a byte array to its hexadecimal representation.

- `bytes`: `Uint8Array` - Byte array to convert.
- Returns: `string` - Hexadecimal format of the byte array.

---

## fromHex

Converts a hexadecimal string to a byte array.

- `hex`: `string` - Hexadecimal input.
- Returns: `Uint8Array` - Byte array of the hexadecimal string.

---

## getRandomSeed

Generates a random seed.

- Returns: `Uint8Array` - Generated random seed.

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
