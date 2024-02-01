import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import type { RootStackParamList } from '../../RootProps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AugSchemeMPL,
  G1Element,
  G2Element,
  PopSchemeMPL,
  getRandomSeed,
} from 'react-native-bls-signatures';

function benchSigs() {
  const testName = 'Signing';
  const numIters = 5000;
  const sk = AugSchemeMPL.keyGen(getRandomSeed());
  const message1 = sk.getG1().toBytes();

  const start = performance.now();

  for (let i = 0; i < numIters; i++) {
    AugSchemeMPL.sign(sk, message1);
  }
  endStopwatch(testName, start, numIters);
}

function benchVerification() {
  const testName = 'Verification';
  const numIters = 10000;
  const sk = AugSchemeMPL.keyGen(getRandomSeed());
  const pk = sk.getG1();
  const sigs: G2Element[] = [];

  const start = performance.now();

  for (let i = 0; i < numIters; i++) {
    const message = new Uint8Array(4);
    // Convert integer to four bytes
    new DataView(message.buffer).setUint32(0, i, true);
    const sig = AugSchemeMPL.sign(sk, message);
    sigs.push(sig);
  }

  for (let i = 0; i < numIters; i++) {
    const message = new Uint8Array(4);
    new DataView(message.buffer).setUint32(0, i, true);
    const ok = AugSchemeMPL.verify(pk, message, sigs[i]!);
    assert(ok);
  }
  endStopwatch(testName, start, numIters);
}

function benchBatchVerification() {
  const numIters = 100000;

  const sigs: G2Element[] = [];
  const pks: G1Element[] = [];
  const messages: Uint8Array[] = [];

  for (let i = 0; i < numIters; i++) {
    const message = new Uint8Array(4);
    new DataView(message.buffer).setUint32(0, i, true);
    const sk = AugSchemeMPL.keyGen(getRandomSeed());
    const pk = sk.getG1();
    const sig = AugSchemeMPL.sign(sk, message);
    sigs.push(sig);
    pks.push(pk);
    messages.push(message);
  }

  const start = performance.now();
  const aggSig = AugSchemeMPL.aggregate(sigs);
  const ok = AugSchemeMPL.aggregateVerify(pks, messages, aggSig);
  assert(ok);
  endStopwatch('Batch verification', start, numIters);
}

function benchFastAggregateVerification() {
  const numIters = 5000;

  const sigs: G2Element[] = [];
  const pks: G1Element[] = [];
  const message = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
  const pops: G2Element[] = [];

  for (let i = 0; i < numIters; i++) {
    const sk = PopSchemeMPL.keyGen(getRandomSeed());
    const pk = sk.getG1();
    sigs.push(PopSchemeMPL.sign(sk, message));
    pops.push(PopSchemeMPL.popProve(sk));
    pks.push(pk);
  }

  const start = performance.now();
  const aggSig = PopSchemeMPL.aggregate(sigs);
  for (let i = 0; i < numIters; i++) {
    const ok = PopSchemeMPL.popVerify(pks[i]!, pops[i]!);
    assert(ok);
  }
  const ok = PopSchemeMPL.fastAggregateVerify(pks, message, aggSig);
  assert(ok);
  endStopwatch('PopScheme verification', start, numIters);
}

function assert(condition: boolean) {
  if (!condition) {
    throw new Error('Assertion failed');
  }
}

function endStopwatch(testName: string, startTime: number, numIters: number) {
  const durationMs = performance.now() - startTime;
  const durationSeconds = durationMs / 1000;
  console.log(
    `${testName}: ${durationSeconds} seconds for ${numIters} iterations`
  );
}

function startBenchmarking() {
  console.log('Starting benchmarks...');
  benchSigs();
  benchVerification();
  benchBatchVerification();
  benchFastAggregateVerification();
  console.log('Benchmarks completed.');
}

type BenchmarksProps = NativeStackScreenProps<RootStackParamList, 'Benchmarks'>;

export const Benchmarks: React.FC<BenchmarksProps> = () => {
  return (
    <View style={styles.container}>
      <Text> Testing performance - You can see results in logs! </Text>
      <Button title="Benchmark" onPress={startBenchmarking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
