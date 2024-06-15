import { expect } from 'chai';
import {
  BasicSchemeMPL,
  G1Element,
  G2Element,
  PrivateKey,
} from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('Error handling', () => {
  it('Should throw on a bad private key', () => {
    const seed = new Uint8Array(32).fill(0x10);
    const sk1 = BasicSchemeMPL.keyGen(seed.buffer);
    const skData = new Uint8Array(PrivateKey.SIZE);
    skData.set(new Uint8Array(sk1.toBytes()));
    skData[0] = 255;
    expect(() => PrivateKey.fromBytes(skData.buffer)).to.throw();
  });

  it('Should throw on a bad public key', () => {
    const buf = new Uint8Array(G1Element.SIZE).fill(0);
    for (let i = 0; i < 0xff; i++) {
      buf[0] = i;
      if (i === 0xc0) {
        expect(() => G1Element.fromBytes(buf.buffer)).to.not.throw();
      } else {
        expect(() => G1Element.fromBytes(buf.buffer)).to.throw();
      }
    }
  });

  it('Should throw on a bad G2Element', () => {
    const buf = new Uint8Array(G2Element.SIZE).fill(0);
    for (let i = 0; i < 0xff; i++) {
      buf[0] = i;
      if (i === 0xc0) {
        expect(() => G2Element.fromBytes(buf.buffer)).to.not.throw();
      } else {
        expect(() => G2Element.fromBytes(buf.buffer)).to.throw();
      }
    }
    buf[48] = 0xff;
    expect(() => G2Element.fromBytes(buf.buffer)).to.throw();
  });
});
