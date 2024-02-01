# React Native BLS Signatures

This is a React Native wrapper for [BLS Signatures](https://github.com/Chia-Network/bls-signatures) that offers quick and direct bindings to the native C++ library, accessible through a user-friendly TypeScript API.

## Installation

To use this library in your React Native project run the following command:

```sh
yarn add react-native-bls-signatures
```

or

```sh
npm install react-native-bls-signatures
```

## Example

```typescript
const seed = Uint8Array.from([
  0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
  58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
]);

const sk = AugSchemeMPL.keyGen(seed);
const pk = sk.getG1();

const message = Uint8Array.from([1, 2, 3, 4, 5]);
const signature = AugSchemeMPL.sign(sk, message);

const ok = AugSchemeMPL.verify(pk, message, signature);
console.log(ok); // true
```

## Documentation

- [AugSchemeMPL](#augschemempl)
- [BasicSchemeMPL](#basicschemempl)
- [PopSchemeMPL](#popschemempl)
- [PrivateKey](#privatekey)
- [G1Element](#g1element)
- [G2Element](#g2element)
- [Utils](#utils)

## AugSchemeMPL

### Static Methods:

- **skToG1**(_sk:_ `PrivateKey`) -> `G1Element`
- **keyGen**(_seed:_ `Uint8Array`) -> `PrivateKey`
- **sign**(_sk:_ `PrivateKey`, _msg:_ `Uint8Array`) -> `G2Element`
- **signPrepend**(_sk:_ `PrivateKey`, _msg:_ `Uint8Array`, _prependPk:_ `G1Element`) -> `G2Element`
- **verify**(_pk:_ `G1Element`, _msg:_ `Uint8Array`, _sig:_ `G2Element`) -> `boolean`
- **aggregate**(_g2Elements:_ `G2Element[]`) -> `G2Element`
- **aggregateVerify**(_pks:_ `G1Element[]`, _msgs:_ `Uint8Array[]`, _sig:_ `G2Element`) -> `boolean`
- **deriveChildSk**(_sk:_ `PrivateKey`, _index:_ `number`) -> `PrivateKey`
- **deriveChildSkUnhardened**(_sk:_ `PrivateKey`, _index:_ `number`) -> `PrivateKey`
- **deriveChildPkUnhardened**(_pk:_ `G1Element`, _index:_ `number`) -> `G1Element`

## BasicSchemeMPL

### Static Methods:

- **skToG1**(_sk:_ `PrivateKey`) -> `G1Element`
- **keyGen**(_seed:_ `Uint8Array`) -> `PrivateKey`
- **sign**(_sk:_ `PrivateKey`, _msg:_ `Uint8Array`) -> `G2Element`
- **verify**(_pk:_ `G1Element`, _msg:_ `Uint8Array`, _sig:_ `G2Element`) -> `boolean`
- **aggregate**(_g2Elements:_ `G2Element[]`) -> `G2Element`
- **aggregateVerify**(_pks:_ `G1Element[]`, _msgs:_ `Uint8Array[]`, _sig:_ `G2Element`) -> `boolean`
- **deriveChildSk**(_sk:_ `PrivateKey`, _index:_ `number`) -> `PrivateKey`
- **deriveChildSkUnhardened**(_sk:_ `PrivateKey`, _index:_ `number`) -> `PrivateKey`
- **deriveChildPkUnhardened**(_pk:_ `G1Element`, _index:_ `number`) -> `G1Element`

## PopSchemeMPL

### Static Methods:

- **skToG1**(_sk:_ `PrivateKey`) -> `G1Element`
- **keyGen**(_seed:_ `Uint8Array`) -> `PrivateKey`
- **sign**(_sk:_ `PrivateKey`, _msg:_ `Uint8Array`) -> `G2Element`
- **verify**(_pk:_ `G1Element`, _msg:_ `Uint8Array`, _sig:_ `G2Element`) -> `boolean`
- **aggregate**(_g2Elements:_ `G2Element[]`) -> `G2Element`
- **aggregateVerify**(_pks:_ `G1Element[]`, _msgs:_ `Uint8Array[]`, _sig:_ `G2Element`) -> `boolean`
- **deriveChildSk**(_sk:_ `PrivateKey`, _index:_ `number`) -> `PrivateKey`
- **deriveChildSkUnhardened**(_sk:_ `PrivateKey`, _index:_ `number`) -> `PrivateKey`
- **deriveChildPkUnhardened**(_pk:_ `G1Element`, _index:_ `number`) -> `G1Element`
- **popVerify**(_pk:_ `G1Element`, _sigProof:_ `G2Element`) -> `boolean`
- **popProve**(_sk:_ `PrivateKey`) -> `G2Element`
- **fastAggregateVerify**(_pks:_ `G1Element[]`, _msg:_ `Uint8Array`, _sig:_ `G2Element`) -> `boolean`

## PrivateKey

### Static Methods:

- **fromBytes**(_bytes:_ `Uint8Array`, _modOrder_?: `boolean`) -> `PrivateKey`
- **fromHex**(_hex:_ `string`) -> `PrivateKey`
- **aggregate**(_pks:_ `PrivateKey[]`) -> `PrivateKey`

### Methods:

- **toBytes()** -> `Uint8Array`
- **toHex()** -> `string`
- **toString()** -> `string`
- **equals**(_sk:_ `PrivateKey`) -> `boolean`
- **getG1()** -> `G1Element`
- **getG2()** -> `G2Element`

## G1Element

### Static Methods:

- **fromBytes**(_bytes:_ `Uint8Array`) -> `G1Element`
- **fromHex**(_hex:_ `string`) -> `G1Element`

### Methods:

- **toBytes()** -> `Uint8Array`
- **toHex()** -> `string`
- **getFingerPrint()** -> `number`
- **add**(_g1e:_ `G1Element`) -> `G1Element`
- **negate()** -> `G1Element`
- **equals**(_g1e:_ `G1Element`) -> `boolean`

## G2Element

### Static Methods:

- **fromBytes**(_bytes:_ `Uint8Array`) -> `G2Element`
- **fromHex**(_hex:_ `string`) -> `G2Element`

### Methods:

- **toBytes()** -> `Uint8Array`
- **toHex()** -> `string`
- **add**(_g2e:_ `G2Element`) -> `G2Element`
- **negate()** -> `G2Element`
- **equals**(_g2e:_ `G2Element`) -> `boolean`

## Utils

- **hash256**(_msg:_ `Uint8Array`) -> `Uint8Array`
- **toHex**(_bytes:_ `Uint8Array`) -> `string`
- **fromHex**(_hex:_ `string`) -> `Uint8Array`
- **getRandomSeed()** -> `Uint8Array` (Used for testing)

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
