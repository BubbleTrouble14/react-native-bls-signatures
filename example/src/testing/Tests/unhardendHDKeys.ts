import { expect } from 'chai';
import { BasicSchemeMPL } from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('Unhardened HD keys', function () {
  describe('Should match derivation through private and public keys', () => {
    it('matches child and grandchild keys with their respective public keys', () => {
      const seed = new Uint8Array([
        1, 50, 6, 244, 24, 199, 1, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      ]);

      const sk = BasicSchemeMPL.keyGen(seed.buffer);
      const pk = sk.getG1();

      const childSk = BasicSchemeMPL.deriveChildSkUnhardened(sk, 42);
      const childPk = BasicSchemeMPL.deriveChildPkUnhardened(pk, 42);

      expect(childSk.getG1().equals(childPk)).to.be.true;

      const grandchildSk = BasicSchemeMPL.deriveChildSkUnhardened(
        childSk,
        12142
      );
      const grandchildPk = BasicSchemeMPL.deriveChildPkUnhardened(
        childPk,
        12142
      );

      expect(grandchildSk.getG1().equals(grandchildPk)).to.be.true;
    });
  });

  describe('Should derive public child from parent', () => {
    it('derives correct public child keys and distinguishes hardened from unhardened keys', () => {
      const seed = new Uint8Array([
        2, 50, 6, 244, 24, 199, 1, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      ]);

      const sk = BasicSchemeMPL.keyGen(seed.buffer);
      const pk = sk.getG1();

      const childSk = BasicSchemeMPL.deriveChildSkUnhardened(sk, 42);
      const childPk = BasicSchemeMPL.deriveChildPkUnhardened(pk, 42);

      const childSkHardened = BasicSchemeMPL.deriveChildSk(sk, 42);
      expect(childSk.getG1().equals(childPk)).to.be.true;
      expect(childSkHardened.equals(childSk)).to.be.false;
      expect(childSkHardened.getG1().equals(childPk)).to.be.false;
    });
  });
});
