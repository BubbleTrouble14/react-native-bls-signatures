import { expect } from 'chai';
import { PrivateKey, getRandomSeed } from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('PrivateKey', function () {
  describe('Copy {constructor|assignment operator}', () => {
    it('should not be zero and perform correct copy operations', () => {
      const pk1 = PrivateKey.fromBytes(getRandomSeed(), true);
      let pk2 = PrivateKey.fromBytes(getRandomSeed(), true);
      const pk3 = pk2.deepCopy();
      expect(pk1.isZero()).to.be.false;
      expect(pk2.isZero()).to.be.false;
      expect(pk3.isZero()).to.be.false;
      expect(pk1.equals(pk2)).to.be.false;
      expect(pk3.equals(pk2)).to.be.true;
      expect(pk2.getG1().isValid()).to.be.true;
      expect(pk2.getG2().isValid()).to.be.true;
      pk2 = pk1.deepCopy();
      expect(pk1.equals(pk2)).to.be.true;
      expect(pk1.getG1().equals(pk2.getG1())).to.be.true;
      expect(pk1.getG2().equals(pk2.getG2())).to.be.true;
      expect(pk3.equals(pk2)).to.be.false;
    });
  });

  describe('Equality operators', function () {
    it('should handle Equality operators', function () {
      let pk1 = PrivateKey.fromBytes(getRandomSeed(), true);
      let pk2 = PrivateKey.fromBytes(getRandomSeed(), true);
      let pk3 = pk2;
      expect(pk1.equals(pk2)).to.be.false;
      expect(pk1.equals(pk3)).to.be.false;
      expect(pk3.equals(pk2)).to.be.true;
    });
  });

  describe('(De)Serialization', () => {
    it('should handle private key serialization and deserialization', () => {
      const pk1 = PrivateKey.fromBytes(getRandomSeed(), true);
      expect(() => pk1.toBytes()).to.not.throw();

      const serializedPk1 = pk1.toBytes();
      expect(serializedPk1).to.have.lengthOf(PrivateKey.SIZE);

      const pk2 = PrivateKey.fromBytes(serializedPk1, true);
      expect(pk1.equals(pk2)).to.be.true;

      expect(() =>
        PrivateKey.fromBytes(serializedPk1.slice(0, -1), true)
      ).to.throw();
      expect(() =>
        PrivateKey.fromBytes(new Uint8Array([...serializedPk1, 0]), true)
      ).to.throw();
      expect(() => PrivateKey.fromBytes(serializedPk1, true)).to.not.throw();

      // The commented part of the C++ code seems to be testing specific internal behaviours
      // that might not have direct equivalents in TypeScript or might require internal library details.
    });
  });
});
