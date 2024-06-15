import { expect } from 'chai';
import {
  hash256,
  toHex,
  fromHex,
  getRandomSeed,
} from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('Utils', () => {
  describe('hash256', () => {
    it('Should hash a message using SHA-256', () => {
      const msg = new TextEncoder().encode('Hello, world!');
      const hash = hash256(msg.buffer);
      expect(hash).to.be.instanceOf(ArrayBuffer);
      // Check if hash length is 32 bytes (256 bits)
      expect(hash.byteLength).to.equal(32);
      // Optional: Verify the hash with a known value
      const expectedHashHex =
        '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3';
      expect(toHex(hash)).to.equal(expectedHashHex);
    });
  });

  describe('toHex', () => {
    it('Should convert an ArrayBuffer to a hex string', () => {
      const bytes = new Uint8Array([0x00, 0x01, 0x02, 0x0f, 0x10, 0xff]);
      const hex = toHex(bytes.buffer);
      expect(hex).to.equal('0001020f10ff');
    });
  });

  describe('fromHex', () => {
    it('Should convert a hex string to an ArrayBuffer', () => {
      const hex = '0001020f10ff';
      const buffer = fromHex(hex);
      expect(buffer).to.be.instanceOf(ArrayBuffer);
      expect(new Uint8Array(buffer)).to.deep.equal(
        new Uint8Array([0x00, 0x01, 0x02, 0x0f, 0x10, 0xff])
      );
    });
  });

  describe('getRandomSeed', () => {
    it('Should generate a 32-byte random seed', () => {
      const seed = getRandomSeed();
      expect(seed).to.be.instanceOf(ArrayBuffer);
      expect(seed.byteLength).to.equal(32);

      // Ensure it generates different seeds on subsequent calls
      const seed2 = getRandomSeed();
      expect(seed2).to.be.instanceOf(ArrayBuffer);
      expect(seed2.byteLength).to.equal(32);
      expect(new Uint8Array(seed)).to.not.deep.equal(new Uint8Array(seed2));
    });
  });
});
