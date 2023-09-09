import {
  AugSchemeMPL,
  BasicSchemeMPL,
  G1Element,
  G2Element,
  PopSchemeMPL,
  PrivateKey,
} from 'react-native-bls-signatures';

function testSchemes() {
  var seedArray = [
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ];
  var seed = Uint8Array.from(seedArray);
  const msg = Uint8Array.from([100, 2, 254, 88, 90, 45, 23]);
  const msg2 = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const sk = BasicSchemeMPL.keyGen(seed);
  const pk = sk.getG1();
  [BasicSchemeMPL, AugSchemeMPL, PopSchemeMPL].map((Scheme) => {
    const sig = Scheme.sign(sk, msg);
    const schemaName = Scheme.constructor.name; // Get the name of the Scheme
    console.log(
      `${schemaName} - Scheme.verify(pk, msg, sig):`,
      Scheme.verify(pk, msg, sig)
    );
  });
  seed = new Uint8Array([1, ...seed.slice(1)]);
  const sk1 = BasicSchemeMPL.keyGen(seed);
  const pk1 = sk1.getG1();
  let newSeed = new Uint8Array(1 + seed.length - 1);
  newSeed.set(Uint8Array.from([2]));
  newSeed.set(seed.slice(1), 1);
  seed = newSeed;
  const sk2 = BasicSchemeMPL.keyGen(seed);
  const pk2 = sk2.getG1();
  [BasicSchemeMPL, AugSchemeMPL, PopSchemeMPL].map((Scheme) => {
    const schemaName = Scheme.name; // Get the name of the Scheme
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
    console.log(
      `${schemaName} - Scheme.verify(agg_pk, msg, agg_sig):`,
      Scheme.verify(agg_pk, msg, agg_sig)
    );
    sig1 = Scheme.sign(sk1, msg);
    sig2 = Scheme.sign(sk2, msg2);
    agg_sig = Scheme.aggregate([sig1, sig2]);
    console.log(
      `${schemaName} - Scheme.aggregateVerify([pk1, pk2], [msg, msg2], agg_sig):`,
      Scheme.aggregateVerify([pk1, pk2], [msg, msg2], agg_sig)
    );
    const child = Scheme.deriveChildSk(sk1, 123);
    const childU = Scheme.deriveChildSkUnhardened(sk1, 123);
    const childUPk = Scheme.deriveChildPkUnhardened(pk1, 123);
    const sig_child = Scheme.sign(child, msg);
    console.log(
      `${schemaName} - Scheme.verify(child.getG1(), msg, sig_child):`,
      Scheme.verify(child.getG1(), msg, sig_child)
    );
    const sigU_child = Scheme.sign(childU, msg);
    console.log(
      `${schemaName} - Scheme.verify(childUPk, msg, sigU_child):`,
      Scheme.verify(childUPk, msg, sigU_child)
    );
  });
}

function testVectorsInvalid() {
  const invalid_inputs_1 = [
    // infinity points: too short
    'c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    // infinity points: not all zeros
    'c00000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000',
    // bad tags
    '3a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
    '7a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
    'fa0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
    // wrong length for compresed point
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa',
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaaaa',
    // invalid x-coord
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa',
    // invalid elm of Fp --- equal to p (must be strictly less)
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
  ];
  const invalid_inputs_2 = [
    // infinity points: too short
    'c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    // infinity points: not all zeros
    'c00000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000',
    // bad tags
    '3a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '7a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'fa0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    // wrong length for compressed point
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    // invalid x-coord
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa7',
    // invalid elm of Fp --- equal to p (must be strictly less)
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '9a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaaa1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
  ];
  // ... (rest of the setup is the same)

  let g1_exn_count = 0;
  let g2_exn_count = 0;

  invalid_inputs_1.map((s) => {
    try {
      const g1 = G1Element.fromHex(s);
      console.log(`Failed to disallow creation of G1 element for string ${s}`);
    } catch (e) {
      g1_exn_count++;
    }
  });

  invalid_inputs_2.map((s) => {
    try {
      const g2 = G2Element.fromHex(s);
      console.log(`Failed to disallow creation of G2 element for string ${s}`);
    } catch (e) {
      g2_exn_count++;
    }
  });

  if (g1_exn_count != invalid_inputs_1.length) {
    console.log(
      `Error: Expected all invalid G1 inputs to throw exceptions. Successful G1 conversions: ${
        invalid_inputs_1.length - g1_exn_count
      }`
    );
  }

  if (g2_exn_count != invalid_inputs_2.length) {
    console.log(
      `Error: Expected all invalid G2 inputs to throw exceptions. Successful G2 conversions: ${
        invalid_inputs_2.length - g2_exn_count
      }`
    );
  }
}

export { testSchemes, testVectorsInvalid };
// const msg3 = Uint8Array.from([1, 2, 3]);
