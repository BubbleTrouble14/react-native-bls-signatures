import { expect } from 'chai';
import {
  BasicSchemeMPL,
  G2Element,
  PrivateKey,
  fromHex,
} from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

describe('IETF', () => {
  it('Pyecc vector should match the expected signature', () => {
    const sig1BasicHex =
      '96ba34fac33c7f129d602a0bc8a3d43f9abc014eceaab7359146b4b150e57b808645738f35671e9e10e0d862a30cab70074eb5831d13e6a5b162d01eebe687d0164adbd0a864370a7c222a2768d7704da254f1bf1823665bc2361f9dd8c00e99';
    const skHex =
      '0101010101010101010101010101010101010101010101010101010101010101';
    const msg = new Uint8Array([3, 1, 4, 1, 5, 9]);

    const skobj = PrivateKey.fromHex(skHex);
    const sig = BasicSchemeMPL.sign(skobj, msg.buffer);

    const sig1 = fromHex(sig1BasicHex);
    const sig1Element = G2Element.fromBytes(sig1);

    expect(sig.equals(sig1Element)).to.be.true;
  });
});
