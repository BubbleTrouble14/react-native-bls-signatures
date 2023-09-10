## AugSchemeMPL

### Static Methods:

- **skToG1**(_sk_: `PrivateKey`): Returns `G1Element`
- **keyGen**(_seed_: `Uint8Array`): Returns `PrivateKey`
- **sign**(_sk_: `PrivateKey`, _msg_: `Uint8Array`): Returns `G2Element`
- **signPrepend**(_sk_: `PrivateKey`, _msg_: `Uint8Array`, _prependPk_: `G1Element`): Returns `G2Element`
- **verify**(_pk_: `G1Element`, _msg_: `Uint8Array`, _sig_: `G2Element`): Returns `boolean`
- **aggregate**(_g2s_: `Array<G2Element>`): Returns `G2Element`
- **aggregateVerify**(_pks_: `Array<G1Element>`, _msgs_: `Array<Uint8Array>`, _sig_: `G2Element`): Returns `boolean`
- **deriveChildSk**(_sk_: `PrivateKey`, _index_: `number`): Returns `PrivateKey`
- **deriveChildSkUnhardened**(_sk_: `PrivateKey`, _index_: `number`): Returns `PrivateKey`
- **deriveChildPkUnhardened**(_pk_: `G1Element`, _index_: `number`): Returns `G1Element`

## BasicSchemeMPL

### Static Methods:

- **skToG1**(_sk_: `PrivateKey`): Returns `G1Element`
- **keyGen**(_seed_: `Uint8Array`): Returns `PrivateKey`
- **sign**(_sk_: `PrivateKey`, _msg_: `Uint8Array`): Returns `G2Element`
- **verify**(_pk_: `G1Element`, _msg_: `Uint8Array`, _sig_: `G2Element`): Returns `boolean`
- **aggregate**(_g2s_: `Array<G2Element>`): Returns `G2Element`
- **aggregateVerify**(_pks_: `Array<G1Element>`, _msgs_: `Array<Uint8Array>`, _sig_: `G2Element`): Returns `boolean`
- **deriveChildSk**(_sk_: `PrivateKey`, _index_: `number`): Returns `PrivateKey`
- **deriveChildSkUnhardened**(_sk_: `PrivateKey`, _index_: `number`): Returns `PrivateKey`
- **deriveChildPkUnhardened**(_pk_: `G1Element`, _index_: `number`): Returns `G1Element`

## PopSchemeMPL

### Static Methods:

- **skToG1**(_sk_: `PrivateKey`): Returns `G1Element`
- **keyGen**(_seed_: `Uint8Array`): Returns `PrivateKey`
- **sign**(_sk_: `PrivateKey`, _msg_: `Uint8Array`): Returns `G2Element`
- **verify**(_pk_: `G1Element`, _msg_: `Uint8Array`, _sig_: `G2Element`): Returns `boolean`
- **aggregate**(_g2s_: `Array<G2Element>`): Returns `G2Element`
- **aggregateVerify**(_pks_: `Array<G1Element>`, _msgs_: `Array<Uint8Array>`, _sig_: `G2Element`): Returns `boolean`
- **deriveChildSk**(_sk_: `PrivateKey`, _index_: `number`): Returns `PrivateKey`
- **deriveChildSkUnhardened**(_sk_: `PrivateKey`, _index_: `number`): Returns `PrivateKey`
- **deriveChildPkUnhardened**(_pk_: `G1Element`, _index_: `number`): Returns `G1Element`
- **popVerify**(_pk_: `G1Element`, _signatureProof_: `G2Element`): Returns `boolean`
- **popProve**(_sk_: `PrivateKey`): Returns `G2Element`
- **fastAggregateVerify**(_pks_: `Array<G1Element>`, _msg_: `Uint8Array`, _sig_: `G2Element`): Returns `boolean`

## PrivateKey

### Static Methods:

- **fromBytes**(_bytes_: `Uint8Array`, _modOrder_?: `boolean`): Returns `PrivateKey`
- **fromHex**(_hex_: `string`): Returns `PrivateKey`
- **aggregate**(_privateKeys_: `Array<PrivateKey>`): Returns `PrivateKey`

### Methods:

- **toBytes()**: Returns `Uint8Array`
- **toHex()**: Returns `string`
- **toString()**: Returns `string`
- **equalTo**(_value_: `PrivateKey`): Returns `boolean`
- **getG1()**: Returns `G1Element`
- **getG2()**: Returns `G2Element`

## G1Element

### Static Methods:

- **fromBytes**(_bytes_: `Uint8Array`): Returns `G1Element`
- **fromHex**(_hex_: `string`): Returns `G1Element`

### Methods:

- **toBytes()**: Returns `Uint8Array`
- **toHex()**: Returns `string`
- **getFingerPrint()**: Returns `number`
- **add**(_e1_: `G1Element`): Returns `G1Element`
- **negate()**: Returns `G1Element`
- **equalTo**(_value_: `G1Element`): Returns `boolean`

## G2Element

### Static Methods:

- **fromBytes**(_bytes_: `Uint8Array`): Returns `G2Element`
- **fromHex**(_hex_: `string`): Returns `G2Element`

### Methods:

- **toBytes()**: Returns `Uint8Array`
- **toHex()**: Returns `string`
- **add**(_e2_: `G2Element`): Returns `G2Element`
- **negate()**: Returns `G2Element`
- **equalTo**(_value_: `G2Element`): Returns `boolean`

## Utils

- **hash256**(_msg_: `Uint8Array`): Returns SHA-256 hash
- **toHex**(_bytes_: `Uint8Array`): Returns `string`
- **fromHex**(_hex_: `string`): Returns `Uint8Array`
- **getRandomSeed()**: Returns `Uint8Array`
