import { describe, it } from '../MochaRNAdapter';
import { assert, expect } from 'chai';
import {
  BasicSchemeMPL,
  AugSchemeMPL,
  PopSchemeMPL,
} from 'react-native-bls-signatures';

describe('Schemes', () => {
  var seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);

  const msg = Buffer.from([100, 2, 254, 88, 90, 45, 23]);
  const msg2 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const sk = BasicSchemeMPL.keyGen(seed);
  const pk = sk.getG1();

  //assert(sk == PrivateKey.fromBytes(sk.serialize(), false));
  //assert(pk == G1Element.fromBytes(pk.serialize()));

  [BasicSchemeMPL, AugSchemeMPL, PopSchemeMPL].map((Scheme) => {
    const sig = Scheme.sign(sk, msg);
    assert(Scheme.verify(pk, msg, sig));
  });

  var seed = Uint8Array.from([1, ...seed.slice(1)]);
  const sk1 = BasicSchemeMPL.keyGen(seed);
  const pk1 = sk1.getG1();
  var seed = Uint8Array.from([2, ...seed.slice(1)]);

  const sk2 = BasicSchemeMPL.keyGen(seed);
  const pk2 = sk2.getG1();

  [BasicSchemeMPL, AugSchemeMPL, PopSchemeMPL].map((Scheme) => {
    const agg_pk = pk1.add(pk2);
    var sig1, sig2;
    if (Scheme === AugSchemeMPL) {
      sig1 = Scheme.signPrepend(sk1, msg, agg_pk);
      sig2 = Scheme.signPrepend(sk2, msg, agg_pk);
    } else {
      sig1 = Scheme.sign(sk1, msg);
      sig2 = Scheme.sign(sk2, msg);
    }

    var agg_sig = Scheme.aggregate([sig1, sig2]);
    assert(Scheme.verify(agg_pk, msg, agg_sig));

    // Aggregate different message
    sig1 = Scheme.sign(sk1, msg);
    sig2 = Scheme.sign(sk2, msg2);
    agg_sig = Scheme.aggregate([sig1, sig2]);
    assert(Scheme.aggregateVerify([pk1, pk2], [msg, msg2], agg_sig));

    // HD keys
    const child = Scheme.deriveChildSk(sk1, 123);
    const childU = Scheme.deriveChildSkUnhardened(sk1, 123);
    const childUPk = Scheme.deriveChildPkUnhardened(pk1, 123);

    const sig_child = Scheme.sign(child, msg);
    assert(Scheme.verify(child.getG1(), msg, sig_child));

    const sigU_child = Scheme.sign(childU, msg);
    assert(Scheme.verify(childUPk, msg, sigU_child));
    it('All tests in SchemaTests have finished successfully.', () =>
      assert(true));
  });
});
