import { assert } from 'chai';
import { BasicSchemeMPL, fromHex } from 'react-native-bls-signatures';
import { describe, it } from '../MochaRNAdapter';

interface Eip2333In {
  seed: string;
  masterSk: string;
  childSk: string;
  childIndex: number;
}

describe('EIP 2333', function () {
  const tests: Array<Eip2333In> = [
    {
      seed: '3141592653589793238462643383279502884197169399375105820974944592',
      masterSk:
        '4ff5e145590ed7b71e577bb04032396d1619ff41cb4e350053ed2dce8d1efd1c',
      childSk:
        '5c62dcf9654481292aafa3348f1d1b0017bbfb44d6881d26d2b17836b38f204d',
      childIndex: 3141592653,
    },
    {
      seed: '0099FF991111002299DD7744EE3355BBDD8844115566CC55663355668888CC00',
      masterSk:
        '1ebd704b86732c3f05f30563dee6189838e73998ebc9c209ccff422adee10c4b',
      childSk:
        '1b98db8b24296038eae3f64c25d693a269ef1e4d7ae0f691c572a46cf3c0913c',
      childIndex: 4294967295,
    },
    {
      seed: 'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      masterSk:
        '614d21b10c0e4996ac0608e0e7452d5720d95d20fe03c59a3321000a42432e1a',
      childSk:
        '08de7136e4afc56ae3ec03b20517d9c1232705a747f588fd17832f36ae337526',
      childIndex: 42,
    },
    {
      seed: 'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04',
      masterSk:
        '0befcabff4a664461cc8f190cdd51c05621eb2837c71a1362df5b465a674ecfb',
      childSk:
        '1a1de3346883401f1e3b2281be5774080edb8e5ebe6f776b0f7af9fea942553a',
      childIndex: 0,
    },
  ];

  for (const test of tests) {
    describe(test.seed, () => {
      const seed = fromHex(test.seed);
      const master = BasicSchemeMPL.keyGen(seed);
      const child = BasicSchemeMPL.deriveChildSk(master, test.childIndex);
      it('Has the correct master length', () =>
        assert.equal(master.toBytes().byteLength, 32));
      it('Has the correct child length', () =>
        assert.equal(child.toBytes().byteLength, 32));
      it('Has the correct master bytes', () =>
        assert.deepEqual(master.toBytes(), fromHex(test.masterSk)));
      it('Has the correct child bytes', () =>
        assert.deepEqual(child.toBytes(), fromHex(test.childSk)));
    });
  }
});
