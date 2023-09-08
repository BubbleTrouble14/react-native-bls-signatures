import {
  AugSchemeMPL,
  PrivateKey,
  G1Element,
  G2Element,
} from 'react-native-bls-signatures';
import { Buffer } from '@craftzdog/react-native-buffer';

function getPkSeed() {
  return Uint8Array.from([
    0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18, 102,
    58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
  ]);
}

function getPkBuffer() {
  return Uint8Array.from([
    55, 112, 145, 240, 231, 40, 70, 59, 194, 218, 125, 84, 108, 83, 185, 246,
    184, 29, 244, 161, 204, 26, 181, 191, 41, 197, 144, 139, 113, 81, 163, 45,
  ]);
}

function getSeedAndFingerPrint() {
  var seedArray = getPkSeed();
  var seed = Buffer.from(seedArray);
  return {
    seed: seed,
    fingerprint: 3146750013,
  };
}

function getPkUint8Array() {
  return new Uint8Array(getPkBuffer());
}

export const pkTest = () => {
  testPrivateKey();
  testFromSeed();
  testFromBytes();
  testSerialize();
  testSign();
  testGetPublicKey();
};

function testPrivateKey() {
  const message1 = Uint8Array.from([1, 65, 254, 88, 90, 45, 22]);

  const sk1 = AugSchemeMPL.keyGen(getPkSeed());
  const pk1 = AugSchemeMPL.skToG1(sk1);
  const sig1 = AugSchemeMPL.sign(sk1, message1);

  console.log(
    'PrivateKey test:',
    AugSchemeMPL.verify(pk1, message1, sig1) ? 'Passed' : 'Failed'
  );
}

function testFromSeed() {
  const pk = AugSchemeMPL.keyGen(getPkSeed());
  const isInstance = pk instanceof PrivateKey;
  const isEqual = Buffer.compare(pk.toBytes(), getPkBuffer()) === 0;

  console.log('FromSeed test:', isInstance && isEqual ? 'Passed' : 'Failed');
}

function testFromBytes() {
  const pk1 = PrivateKey.fromBytes(getPkBuffer());
  const isInstance1 = pk1 instanceof PrivateKey;
  const isEqual1 = Buffer.compare(pk1.toBytes(), getPkBuffer()) === 0;

  const pk2 = PrivateKey.fromBytes(getPkUint8Array());
  const isInstance2 = pk2 instanceof PrivateKey;
  const isEqual2 = Buffer.compare(pk2.toBytes(), getPkBuffer()) === 0;

  console.log(
    'FromBytes test:',
    isInstance1 && isEqual1 && isInstance2 && isEqual2 ? 'Passed' : 'Failed'
  );
}

function testSerialize() {
  const pk = AugSchemeMPL.keyGen(getPkSeed());
  const serialized = pk.toBytes();
  const isInstance = serialized instanceof Uint8Array;
  const isEqual = Buffer.compare(serialized, getPkBuffer()) === 0;

  console.log('Serialize test:', isInstance && isEqual ? 'Passed' : 'Failed');
}

function testSign() {
  const pk = PrivateKey.fromBytes(getPkBuffer());
  const pubkey = AugSchemeMPL.skToG1(pk);
  const message = 'Hello world';
  const messageBuffer = Uint8Array.from(Buffer.from(message, 'utf8'));
  const signature = AugSchemeMPL.sign(pk, messageBuffer);

  const isInstance = signature instanceof G2Element;
  const isVerified = AugSchemeMPL.verify(pubkey, messageBuffer, signature);

  console.log('Sign test:', isInstance && isVerified ? 'Passed' : 'Failed');
}

function testGetPublicKey() {
  const pk = AugSchemeMPL.keyGen(getPkSeed());
  const publicKey = AugSchemeMPL.skToG1(pk);
  const isInstance = publicKey instanceof G1Element;
  const isFingerprintCorrect =
    publicKey.getFingerPrint() === getSeedAndFingerPrint().fingerprint;

  console.log(
    'GetPublicKey test:',
    isInstance && isFingerprintCorrect ? 'Passed' : 'Failed'
  );
}
