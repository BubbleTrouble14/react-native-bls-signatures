import {
  AugSchemeMPL,
  BasicSchemeMPL,
  G1Element,
  G2Element,
  PopSchemeMPL,
  PrivateKey,
} from 'react-native-bls-signatures';
import { Buffer } from '@craftzdog/react-native-buffer';

function logTest(name: any, ok: boolean = false) {
  console.log(`${ok ? 'passed' : 'failed'} -> `, name);
}

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
    logTest(
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
    logTest(
      `${schemaName} - Scheme.verify(agg_pk, msg, agg_sig):`,
      Scheme.verify(agg_pk, msg, agg_sig)
    );
    sig1 = Scheme.sign(sk1, msg);
    sig2 = Scheme.sign(sk2, msg2);
    agg_sig = Scheme.aggregate([sig1, sig2]);
    logTest(
      `${schemaName} - Scheme.aggregateVerify([pk1, pk2], [msg, msg2], agg_sig):`,
      Scheme.aggregateVerify([pk1, pk2], [msg, msg2], agg_sig)
    );
    const child = Scheme.deriveChildSk(sk1, 123);
    const childU = Scheme.deriveChildSkUnhardened(sk1, 123);
    const childUPk = Scheme.deriveChildPkUnhardened(pk1, 123);
    const sig_child = Scheme.sign(child, msg);
    logTest(
      `${schemaName} - Scheme.verify(child.getG1(), msg, sig_child):`,
      Scheme.verify(child.getG1(), msg, sig_child)
    );
    const sigU_child = Scheme.sign(childU, msg);
    logTest(
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
      logTest(`Failed to disallow creation of G1 element for string ${s}`);
    } catch (e) {
      g1_exn_count++;
    }
  });

  invalid_inputs_2.map((s) => {
    try {
      const g2 = G2Element.fromHex(s);
      logTest(`Failed to disallow creation of G2 element for string ${s}`);
    } catch (e) {
      g2_exn_count++;
    }
  });

  if (g1_exn_count != invalid_inputs_1.length) {
    logTest(
      `Error: Expected all invalid G1 inputs to throw exceptions. Successful G1 conversions: ${
        invalid_inputs_1.length - g1_exn_count
      }`
    );
  }

  if (g2_exn_count != invalid_inputs_2.length) {
    logTest(
      `Error: Expected all invalid G2 inputs to throw exceptions. Successful G2 conversions: ${
        invalid_inputs_2.length - g2_exn_count
      }`
    );
  }

  if (
    g1_exn_count == invalid_inputs_1.length &&
    g2_exn_count == invalid_inputs_2.length
  )
    logTest('finished testVectorsInvalid with successfully', true);
}

function createRepeatedUint8Array(length: number, value: number) {
  return new Uint8Array(Array(length).fill(value));
}

function range(size: number) {
  return [...Array(size).keys()];
}

function testVectorsValid() {
  const ref_sig1Basic =
    '96ba34fac33c7f129d602a0bc8a3d43f9abc014eceaab7359146b4b150e57b808645738f35671e9e10e0d862a30cab70074eb5831d13e6a5b162d01eebe687d0164adbd0a864370a7c222a2768d7704da254f1bf1823665bc2361f9dd8c00e99';
  const ref_sig2Basic =
    'a402790932130f766af11ba716536683d8c4cfa51947e4f9081fedd692d6dc0cac5b904bee5ea6e25569e36d7be4ca59069a96e34b7f700758b716f9494aaa59a96e74d14a3b552a9a6bc129e717195b9d6006fd6d5cef4768c022e0f7316abf';
  const ref_sigABasic =
    '987cfd3bcd62280287027483f29c55245ed831f51dd6bd999a6ff1a1f1f1f0b647778b0167359c71505558a76e158e66181ee5125905a642246b01e7fa5ee53d68a4fe9bfb29a8e26601f0b9ad577ddd18876a73317c216ea61f430414ec51c5';
  const ref_sig1Aug =
    '8180f02ccb72e922b152fcedbe0e1d195210354f70703658e8e08cbebf11d4970eab6ac3ccf715f3fb876df9a9797abd0c1af61aaeadc92c2cfe5c0a56c146cc8c3f7151a073cf5f16df38246724c4aed73ff30ef5daa6aacaed1a26ecaa336b';
  const ref_sig2Aug =
    '99111eeafb412da61e4c37d3e806c6fd6ac9f3870e54da9222ba4e494822c5b7656731fa7a645934d04b559e9261b86201bbee57055250a459a2da10e51f9c1a6941297ffc5d970a557236d0bdeb7cf8ff18800b08633871a0f0a7ea42f47480';
  const ref_sigAAug =
    '8c5d03f9dae77e19a5945a06a214836edb8e03b851525d84b9de6440e68fc0ca7303eeed390d863c9b55a8cf6d59140a01b58847881eb5af67734d44b2555646c6616c39ab88d253299acc1eb1b19ddb9bfcbe76e28addf671d116c052bb1847';
  const ref_sig1Pop =
    '9550fb4e7f7e8cc4a90be8560ab5a798b0b23000b6a54a2117520210f986f3f281b376f259c0b78062d1eb3192b3d9bb049f59ecc1b03a7049eb665e0df36494ae4cb5f1136ccaeefc9958cb30c3333d3d43f07148c386299a7b1bfc0dc5cf7c';
  const ref_sig2Pop =
    'a69036bc11ae5efcbf6180afe39addde7e27731ec40257bfdc3c37f17b8df68306a34ebd10e9e32a35253750df5c87c2142f8207e8d5654712b4e554f585fb6846ff3804e429a9f8a1b4c56b75d0869ed67580d789870babe2c7c8a9d51e7b2a';
  const ref_sigAPop =
    'a4ea742bcdc1553e9ca4e560be7e5e6c6efa6a64dddf9ca3bb2854233d85a6aac1b76ec7d103db4e33148b82af9923db05934a6ece9a7101cd8a9d47ce27978056b0f5900021818c45698afdd6cf8a6b6f7fee1f0b43716f55e413d4b87a6039';

  const secret1 = createRepeatedUint8Array(32, 1);
  const secret2 = new Uint8Array(range(32).map((x) => (x * 314159) % 256));
  const sk1 = PrivateKey.fromBytes(secret1, false);
  const sk2 = PrivateKey.fromBytes(secret2, false);

  const msg = Buffer.from([3, 1, 4, 1, 5, 9]);
  const sig1Basic = BasicSchemeMPL.sign(sk1, msg);
  const sig2Basic = BasicSchemeMPL.sign(sk2, msg);
  const sigABasic = BasicSchemeMPL.aggregate([sig1Basic, sig2Basic]);
  const sig1Aug = AugSchemeMPL.sign(sk1, msg);
  const sig2Aug = AugSchemeMPL.sign(sk2, msg);
  const sigAAug = AugSchemeMPL.aggregate([sig1Aug, sig2Aug]);
  const sig1Pop = PopSchemeMPL.sign(sk1, msg);
  const sig2Pop = PopSchemeMPL.sign(sk2, msg);
  const sigAPop = PopSchemeMPL.aggregate([sig1Pop, sig2Pop]);

  checkEquality(sig1Basic.toHex(), ref_sig1Basic, 'sig1Basic');
  checkEquality(sig2Basic.toHex(), ref_sig2Basic, 'sig2Basic');
  checkEquality(sigABasic.toHex(), ref_sigABasic, 'sigABasic');
  checkEquality(sig1Aug.toHex(), ref_sig1Aug, 'sig1Aug');
  checkEquality(sig2Aug.toHex(), ref_sig2Aug, 'sig2Aug');
  checkEquality(sigAAug.toHex(), ref_sigAAug, 'sigAAug');
  checkEquality(sig1Pop.toHex(), ref_sig1Pop, 'sig1Pop');
  checkEquality(sig2Pop.toHex(), ref_sig2Pop, 'sig2Pop');
  checkEquality(sigAPop.toHex(), ref_sigAPop, 'sigAPop');
}

function checkEquality(buffer1: string, buffer2Hex: string, label: string) {
  const isEqual = buffer1 === buffer2Hex;
  logTest(`${label} matches reference`, isEqual);
}

function testReadme() {
  // console.log('Starting test_readme function...');

  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  // console.log(`Initial seed: ${seed}`);

  let sk = AugSchemeMPL.keyGen(seed);
  let pk = sk.getG1();
  // logTest('Generated sk and pk');

  const message = Uint8Array.from([1, 2, 3, 4, 5]);
  let signature = AugSchemeMPL.sign(sk, message);
  // logTest('Generated signature:', signature.toHex());

  let ok = AugSchemeMPL.verify(pk, message, signature);
  logTest('Verification result:', ok);

  const sk_bytes = sk.toHex();
  const pk_bytes = pk.toHex();
  const signature_bytes = signature.toHex();
  // logTest('Serialized sk, pk, signature:', sk_bytes, pk_bytes, signature_bytes);

  // Deserialize process
  sk = PrivateKey.fromBytes(sk.toBytes(), false);
  pk = G1Element.fromBytes(pk.toBytes());
  signature = G2Element.fromBytes(signature.toBytes());
  // logTest('Deserialization complete.');

  seed = Uint8Array.from([1, ...seed.slice(1)]);
  // logTest(`Modified seed: ${seed}`, true);

  const sk1 = AugSchemeMPL.keyGen(seed);
  seed = Uint8Array.from([2, ...seed.slice(1)]);
  const sk2 = AugSchemeMPL.keyGen(seed);
  // logTest('Derived sk1 and sk2.');

  const message2 = Uint8Array.from([1, 2, 3, 4, 5, 6, 7]);

  const pk1 = sk1.getG1();
  const sig1 = AugSchemeMPL.sign(sk1, message);

  const pk2 = sk2.getG1();
  const sig2 = AugSchemeMPL.sign(sk2, message2);
  // logTest('Signed messages with sk1 and sk2.');

  const agg_sig = AugSchemeMPL.aggregate([sig1, sig2]);
  // logTest('Aggregated signatures.');

  ok = AugSchemeMPL.aggregateVerify([pk1, pk2], [message, message2], agg_sig);
  logTest('Aggregate verification result:', ok);

  seed = Uint8Array.from([3, ...seed.slice(1)]);
  //logTest('Updated Seed:', seed.toString('hex'));

  const sk3 = AugSchemeMPL.keyGen(seed);
  //logTest('sk3:', sk3); // Assuming sk3 can be logged directly. If not, serialize or transform it into a readable format.

  const pk3 = sk3.getG1();
  //logTest('pk3:', pk3); // Similarly, adjust if direct logging isn't possible.

  const message3 = Uint8Array.from([100, 2, 254, 88, 90, 45, 23]);
  //logTest('message3:', message3.toString('hex'));

  const sig3 = AugSchemeMPL.sign(sk3, message3);
  //logTest('sig3:', sig3); // Again, adjust logging format if necessary.

  const agg_sig_final = AugSchemeMPL.aggregate([agg_sig, sig3]);
  //logTest('agg_sig_final:', agg_sig_final); // Adjust logging format if necessary.

  ok = AugSchemeMPL.aggregateVerify(
    [pk1, pk2, pk3],
    [message, message2, message3],
    agg_sig_final
  );
  logTest('Aggregate Verification Result:', ok);

  const pop_sig1 = PopSchemeMPL.sign(sk1, message);
  const pop_sig2 = PopSchemeMPL.sign(sk2, message);
  const pop_sig3 = PopSchemeMPL.sign(sk3, message);
  const pop1 = PopSchemeMPL.popProve(sk1);
  const pop2 = PopSchemeMPL.popProve(sk2);
  const pop3 = PopSchemeMPL.popProve(sk3);

  ok = PopSchemeMPL.popVerify(pk1, pop1);
  logTest('Verification for pk1 and pop1:', ok);
  ok = PopSchemeMPL.popVerify(pk2, pop2);
  logTest('Verification for pk2 and pop2:', ok);
  ok = PopSchemeMPL.popVerify(pk3, pop3);
  logTest('Verification for pk3 and pop3:', ok);

  const pop_sig_agg = PopSchemeMPL.aggregate([pop_sig1, pop_sig2, pop_sig3]);

  ok = PopSchemeMPL.fastAggregateVerify([pk1, pk2, pk3], message, pop_sig_agg);
  logTest('Fast aggregate verification result:', ok);

  const pop_agg_pk = pk1.add(pk2).add(pk3);
  //logTest('Serialized pop_agg_pk:', pop_agg_pk.toHex());
  const t_pop_agg_pk_1 = pk1.add(pk2.add(pk3));
  logTest(
    'Do serialized pop_agg_pk and t_pop_agg_pk_1 match?',
    pop_agg_pk.equalTo(t_pop_agg_pk_1)
  );

  //logTest('Serialized pop_sig_agg:', pop_sig_agg.toHex());
  ok = PopSchemeMPL.verify(pop_agg_pk, message, pop_sig_agg);
  logTest('PopSchemeMPL.verify result:', ok);

  const pop_agg_sk = PrivateKey.aggregate([sk1, sk2, sk3]);
  ok = PopSchemeMPL.sign(pop_agg_sk, message).toHex() === pop_sig_agg.toHex();
  logTest('Does signed pop_agg_sk match pop_sig_agg?', ok);

  const master_sk = AugSchemeMPL.keyGen(seed);
  const child = AugSchemeMPL.deriveChildSk(master_sk, 152);
  const grandchild = AugSchemeMPL.deriveChildSk(child, 952);

  const master_pk = master_sk.getG1();
  const child_u = AugSchemeMPL.deriveChildSkUnhardened(master_sk, 22);
  const grandchild_u = AugSchemeMPL.deriveChildSkUnhardened(child_u, 0);

  const child_u_pk = AugSchemeMPL.deriveChildPkUnhardened(master_pk, 22);
  const grandchild_u_pk = AugSchemeMPL.deriveChildPkUnhardened(child_u_pk, 0);

  ok = grandchild_u_pk.equalTo(grandchild_u.getG1());
  logTest('Do serialized grandchild_u_pk and grandchild_u match?', ok);
}

export const tests = () => {
  testSchemes();
  testVectorsInvalid();
  testVectorsValid();
  testReadme();
};

// export { testSchemes, testVectorsInvalid, testVectorsValid, testReadme };
// // const msg3 = Uint8Array.from([1, 2, 3]);
