import {
  AugSchemeMPL,
  BasicSchemeMPL,
  G1Element,
  G2Element,
  PopSchemeMPL,
  PrivateKey,
} from 'react-native-bls-signatures';
import { hash256 } from '../../../src/types/Utils';

function logTest(name: any, ok: boolean = false) {
  return console.log(`${ok ? 'passed' : 'failed'} -> `, name);
}

const testAugSchemeMPLFunctions = () => {
  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  let seed1 = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 2, 254, 22,
  ]);

  let ok;
  console.log('---------AugSchemeMPL---------');
  console.log();

  // keyGen() && skToG1()
  const sk = AugSchemeMPL.keyGen(seed);
  const pk = AugSchemeMPL.skToG1(sk);
  logTest('keyGen() && skToG1()', sk !== undefined && pk !== undefined);

  // sign()
  var message = Uint8Array.from([1, 2, 3, 4, 5]);
  var signature = AugSchemeMPL.sign(sk, message);
  logTest('sign()', signature !== undefined);

  // verify()
  ok = AugSchemeMPL.verify(pk, message, signature);
  logTest('verify()', ok);

  // signPrepend()
  const sig = AugSchemeMPL.signPrepend(sk, message, pk);
  ok = AugSchemeMPL.verify(pk, message, sig);
  logTest('signPrepend() && verify()', ok);

  const sk1 = AugSchemeMPL.keyGen(seed1);
  const pk1 = sk1.getG1();
  logTest(
    'keyGen() for seed1 && getG1()',
    sk1 !== undefined && pk1 !== undefined
  );

  var message1 = Uint8Array.from([1, 7, 3, 4, 5]);
  var signature1 = AugSchemeMPL.sign(sk1, message1);
  logTest('sign() with seed1', signature1 !== undefined);

  ok = AugSchemeMPL.verify(pk1, message1, signature1);
  logTest('verify() with seed1', ok);

  // aggregate()
  const aggregateSig = AugSchemeMPL.aggregate([signature, signature1]);
  logTest('aggregate()', aggregateSig !== undefined);

  // aggregateVerify()
  ok = AugSchemeMPL.aggregateVerify(
    [pk, pk1],
    [message, message1],
    aggregateSig
  );
  logTest('aggregateVerify()', ok);

  const child = AugSchemeMPL.deriveChildSk(sk, 152);
  AugSchemeMPL.deriveChildSk(child, 952);
  const masterPk = sk.getG1();
  const childU = AugSchemeMPL.deriveChildSkUnhardened(sk, 22);
  const grandchildU = AugSchemeMPL.deriveChildSkUnhardened(childU, 0);
  const childUPk = AugSchemeMPL.deriveChildPkUnhardened(masterPk, 22);
  const grandchildUPk = AugSchemeMPL.deriveChildPkUnhardened(childUPk, 0);
  logTest(
    'deriveChildSk() && deriveChildSkUnhardened() && deriveChildPkUnhardened()',
    grandchildUPk.equalTo(grandchildU.getG1())
  );

  console.log();
};

const testBasicSchemeMPLFunctions = () => {
  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  let seed1 = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 2, 254, 22,
  ]);

  let ok;
  console.log('---------BasicSchemeMPL---------');
  console.log();

  // keyGen() && skToG1()
  const sk = BasicSchemeMPL.keyGen(seed);
  const pk = BasicSchemeMPL.skToG1(sk);
  logTest('keyGen() && skToG1()', sk !== undefined && pk !== undefined);

  // sign()
  var message = Uint8Array.from([1, 2, 3, 4, 5]);
  var signature = BasicSchemeMPL.sign(sk, message);
  logTest('sign()', signature !== undefined);

  // verify()
  ok = BasicSchemeMPL.verify(pk, message, signature);
  logTest('verify()', ok);

  const sk1 = BasicSchemeMPL.keyGen(seed1);
  const pk1 = sk1.getG1();
  logTest(
    'keyGen() for seed1 && getG1()',
    sk1 !== undefined && pk1 !== undefined
  );

  var message1 = Uint8Array.from([1, 7, 3, 4, 5]);
  var signature1 = BasicSchemeMPL.sign(sk1, message1);
  logTest('sign() with seed1', signature1 !== undefined);

  ok = BasicSchemeMPL.verify(pk1, message1, signature1);
  logTest('verify() with seed1', ok);

  // aggregate()
  const aggregateSig = BasicSchemeMPL.aggregate([signature, signature1]);
  logTest('aggregate()', aggregateSig !== undefined);

  // aggregateVerify()
  ok = BasicSchemeMPL.aggregateVerify(
    [pk, pk1],
    [message, message1],
    aggregateSig
  );
  logTest('aggregateVerify()', ok);

  const child = BasicSchemeMPL.deriveChildSk(sk, 152);
  BasicSchemeMPL.deriveChildSk(child, 952);
  const masterPk = sk.getG1();
  const childU = BasicSchemeMPL.deriveChildSkUnhardened(sk, 22);
  const grandchildU = BasicSchemeMPL.deriveChildSkUnhardened(childU, 0);
  const childUPk = BasicSchemeMPL.deriveChildPkUnhardened(masterPk, 22);
  const grandchildUPk = BasicSchemeMPL.deriveChildPkUnhardened(childUPk, 0);
  logTest(
    'deriveChildSk() && deriveChildSkUnhardened() && deriveChildPkUnhardened()',
    grandchildUPk.equalTo(grandchildU.getG1())
  );

  console.log();
};

const testPopSchemeMPLFunctions = () => {
  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  let seed1 = Uint8Array.from([1, ...seed.slice(1)]);

  let ok;
  console.log('---------PopSchemeMPL---------');
  console.log();

  // keyGen() && skToG1()
  const sk = PopSchemeMPL.keyGen(seed);
  const pk = PopSchemeMPL.skToG1(sk);
  logTest('keyGen() && skToG1()', sk !== undefined && pk !== undefined);

  // sign()
  var message = Uint8Array.from([1, 2, 3, 4, 5]);
  var signature = PopSchemeMPL.sign(sk, message);
  logTest('sign()', signature !== undefined);

  // verify()
  ok = PopSchemeMPL.verify(pk, message, signature);
  logTest('verify()', ok);

  const sk_1 = PopSchemeMPL.keyGen(seed1);
  const pk_1 = sk_1.getG1();
  logTest(
    'keyGen() for seed1 && getG1()',
    sk_1 !== undefined && pk_1 !== undefined
  );

  var message1 = Uint8Array.from([1, 7, 3, 4, 5]);
  var signature1 = PopSchemeMPL.sign(sk_1, message1);
  logTest('sign() with seed1', signature1 !== undefined);

  ok = PopSchemeMPL.verify(pk_1, message1, signature1);
  logTest('verify() with seed1', ok);

  // aggregate()
  const aggregateSig = PopSchemeMPL.aggregate([signature, signature1]);
  logTest('aggregate()', aggregateSig !== undefined);

  // aggregateVerify()
  ok = PopSchemeMPL.aggregateVerify(
    [pk, pk_1],
    [message, message1],
    aggregateSig
  );
  logTest('aggregateVerify()', ok);

  const child = PopSchemeMPL.deriveChildSk(sk, 152);
  PopSchemeMPL.deriveChildSk(child, 952);
  const masterPk = sk.getG1();
  const childU = PopSchemeMPL.deriveChildSkUnhardened(sk, 22);
  const grandchildU = PopSchemeMPL.deriveChildSkUnhardened(childU, 0);
  const childUPk = PopSchemeMPL.deriveChildPkUnhardened(masterPk, 22);
  const grandchildUPk = PopSchemeMPL.deriveChildPkUnhardened(childUPk, 0);
  logTest(
    'deriveChildSk() && deriveChildSkUnhardened() && deriveChildPkUnhardened()',
    grandchildUPk.equalTo(grandchildU.getG1())
  );

  const sk1 = AugSchemeMPL.keyGen(seed1);
  const seed2 = Uint8Array.from([2, ...seed.slice(1)]);
  const sk2 = AugSchemeMPL.keyGen(seed2);
  const pk1 = sk1.getG1();
  const pk2 = sk2.getG1();
  const seed3 = Uint8Array.from([3, ...seed.slice(1)]);
  const sk3 = AugSchemeMPL.keyGen(seed3);
  const pk3 = sk3.getG1();

  const popSig1 = PopSchemeMPL.sign(sk1, message);
  const popSig2 = PopSchemeMPL.sign(sk2, message);
  const popSig3 = PopSchemeMPL.sign(sk3, message);
  const pop1 = PopSchemeMPL.popProve(sk1);
  const popSigAgg = PopSchemeMPL.aggregate([popSig1, popSig2, popSig3]);

  ok = PopSchemeMPL.fastAggregateVerify([pk1, pk2, pk3], message, popSigAgg);

  logTest(
    'popVerify() && popProve() && fastAggregateVerify()',
    ok && pop1 !== undefined
  );
  console.log();
};

const testPrivateKeyFunctions = () => {
  console.log('---------PrivateKey---------');
  console.log();

  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  const hexSeed = toHex(seed);
  const sk = PrivateKey.fromBytes(seed);
  const sk1 = PrivateKey.fromHex(hexSeed);
  const hexString = sk1.toString();
  logTest(`toString() -> ${hexString}`, hexString !== undefined);
  logTest('fromBytes() && fromHex()', sk.toHex() === sk1.toHex());
  logTest('equalTo()', sk.equalTo(sk1));
  logTest(
    'getG1() && getG2()',
    sk.getG1() !== undefined && sk.getG2() !== undefined
  );
  const sk2 = PrivateKey.aggregate([sk, AugSchemeMPL.keyGen(seed)]);
  logTest('aggregate()', sk2 !== undefined);
  console.log();
};

const testG1ElementFunctions = () => {
  console.log('---------G1Element---------');
  console.log();

  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  const sk = AugSchemeMPL.keyGen(seed);
  const pkBytes = sk.getG1().toBytes();
  const pkHex = sk.getG1().toHex();
  const pkFromBytes = G1Element.fromBytes(pkBytes);
  const pkFromHex = G1Element.fromHex(pkHex);
  logTest(
    `toBytes() && toHex() && fromBytes() && fromHex()`,
    pkFromBytes.toHex() === pkFromHex.toHex()
  );
  logTest(`equalTo()`, pkFromBytes.equalTo(pkFromHex));

  logTest(`getFingerPrint()`, sk.getG1().getFingerPrint() !== undefined);

  let el1 = sk.getG1().add(pkFromBytes);
  let el2 = sk.getG1().negate();
  logTest(
    `add() && negate()`,
    el2.toHex() !== undefined && el1.toHex() !== undefined
  );
  console.log();
};

const testG2ElementFunctions = () => {
  console.log('---------G2Element---------');
  console.log();

  let seed = Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
  const sk = AugSchemeMPL.keyGen(seed);
  const pkBytes = sk.getG2().toBytes();
  const pkHex = sk.getG2().toHex();
  const pkFromBytes = G2Element.fromBytes(pkBytes);
  const pkFromHex = G2Element.fromHex(pkHex);
  logTest(
    `toBytes() && toHex() && fromBytes() && fromHex()`,
    pkFromBytes.toHex() === pkFromHex.toHex()
  );
  logTest(`equalTo()`, pkFromBytes.equalTo(pkFromHex));

  let el1 = sk.getG2().add(pkFromBytes);
  let el2 = sk.getG2().negate();
  logTest(
    `add() && negate()`,
    el2.toHex() !== undefined && el1.toHex() !== undefined
  );
  console.log();
  console.log('---------------------------');
};

const testUtilFunctions = () => {
  console.log('---------Utils---------');
  console.log();

  let seed = getRandomSeed();
  const hash = hash256(seed);
  const seedHex = toHex(seed);
  const seedBytes = fromHex(seedHex);
  logTest(
    `toHex() && fromHex() && hash() && getRandomSeed() -> ${toHex(hash)}`,
    toHex(seedBytes) === seedHex
  );

  console.log('---------------------------');
};

export default function testBridgeFunctions() {
  console.log('Testing functions for any bridging errors:');
  console.log();
  testAugSchemeMPLFunctions();
  testBasicSchemeMPLFunctions();
  testPopSchemeMPLFunctions();
  testPrivateKeyFunctions();
  testG1ElementFunctions();
  testG2ElementFunctions();
  testUtilFunctions();
}

export { testBridgeFunctions };
