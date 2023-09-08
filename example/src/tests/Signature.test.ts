function getSignatureHex() {
  return '900d5223412ee471b42dbb8a6706de5f5eba4ca7e1a0fb6b3fa431f510b3e6d73c440748693d787e1a25c8bc4596f66b1130634f4b32e8e09f52f2c6a843b700cbb5aeadb8ab3456d002c143be68998573166e5979e6a48fcbb67ac8fd981f73';
}

function getSignatureBytes() {
  return Uint8Array.from(Buffer.from(getSignatureHex(), 'hex'));
}

function makehash(msg) {
  return crypto.createHash('sha256').update(msg).digest();
}


describe('Signature', () => {
  // ... (other test cases unchanged)

  describe('.fromBytes', () => {
    it('Should create verifiable signature from bytes', () => {
      const { AugSchemeMPL, G2Element, Util } = blsSignatures;

      const sig = G2Element.fromBytes(getSignatureBytes());

      assert.strictEqual(
        Buffer.from(sig.toBytes()).toString('hex'),
        getSignatureHex()
      );

      sig.delete();
    });
  });

  // ... (other test cases unchanged)

  describe('#toBytes', () => {
    it('Should serialize signature to Buffer', () => {
      const { AugSchemeMPL, G2Element, PrivateKey } = blsSignatures;

      const sk = AugSchemeMPL.key_gen(
        makehash(Uint8Array.from([1, 2, 3, 4, 5]))
      );
      const sig = AugSchemeMPL.sign(
        sk,
        Uint8Array.from([100, 2, 254, 88, 90, 45, 23])
      );
      assert(sig instanceof G2Element);
      assert.deepStrictEqual(
        Buffer.from(sig.toBytes()).toString('hex'),
        getSignatureHex()
      );

      sk.delete();
      sig.delete();
    });
  });

  // ... (other test cases unchanged)
});
