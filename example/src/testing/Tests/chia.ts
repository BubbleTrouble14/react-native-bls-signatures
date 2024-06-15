import { assert, expect } from 'chai';
import {
  AugSchemeMPL,
  BasicSchemeMPL,
  G1Element,
  G2Element,
  PopSchemeMPL,
  PrivateKey,
  fromHex,
} from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('Chia', function () {
  describe('Chia vectors 1', () => {
    const seed1 = new Uint8Array(Array(32).fill(0)).buffer;
    const seed2 = new Uint8Array(Array(32).fill(1)).buffer;
    const msg1 = new Uint8Array([7, 8, 9]).buffer;
    const msg2 = new Uint8Array([10, 11, 12]).buffer;
    const sk1 = BasicSchemeMPL.keyGen(seed1);
    const sk2 = BasicSchemeMPL.keyGen(seed2);
    describe('Keys', () => {
      it('Private key correct', () =>
        assert.equal(
          sk1.toHex(),
          '4a353be3dac091a0a7e640620372f5e1e2e4401717c1e79cac6ffba8f6905604'
        ));
      it('Public key correct', () =>
        assert.equal(
          sk1.getG1().toHex(),
          '85695fcbc06cc4c4c9451f4dce21cbf8de3e5a13bf48f44cdbb18e2038ba7b8bb1632d7911ef1e2e08749bddbf165352'
        ));
    });
    const sig1 = BasicSchemeMPL.sign(sk1, msg1);
    const sig2 = BasicSchemeMPL.sign(sk2, msg2);
    describe('Signatures', () => {
      it('First correct', () =>
        assert.equal(
          sig1.toHex(),
          'b8faa6d6a3881c9fdbad803b170d70ca5cbf1e6ba5a586262df368c75acd1d1ffa3ab6ee21c71f844494659878f5eb230c958dd576b08b8564aad2ee0992e85a1e565f299cd53a285de729937f70dc176a1f01432129bb2b94d3d5031f8065a1'
        ));
      it('Second correct', () =>
        assert.equal(
          sig2.toHex(),
          'a9c4d3e689b82c7ec7e838dac2380cb014f9a08f6cd6ba044c263746e39a8f7a60ffee4afb78f146c2e421360784d58f0029491e3bd8ab84f0011d258471ba4e87059de295d9aba845c044ee83f6cf2411efd379ef38bf4cf41d5f3c0ae1205d'
        ));
    });
    const aggSig1 = BasicSchemeMPL.aggregate([sig1, sig2]);
    describe('First aggregate signature', () => {
      it('Is correct', () =>
        assert.equal(
          aggSig1.toHex(),
          'aee003c8cdaf3531b6b0ca354031b0819f7586b5846796615aee8108fec75ef838d181f9d244a94d195d7b0231d4afcf06f27f0cc4d3c72162545c240de7d5034a7ef3a2a03c0159de982fbc2e7790aeb455e27beae91d64e077c70b5506dea3'
        ));
      it('Verification', () =>
        assert(
          BasicSchemeMPL.aggregateVerify(
            [sk1.getG1(), sk2.getG1()],
            [msg1, msg2],
            aggSig1
          )
        ));
    });
    const msg3 = new Uint8Array([1, 2, 3]).buffer;
    const msg4 = new Uint8Array([1, 2, 3, 4]).buffer;
    const msg5 = new Uint8Array([1, 2]).buffer;
    const sig3 = BasicSchemeMPL.sign(sk1, msg3);
    const sig4 = BasicSchemeMPL.sign(sk1, msg4);
    const sig5 = BasicSchemeMPL.sign(sk2, msg5);
    const aggSig2 = BasicSchemeMPL.aggregate([sig3, sig4, sig5]);
    describe('Second aggregate signature', () => {
      it('Is correct', () =>
        assert.equal(
          aggSig2.toHex(),
          'a0b1378d518bea4d1100adbc7bdbc4ff64f2c219ed6395cd36fe5d2aa44a4b8e710b607afd965e505a5ac3283291b75413d09478ab4b5cfbafbeea366de2d0c0bcf61deddaa521f6020460fd547ab37659ae207968b545727beba0a3c5572b9c'
        ));
      it('Verification', () =>
        assert(
          BasicSchemeMPL.aggregateVerify(
            [sk1.getG1(), sk1.getG1(), sk2.getG1()],
            [msg3, msg4, msg5],
            aggSig2
          )
        ));
    });
  });

  describe('Chia vectors 3', () => {
    const seed1 = new Uint8Array(Array(32).fill(4)).buffer;
    const sk1 = PopSchemeMPL.keyGen(seed1);
    const proof = PopSchemeMPL.popProve(sk1);
    it('Proof correct', () =>
      assert.equal(
        proof.toHex(),
        '84f709159435f0dc73b3e8bf6c78d85282d19231555a8ee3b6e2573aaf66872d9203fefa1ef700e34e7c3f3fb28210100558c6871c53f1ef6055b9f06b0d1abe22ad584ad3b957f3018a8f58227c6c716b1e15791459850f2289168fa0cf9115'
      ));
  });

  describe('Pyecc vectors', () => {
    const ref_sig1Basic = new Uint8Array(
      [
        ...'\x96\xba4\xfa\xc3<\x7f\x12\x9d`*\x0b\xc8\xa3\xd4?\x9a\xbc\x01N\xce\xaa\xb75\x91F\xb4\xb1P\xe5{\x80\x86Es\x8f5g\x1e\x9e\x10\xe0\xd8b\xa3\x0c\xabp\x07N\xb5\x83\x1d\x13\xe6\xa5\xb1b\xd0\x1e\xeb\xe6\x87\xd0\x16J\xdb\xd0\xa8d7\n|"*\'h\xd7pM\xa2T\xf1\xbf\x18#f[\xc26\x1f\x9d\xd8\xc0\x0e\x99',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sig2Basic = new Uint8Array(
      [
        ...'\xa4\x02y\t2\x13\x0fvj\xf1\x1b\xa7\x16Sf\x83\xd8\xc4\xcf\xa5\x19G\xe4\xf9\x08\x1f\xed\xd6\x92\xd6\xdc\x0c\xac[\x90K\xee^\xa6\xe2Ui\xe3m{\xe4\xcaY\x06\x9a\x96\xe3K\x7fp\x07X\xb7\x16\xf9IJ\xaaY\xa9nt\xd1J;U*\x9ak\xc1)\xe7\x17\x19[\x9d`\x06\xfdm\\\xefGh\xc0"\xe0\xf71j\xbf',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sigABasic = new Uint8Array(
      [
        ...'\x98|\xfd;\xcdb(\x02\x87\x02t\x83\xf2\x9cU$^\xd81\xf5\x1d\xd6\xbd\x99\x9ao\xf1\xa1\xf1\xf1\xf0\xb6Gw\x8b\x01g5\x9cqPUX\xa7n\x15\x8ef\x18\x1e\xe5\x12Y\x05\xa6B$k\x01\xe7\xfa^\xe5=h\xa4\xfe\x9b\xfb)\xa8\xe2f\x01\xf0\xb9\xadW}\xdd\x18\x87js1|!n\xa6\x1fC\x04\x14\xecQ\xc5',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sig1Aug = new Uint8Array(
      [
        ...'\x81\x80\xf0,\xcbr\xe9"\xb1R\xfc\xed\xbe\x0e\x1d\x19R\x105Opp6X\xe8\xe0\x8c\xbe\xbf\x11\xd4\x97\x0e\xabj\xc3\xcc\xf7\x15\xf3\xfb\x87m\xf9\xa9yz\xbd\x0c\x1a\xf6\x1a\xae\xad\xc9,,\xfe\\\nV\xc1F\xcc\x8c?qQ\xa0s\xcf_\x16\xdf8$g$\xc4\xae\xd7?\xf3\x0e\xf5\xda\xa6\xaa\xca\xed\x1a&\xec\xaa3k',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sig2Aug = new Uint8Array(
      [
        ...'\x99\x11\x1e\xea\xfbA-\xa6\x1eL7\xd3\xe8\x06\xc6\xfdj\xc9\xf3\x87\x0eT\xda\x92"\xbaNIH"\xc5\xb7eg1\xfazdY4\xd0KU\x9e\x92a\xb8b\x01\xbb\xeeW\x05RP\xa4Y\xa2\xda\x10\xe5\x1f\x9c\x1aiA)\x7f\xfc]\x97\nUr6\xd0\xbd\xeb|\xf8\xff\x18\x80\x0b\x08c8q\xa0\xf0\xa7\xeaB\xf4t\x80',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sigAAug = new Uint8Array(
      [
        ...'\x8c]\x03\xf9\xda\xe7~\x19\xa5\x94Z\x06\xa2\x14\x83n\xdb\x8e\x03\xb8QR]\x84\xb9\xded@\xe6\x8f\xc0\xcas\x03\xee\xed9\r\x86<\x9bU\xa8\xcfmY\x14\n\x01\xb5\x88G\x88\x1e\xb5\xafgsMD\xb2UVF\xc6al9\xab\x88\xd2S)\x9a\xcc\x1e\xb1\xb1\x9d\xdb\x9b\xfc\xbev\xe2\x8a\xdd\xf6q\xd1\x16\xc0R\xbb\x18G',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sig1Pop = new Uint8Array(
      [
        ...'\x95P\xfbN\x7f~\x8c\xc4\xa9\x0b\xe8V\n\xb5\xa7\x98\xb0\xb20\x00\xb6\xa5J!\x17R\x02\x10\xf9\x86\xf3\xf2\x81\xb3v\xf2Y\xc0\xb7\x80b\xd1\xeb1\x92\xb3\xd9\xbb\x04\x9fY\xec\xc1\xb0:pI\xebf^\r\xf3d\x94\xaeL\xb5\xf1\x13l\xca\xee\xfc\x99X\xcb0\xc33==C\xf0qH\xc3\x86)\x9a{\x1b\xfc\r\xc5\xcf|',
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sig2Pop = new Uint8Array(
      [
        ..."\xa6\x906\xbc\x11\xae^\xfc\xbfa\x80\xaf\xe3\x9a\xdd\xde~'s\x1e\xc4\x02W\xbf\xdc<7\xf1{\x8d\xf6\x83\x06\xa3N\xbd\x10\xe9\xe3*5%7P\xdf\\\x87\xc2\x14/\x82\x07\xe8\xd5eG\x12\xb4\xe5T\xf5\x85\xfbhF\xff8\x04\xe4)\xa9\xf8\xa1\xb4\xc5ku\xd0\x86\x9e\xd6u\x80\xd7\x89\x87\x0b\xab\xe2\xc7\xc8\xa9\xd5\x1e{*",
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const ref_sigAPop = new Uint8Array(
      [
        ..."\xa4\xeat+\xcd\xc1U>\x9c\xa4\xe5`\xbe~^ln\xfajd\xdd\xdf\x9c\xa3\xbb(T#=\x85\xa6\xaa\xc1\xb7n\xc7\xd1\x03\xdbN3\x14\x8b\x82\xaf\x99#\xdb\x05\x93Jn\xce\x9aq\x01\xcd\x8a\x9dG\xce'\x97\x80V\xb0\xf5\x90\x00!\x81\x8cEi\x8a\xfd\xd6\xcf\x8ako\x7f\xee\x1f\x0bCqoU\xe4\x13\xd4\xb8z`9",
      ].map((char) => char.charCodeAt(0))
    ).buffer;
    const secret1 = new Uint8Array(Array(32).fill(1)).buffer;
    const secret2 = new Uint8Array(
      Array(32)
        .fill(0)
        .map((_, i) => (i * 314159) % 256)
    ).buffer;
    const sk1 = PrivateKey.fromBytes(secret1);
    const sk2 = PrivateKey.fromBytes(secret2);
    const msg = new Uint8Array([3, 1, 4, 1, 5, 9]).buffer;
    const sig1Basic = BasicSchemeMPL.sign(sk1, msg);
    const sig2Basic = BasicSchemeMPL.sign(sk2, msg);
    const sigABasic = BasicSchemeMPL.aggregate([sig1Basic, sig2Basic]);
    const sig1Aug = AugSchemeMPL.sign(sk1, msg);
    const sig2Aug = AugSchemeMPL.sign(sk2, msg);
    const sigAAug = AugSchemeMPL.aggregate([sig1Aug, sig2Aug]);
    const sig1Pop = PopSchemeMPL.sign(sk1, msg);
    const sig2Pop = PopSchemeMPL.sign(sk2, msg);
    const sigAPop = PopSchemeMPL.aggregate([sig1Pop, sig2Pop]);
    it('First basic signature', () =>
      assert.deepEqual(sig1Basic.toBytes(), ref_sig1Basic));
    it('Second basic signature', () =>
      assert.deepEqual(sig2Basic.toBytes(), ref_sig2Basic));
    it('Aggregate basic signature', () =>
      assert.deepEqual(sigABasic.toBytes(), ref_sigABasic));
    it('First aug signature', () =>
      assert.deepEqual(sig1Aug.toBytes(), ref_sig1Aug));
    it('Second aug signature', () =>
      assert.deepEqual(sig2Aug.toBytes(), ref_sig2Aug));
    it('Aggregate aug signature', () =>
      assert.deepEqual(sigAAug.toBytes(), ref_sigAAug));
    it('First pop signature', () =>
      assert.deepEqual(sig1Pop.toBytes(), ref_sig1Pop));
    it('Second pop signature', () =>
      assert.deepEqual(sig2Pop.toBytes(), ref_sig2Pop));
    it('Aggregate pop signature', () =>
      assert.deepEqual(sigAPop.toBytes(), ref_sigAPop));
  });

  describe('Invalid vectors', () => {
    const invalidInputs1 = [
      'c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'c00000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000',
      '3a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
      '7a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
      'fa0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaaaa',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
    ];
    const invalidInputs2 = [
      'c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'c00000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000',
      '3a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '7a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      'fa0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa7',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
    ];
    for (const [i, input] of invalidInputs1.entries()) {
      const bytes = fromHex(input);
      it(`G1 element ${i}`, () =>
        expect(() => assert(G1Element.fromBytes(bytes).isValid())).to.throw());
    }
    for (const [i, input] of invalidInputs2.entries()) {
      const bytes = fromHex(input);
      it(`G2 element ${i}`, () =>
        expect(() => assert(G2Element.fromBytes(bytes).isValid())).to.throw());
    }
  });

  describe('Readme', () => {
    const seed = new Uint8Array([
      0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18,
      102, 58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
    ]).buffer;
    const sk = AugSchemeMPL.keyGen(seed);
    const pk = sk.getG1();
    const message = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const signature = AugSchemeMPL.sign(sk, message);
    it('AugSchemeMPL verify', () =>
      assert(AugSchemeMPL.verify(pk, message, signature)));
    const skBytes = sk.toBytes();
    const pkBytes = pk.toBytes();
    const signatureBytes = signature.toBytes();
    const skFromBytes = PrivateKey.fromBytes(skBytes);
    const pkFromBytes = G1Element.fromBytes(pkBytes);
    const signatureFromBytes = G2Element.fromBytes(signatureBytes);
    describe('From bytes', () => {
      it('Private key correct', () => assert(sk.equals(skFromBytes)));
      it('Public key correct', () => assert(pk.equals(pkFromBytes)));
      it('Signature correct', () =>
        assert(signature.equals(signatureFromBytes)));
    });
    const seed1 = new Uint8Array([1, ...new Uint8Array(seed).slice(1)]).buffer;
    const sk1 = AugSchemeMPL.keyGen(seed1);
    const seed2 = new Uint8Array([2, ...new Uint8Array(seed).slice(1)]).buffer;
    const sk2 = AugSchemeMPL.keyGen(seed2);
    const message2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7]).buffer;
    const pk1 = sk1.getG1();
    const sig1 = AugSchemeMPL.sign(sk1, message);
    const pk2 = sk2.getG1();
    const sig2 = AugSchemeMPL.sign(sk2, message2);
    const aggSig = AugSchemeMPL.aggregate([sig1, sig2]);
    it('First aug aggregate verify', () =>
      assert(
        AugSchemeMPL.aggregateVerify([pk1, pk2], [message, message2], aggSig)
      ));
    const seed3 = new Uint8Array([3, ...new Uint8Array(seed).slice(1)]).buffer;
    const sk3 = AugSchemeMPL.keyGen(seed3);
    const pk3 = sk3.getG1();
    const message3 = new Uint8Array([100, 2, 254, 88, 90, 45, 23]).buffer;
    const sig3 = AugSchemeMPL.sign(sk3, message3);
    const aggSigFinal = AugSchemeMPL.aggregate([aggSig, sig3]);
    it('Second aug aggregate verify', () =>
      assert(
        AugSchemeMPL.aggregateVerify(
          [pk1, pk2, pk3],
          [message, message2, message3],
          aggSigFinal
        )
      ));
    const popSig1 = PopSchemeMPL.sign(sk1, message);
    const popSig2 = PopSchemeMPL.sign(sk2, message);
    const popSig3 = PopSchemeMPL.sign(sk3, message);
    const pop1 = PopSchemeMPL.popProve(sk1);
    const pop2 = PopSchemeMPL.popProve(sk2);
    const pop3 = PopSchemeMPL.popProve(sk3);
    describe('PopSchemeMPL prove', () => {
      it('First pop verify', () => assert(PopSchemeMPL.popVerify(pk1, pop1)));
      it('Second pop verify', () => assert(PopSchemeMPL.popVerify(pk2, pop2)));
      it('Third pop verify', () => assert(PopSchemeMPL.popVerify(pk3, pop3)));
    });
    const popSigAgg = PopSchemeMPL.aggregate([popSig1, popSig2, popSig3]);
    it('PopSchemeMPL fast aggregate verify', () =>
      assert(
        PopSchemeMPL.fastAggregateVerify([pk1, pk2, pk3], message, popSigAgg)
      ));
    const popAggPk = pk1.add(pk2).add(pk3);
    it('PopSchemeMPL verify', () =>
      assert(PopSchemeMPL.verify(popAggPk, message, popSigAgg)));
    const popAggSk = PrivateKey.aggregate([sk1, sk2, sk3]);
    it('PopSchemeMPL aggregate sign', () =>
      assert(PopSchemeMPL.sign(popAggSk, message).equals(popSigAgg)));
    const masterSk = AugSchemeMPL.keyGen(seed);
    const child = AugSchemeMPL.deriveChildSk(masterSk, 152);
    AugSchemeMPL.deriveChildSk(child, 952);
    const masterPk = masterSk.getG1();
    const childU = AugSchemeMPL.deriveChildSkUnhardened(masterSk, 22);
    const grandchildU = AugSchemeMPL.deriveChildSkUnhardened(childU, 0);
    const childUPk = AugSchemeMPL.deriveChildPkUnhardened(masterPk, 22);
    const grandchildUPk = AugSchemeMPL.deriveChildPkUnhardened(childUPk, 0);
    it('AugSchemeMPL child keys', () =>
      assert(grandchildUPk.equals(grandchildU.getG1())));
  });

  describe('Current', () => {
    const seed = new Uint8Array([
      0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18,
      102, 58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
    ]).buffer;
    const sk = AugSchemeMPL.keyGen(seed);
    const pk = sk.getG1();
    const message = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const signature = AugSchemeMPL.sign(sk, message);
    it('Is verified', () => AugSchemeMPL.verify(pk, message, signature));
  });
});
