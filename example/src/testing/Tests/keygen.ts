import { expect } from 'chai';
import { BasicSchemeMPL } from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('Key generation', () => {
  it('Should generate a keypair from a seed', () => {
    const seed1 = new Uint8Array(31).fill(0x08);
    const seed2 = new Uint8Array(32).fill(0x08);

    expect(() => BasicSchemeMPL.keyGen(seed1)).to.throw();
    const sk = BasicSchemeMPL.keyGen(seed2);
    const pk = sk.getG1();

    expect(pk.getFingerprint()).to.equal(0x8ee7ba56);
  });
});
