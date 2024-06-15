import { assert } from 'chai';
import { HKDF256, fromHex } from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

interface HkdfIn {
  ikm: string;
  salt: string;
  info: string;
  prkExpected: string;
  okmExpected: string;
  length: number;
}

describe('HKDF', function () {
  const tests: Array<HkdfIn> = [
    {
      ikm: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
      salt: '000102030405060708090a0b0c',
      info: 'f0f1f2f3f4f5f6f7f8f9',
      prkExpected:
        '077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5',
      okmExpected:
        '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865',
      length: 42,
    },
    {
      ikm: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f',
      salt: '606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
      info: 'b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
      prkExpected:
        '06a6b88c5853361a06104c9ceb35b45cef760014904671014a193f40c15fc244',
      okmExpected:
        'b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71cc30c58179ec3e87c14c01d5c1f3434f1d87',
      length: 82,
    },
    {
      ikm: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
      salt: '',
      info: '',
      prkExpected:
        '19ef24a32c717b167f33a91d6f648bdf96596776afdb6377ac434c1c293ccb04',
      okmExpected:
        '8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8',
      length: 42,
    },
    {
      ikm: '8704f9ac024139fe62511375cf9bc534c0507dcf00c41603ac935cd5943ce0b4b88599390de14e743ca2f56a73a04eae13aa3f3b969b39d8701e0d69a6f8d42f',
      salt: '53d8e19b',
      info: '',
      prkExpected:
        'eb01c9cd916653df76ffa61b6ab8a74e254ebfd9bfc43e624cc12a72b0373dee',
      okmExpected:
        '8faabea85fc0c64e7ca86217cdc6dcdc88551c3244d56719e630a3521063082c46455c2fd5483811f9520a748f0099c1dfcfa52c54e1c22b5cdf70efb0f3c676',
      length: 64,
    },
  ];

  for (const test of tests) {
    describe(test.ikm, () => {
      const salt = fromHex(test.salt);
      const ikm = fromHex(test.ikm);
      const info = fromHex(test.info);
      const prkExpected = fromHex(test.prkExpected);
      const okmExpected = fromHex(test.okmExpected);
      const prk = HKDF256.extract(salt, ikm);
      const okm = HKDF256.expand(prk, info, test.length);
      it('Has the correct prkExpected length', () =>
        assert.equal(prkExpected.byteLength, 32));
      it('Has the correct okmExpected length', () =>
        assert.equal(test.length, okmExpected.byteLength));
      it('Has the correct prk bytes', () => assert.deepEqual(prk, prkExpected));
      it('Has the correct okm bytes', () => assert.deepEqual(okm, okmExpected));
    });
  }
});
