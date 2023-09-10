import * as React from 'react';

import { Button, StyleSheet, View } from 'react-native';
import {
  testReadme,
  testSchemes,
  testVectorsInvalid,
  testVectorsValid,
} from './tests/index.test';

import {
  AugSchemeMPL,
  G2Element,
  getRandomSeed,
} from 'react-native-bls-signatures';

function startStopwatch(): number {
  // @ts-expect-error performance actually exists.
  return performance.now();
}

function endStopwatch(testName: string, start: number, numIters: number): void {
  // @ts-expect-error performance actually exists.
  const end = performance.now();
  const duration = (end - start) / 1000; // in seconds
  console.log(
    `${testName} took ${duration} seconds for ${numIters} iterations`
  );
}

function benchVerification(): void {
  const testName = 'Verification';
  const numIters = 10000;
  const sk = AugSchemeMPL.keyGen(getRandomSeed());
  const pk = sk.getG1();
  const sigs: G2Element[] = [];

  for (let i = 0; i < numIters; i++) {
    const message = new Uint8Array(4);
    const messageBytes = new Uint8Array([...message]);
    const sig = AugSchemeMPL.sign(sk, messageBytes);
    sigs.push(sig);
  }

  const start = startStopwatch();
  for (let i = 0; i < numIters; i++) {
    const message = new Uint8Array(4);
    const messageBytes = new Uint8Array([...message]);
    const ok = AugSchemeMPL.verify(pk, messageBytes, sigs[i]);
    if (!ok) {
      throw new Error('Verification failed');
    }
  }
  endStopwatch(testName, start, numIters);
}

function benchSigs(): void {
  const testName = 'Signing';
  const numIters = 5000;
  const sk = AugSchemeMPL.keyGen(getRandomSeed());
  const message1 = sk.getG1();

  const start = startStopwatch();

  for (let i = 0; i < numIters; i++) {
    AugSchemeMPL.sign(sk, message1.toBytes());
  }

  endStopwatch(testName, start, numIters);
}

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Run"
        onPress={() => {
          // benchSigs();
          benchVerification();
          // testVectorsInvalid();
          // testVectorsValid();
          // testSchemes();
          // testReadme();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
