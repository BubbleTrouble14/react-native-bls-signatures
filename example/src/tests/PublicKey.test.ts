import { G1Element } from 'react-native-bls-signatures';
import { Buffer } from '@craftzdog/react-native-buffer';

function getPublicKeyFixtureHex() {
  return '9790635de8740e9a6a6b15fb6b72f3a16afa0973d971979b6ba54761d6e2502c50db76f4d26143f05459a42cfd520d44';
}

function getPublicKeyFixture() {
  return {
    buffer: Uint8Array.from(Buffer.from(getPublicKeyFixtureHex(), 'hex')),
    fingerprint: 0xa14c4f99,
  };
}

function getPublicKeysHexes() {
  return [
    '82a8d2aaa6a5e2e08d4b8d406aaf0121a2fc2088ed12431e6b0663028da9ac5922c9ea91cde7dd74b7d795580acc7a61',
    '856e742478d4e95e708b8ae0d487f94099b769cb7df4c674dc0c10fbbe7d175603d090ac6064aeeb249a00ba6b3d85eb',
  ];
}

function getPublicKeysArray() {
  return getPublicKeysHexes().map((hex) => {
    return Uint8Array.from(Buffer.from(hex, 'hex'));
  });
}

export const g1ElementTests = () => {
  testG1ElementFromBytes();
  // testG1ElementAggregate();
  testG1ElementSerialize();
  testG1ElementGetFingerprint();
};

function testG1ElementFromBytes() {
  const pk = G1Element.fromBytes(getPublicKeyFixture().buffer);
  const result = pk instanceof G1Element;
  console.log('G1Element.fromBytes test:', result ? 'Passed' : 'Failed');
}

// function testG1ElementAggregate() {
//   const pks = getPublicKeysArray().map((buf) => G1Element.fromBytes(buf));
//   let first_pk = pks[0];
//   for (let i = 1; i < pks.length; i++) {
//     first_pk = first_pk.add(pks[i]);
//   }
//   const result = first_pk instanceof G1Element;
//   console.log('G1Element.aggregate test:', result ? 'Passed' : 'Failed');
// }

function testG1ElementSerialize() {
  const pk = G1Element.fromBytes(getPublicKeyFixture().buffer);
  const serialized = pk.toBytes();
  const isEqual =
    Buffer.from(serialized).toString('hex') === getPublicKeyFixtureHex();
  console.log('G1Element#serialize test:', isEqual ? 'Passed' : 'Failed');
}

function testG1ElementGetFingerprint() {
  const pk = G1Element.fromBytes(getPublicKeyFixture().buffer);
  const fingerprint = pk.getFingerPrint();
  const isEqual = fingerprint === getPublicKeyFixture().fingerprint;
  console.log('G1Element.getFingerprint test:', isEqual ? 'Passed' : 'Failed');
}
