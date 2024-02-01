import { describe, it } from '../MochaRNAdapter';
import { assert, expect } from 'chai';
import {
  BasicSchemeMPL,
  AugSchemeMPL,
  PopSchemeMPL,
  PrivateKey,
  getRandomSeed,
  G1Element,
  G2Element,
  GTElement,
} from 'react-native-bls-signatures';

describe('Classes', () => {
  describe('PrivateKey', () => {
    const seed = getRandomSeed();
    const privateKey = PrivateKey.fromBytes(seed, true);

    it('static fromBytes', () => {
      expect(PrivateKey.fromBytes(seed, true)).to.not.be.null;
    });

    it('static fromHex', () => {
      expect(PrivateKey.fromHex(privateKey.toHex())).to.not.be.null;
    });

    it('static aggregate', () => {
      expect(PrivateKey.aggregate([privateKey])).to.not.be.null;
    });

    it('toBytes', () => {
      expect(privateKey.toBytes()).to.be.an.instanceof(Uint8Array);
    });

    it('toHex', () => {
      expect(privateKey.toHex()).to.be.a('string');
    });

    it('toString', () => {
      expect(privateKey.toString()).to.be.a('string');
    });

    it('deepCopy', () => {
      const copy = privateKey.deepCopy();
      expect(copy.toHex()).to.equal(privateKey.toHex());
    });

    it('equals', () => {
      const copy = privateKey.deepCopy();
      expect(copy.equals(privateKey)).to.be.true;
    });

    it('isZero', () => {
      expect(privateKey.isZero()).to.be.false;
    });

    it('getG1', () => {
      expect(privateKey.getG1()).to.not.be.null;
    });

    it('getG2', () => {
      expect(privateKey.getG2()).to.not.be.null;
    });

    it('getG2Power', () => {
      expect(privateKey.getG2Power(privateKey.getG2())).to.not.be.null;
    });

    it('mulG1', () => {
      expect(privateKey.mulG1(privateKey.getG1())).to.not.be.null;
    });

    it('mulG2', () => {
      expect(privateKey.mulG2(privateKey.getG2())).to.not.be.null;
    });
  });

  describe('G1Element', () => {
    const seed = getRandomSeed();
    const privateKey = PrivateKey.fromBytes(seed, true);
    const g1Element = privateKey.getG1();

    it('static fromBytes', () => {
      expect(G1Element.fromBytes(g1Element.toBytes())).to.not.be.null;
    });

    it('static fromHex', () => {
      expect(G1Element.fromHex(g1Element.toHex())).to.not.be.null;
    });

    it('static aggregate', () => {
      expect(G1Element.generator()).to.not.be.null;
    });

    it('toBytes', () => {
      expect(g1Element.toBytes()).to.be.an.instanceof(Uint8Array);
    });

    it('toHex', () => {
      expect(g1Element.toHex()).to.be.a('string');
    });

    it('toString', () => {
      expect(g1Element.toString()).to.be.a('string');
    });

    it('isValid', () => {
      expect(g1Element.isValid()).to.be.true;
    });

    it('deepCopy', () => {
      const copy = g1Element.deepCopy();
      expect(copy.toHex()).to.equal(g1Element.toHex());
    });

    it('getFingerprint', () => {
      expect(g1Element.getFingerprint()).to.be.a('number');
    });

    it('add', () => {
      expect(g1Element.add(g1Element)).to.not.be.null;
    });

    it('negate', () => {
      expect(g1Element.negate()).to.not.be.null;
    });

    it('equals', () => {
      const copy = g1Element.deepCopy();
      expect(copy.equals(g1Element)).to.be.true;
    });
  });

  describe('G2Element', () => {
    const seed = getRandomSeed();
    const privateKey = PrivateKey.fromBytes(seed, true);
    const g2Element = privateKey.getG2();

    it('static fromBytes', () => {
      expect(G2Element.fromBytes(g2Element.toBytes())).to.not.be.null;
    });

    it('static fromHex', () => {
      expect(G2Element.fromHex(g2Element.toHex())).to.not.be.null;
    });

    it('static aggregate', () => {
      expect(G2Element.generator()).to.not.be.null;
    });

    it('toBytes', () => {
      expect(g2Element.toBytes()).to.be.an.instanceof(Uint8Array);
    });

    it('toHex', () => {
      expect(g2Element.toHex()).to.be.a('string');
    });

    it('toString', () => {
      expect(g2Element.toString()).to.be.a('string');
    });

    it('isValid', () => {
      expect(g2Element.isValid()).to.be.true;
    });

    it('deepCopy', () => {
      const copy = g2Element.deepCopy();
      expect(copy.toHex()).to.equal(g2Element.toHex());
    });

    it('add', () => {
      expect(g2Element.add(g2Element)).to.not.be.null;
    });

    it('negate', () => {
      expect(g2Element.negate()).to.not.be.null;
    });

    it('equals', () => {
      const copy = g2Element.deepCopy();
      expect(copy.equals(g2Element)).to.be.true;
    });
  });

  describe('GTElement', () => {
    // const seed = getRandomSeed();
    // const privateKey = PrivateKey.fromBytes(seed, true);
    // const gTElement = privateKey.getG2();
    //TODO
    // it('static fromBytes', () => {
    //   expect(GTElement.fromBytes(gTElement.toBytes())).to.not.be.null;
    // });
    // it('static fromHex', () => {
    //   expect(GTElement.fromHex(gTElement.toHex())).to.not.be.null;
    // });
    // it('static unity', () => {
    //   expect(GTElement.unity()).to.not.be.null;
    // });
    // it('toBytes', () => {
    //   expect(gTElement.toBytes()).to.be.an.instanceof(Uint8Array);
    // });
    // it('toHex', () => {
    //   expect(gTElement.toHex()).to.be.a('string');
    // });
    // it('toString', () => {
    //   expect(gTElement.toString()).to.be.a('string');
    // });
    // it('deepCopy', () => {
    //   const copy = gTElement.deepCopy();
    //   expect(copy.toHex()).to.equal(gTElement.toHex());
    // });
    // it('equals', () => {
    //   const copy = gTElement.deepCopy();
    //   expect(copy.equals(gTElement)).to.be.true;
    // });
  });

  describe('BasicSchemeMPL', () => {
    const seed = getRandomSeed();

    const sk = BasicSchemeMPL.keyGen(seed);
    const pk = sk.getG1();
    const msg = Uint8Array.from([1, 2, 3, 4, 5]);
    const signature = BasicSchemeMPL.sign(sk, msg);

    it('skToG1', () => {
      expect(BasicSchemeMPL.skToG1(sk)).to.not.be.null;
    });

    it('keyGen', () => {
      expect(BasicSchemeMPL.keyGen(seed)).to.not.be.null;
    });

    it('sign', () => {
      expect(BasicSchemeMPL.sign(sk, msg)).to.not.be.null;
    });

    it('verify', () => {
      expect(BasicSchemeMPL.verify(pk, msg, signature)).to.be.true;
    });

    it('aggregate', () => {
      expect(BasicSchemeMPL.aggregate([signature, signature])).to.not.be.null;
    });

    it('aggregateVerify', () => {
      expect(BasicSchemeMPL.aggregateVerify([pk], [msg], signature)).to.be.true;
    });

    it('deriveChildSk', () => {
      expect(BasicSchemeMPL.deriveChildSk(sk, 1)).to.not.be.null;
    });

    it('deriveChildSkUnhardened', () => {
      expect(BasicSchemeMPL.deriveChildSkUnhardened(sk, 1)).to.not.be.null;
    });

    it('deriveChildPkUnhardened', () => {
      expect(BasicSchemeMPL.deriveChildPkUnhardened(pk, 1)).to.not.be.null;
    });
  });

  describe('AugSchemeMPL', () => {
    const seed = getRandomSeed();

    const sk = AugSchemeMPL.keyGen(seed);
    const pk = sk.getG1();
    const msg = Uint8Array.from([1, 2, 3, 4, 5]);
    const signature = AugSchemeMPL.sign(sk, msg);

    it('skToG1', () => {
      expect(AugSchemeMPL.skToG1(sk)).to.not.be.null;
    });

    it('keyGen', () => {
      expect(AugSchemeMPL.keyGen(seed)).to.not.be.null;
    });

    it('sign', () => {
      expect(AugSchemeMPL.sign(sk, msg)).to.not.be.null;
    });

    it('signPrepend', () => {
      expect(AugSchemeMPL.signPrepend(sk, msg, pk)).to.not.be.null;
    });

    it('verify', () => {
      expect(AugSchemeMPL.verify(pk, msg, signature)).to.be.true;
    });

    it('aggregate', () => {
      expect(AugSchemeMPL.aggregate([signature])).to.not.be.null;
    });

    it('aggregateVerify', () => {
      expect(AugSchemeMPL.aggregateVerify([pk], [msg], signature)).to.be.true;
    });

    it('deriveChildSk', () => {
      expect(AugSchemeMPL.deriveChildSk(sk, 1)).to.not.be.null;
    });

    it('deriveChildSkUnhardened', () => {
      expect(AugSchemeMPL.deriveChildSkUnhardened(sk, 1)).to.not.be.null;
    });

    it('deriveChildPkUnhardened', () => {
      expect(AugSchemeMPL.deriveChildPkUnhardened(pk, 1)).to.not.be.null;
    });
  });

  describe('PopSchemeMPL', () => {
    const seed = getRandomSeed();

    const sk1 = AugSchemeMPL.keyGen(getRandomSeed());
    const sk2 = AugSchemeMPL.keyGen(getRandomSeed());
    const sk3 = AugSchemeMPL.keyGen(getRandomSeed());
    const pk1 = sk1.getG1();
    const pk2 = sk2.getG1();
    const pk3 = sk3.getG1();

    const message1 = Uint8Array.from([1, 2, 3, 4, 5]);
    const message2 = Uint8Array.from([1, 2, 3, 4, 5, 6, 7]);
    const message3 = Uint8Array.from([100, 2, 254, 88, 90, 45, 23]);

    const popSig1 = PopSchemeMPL.sign(sk1, message1);
    const popSig2 = PopSchemeMPL.sign(sk2, message1);
    const popSig3 = PopSchemeMPL.sign(sk3, message1);
    const pop1 = PopSchemeMPL.popProve(sk1);

    const popSigAgg = PopSchemeMPL.aggregate([popSig1, popSig2, popSig3]);
    const sig1 = PopSchemeMPL.sign(sk1, message1);
    const sig2 = PopSchemeMPL.sign(sk2, message2);

    const aggSig = PopSchemeMPL.aggregate([sig1, sig2]);
    const sig3 = PopSchemeMPL.sign(sk3, message3);

    const aggSigFinal = PopSchemeMPL.aggregate([aggSig, sig3]);

    const popAggPk = pk1.add(pk2).add(pk3);

    it('skToG1', () => {
      expect(PopSchemeMPL.skToG1(sk1)).to.not.be.null;
    });

    it('keyGen', () => {
      expect(PopSchemeMPL.keyGen(seed)).to.not.be.null;
    });

    it('sign', () => {
      expect(PopSchemeMPL.sign(sk1, message1)).to.not.be.null;
    });

    it('verify', () => {
      expect(PopSchemeMPL.verify(popAggPk, message1, popSigAgg)).to.be.true;
    });

    it('aggregate', () => {
      expect(PopSchemeMPL.aggregate([popSig1, popSig2, popSig3])).to.not.be
        .null;
    });

    it('aggregateVerify', () => {
      expect(
        PopSchemeMPL.aggregateVerify(
          [pk1, pk2, pk3],
          [message1, message2, message3],
          aggSigFinal
        )
      ).to.be.true;
    });

    it('deriveChildSk', () => {
      expect(PopSchemeMPL.deriveChildSk(sk1, 1)).to.not.be.null;
    });

    it('deriveChildSkUnhardened', () => {
      expect(PopSchemeMPL.deriveChildSkUnhardened(sk1, 1)).to.not.be.null;
    });

    it('deriveChildPkUnhardened', () => {
      expect(PopSchemeMPL.deriveChildPkUnhardened(pk1, 1)).to.not.be.null;
    });

    it('popVerify', () => {
      expect(PopSchemeMPL.popVerify(pk1, pop1)).to.be.true;
    });

    it('popProve', () => {
      expect(PopSchemeMPL.popProve(sk1)).to.not.be.null;
    });

    it('fastAggregateVerify', () => {
      expect(
        PopSchemeMPL.fastAggregateVerify([pk1, pk2, pk3], message1, popSigAgg)
      ).to.be.true;
    });
  });
});
