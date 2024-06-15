import { describe, it } from '../MochaRNAdapter';
import { assert } from 'chai';
import {
  BasicSchemeMPL,
  AugSchemeMPL,
  PopSchemeMPL,
} from 'react-native-bls-signatures';

describe('Schemes', () => {
  // Initialize a seed for key generation using Uint8Array
  let seed = new Uint8Array([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);

  // Define messages to be signed
  const msg = new Uint8Array([100, 2, 254, 88, 90, 45, 23]).buffer;
  const msg2 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).buffer;

  // Generate a secret key (sk) and public key (pk) using BasicSchemeMPL
  const sk = BasicSchemeMPL.keyGen(seed.buffer);
  const pk = sk.getG1();

  // Test signing and verification for each scheme
  [BasicSchemeMPL, AugSchemeMPL, PopSchemeMPL].forEach((Scheme) => {
    const sig = Scheme.sign(sk, msg);
    assert(Scheme.verify(pk, msg, sig));
  });

  // Generate additional keys with different seeds
  seed = new Uint8Array([1, ...seed.slice(1)]);
  const sk1 = BasicSchemeMPL.keyGen(seed.buffer);
  const pk1 = sk1.getG1();

  seed = new Uint8Array([2, ...seed.slice(1)]);
  const sk2 = BasicSchemeMPL.keyGen(seed.buffer);
  const pk2 = sk2.getG1();

  // Test key aggregation, signing, and verification for each scheme
  [BasicSchemeMPL, AugSchemeMPL, PopSchemeMPL].forEach((Scheme) => {
    const agg_pk = pk1.add(pk2);
    let sig1, sig2;

    if (Scheme === AugSchemeMPL) {
      sig1 = Scheme.signPrepend(sk1, msg, agg_pk);
      sig2 = Scheme.signPrepend(sk2, msg, agg_pk);
    } else {
      sig1 = Scheme.sign(sk1, msg);
      sig2 = Scheme.sign(sk2, msg);
    }

    let agg_sig = Scheme.aggregate([sig1, sig2]);
    assert(Scheme.verify(agg_pk, msg, agg_sig));

    // Test aggregation with different messages
    sig1 = Scheme.sign(sk1, msg);
    sig2 = Scheme.sign(sk2, msg2);
    agg_sig = Scheme.aggregate([sig1, sig2]);
    assert(Scheme.aggregateVerify([pk1, pk2], [msg, msg2], agg_sig));

    // Test HD keys derivation
    const child = Scheme.deriveChildSk(sk1, 123);
    const childU = Scheme.deriveChildSkUnhardened(sk1, 123);
    const childUPk = Scheme.deriveChildPkUnhardened(pk1, 123);

    const sig_child = Scheme.sign(child, msg);
    assert(Scheme.verify(child.getG1(), msg, sig_child));

    const sigU_child = Scheme.sign(childU, msg);
    assert(Scheme.verify(childUPk, msg, sigU_child));
  });

  // Ensure all tests complete successfully
  it('All tests in SchemaTests have finished successfully.', () => {
    assert(true);
  });
});
