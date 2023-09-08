import * as React from 'react';

import { Button, StyleSheet, View } from 'react-native';
import { AugSchemeMPL, PrivateKey } from 'react-native-bls-signatures';

// LOG  privateKey:  [55, 112, 145, 240, 231, 40, 70, 59, 194, 218, 125, 84, 108, 83, 185, 246, 184, 29, 244, 161, 204, 26, 181, 191, 41, 197, 144, 139, 113, 81, 163, 45]
// LOG  privateKeyHex:  377091f0e728463bc2da7d546c53b9f6b81df4a1cc1ab5bf29c5908b7151a32d
// LOG  masterPublicKey:  [134, 36, 50, 144, 187, 203, 253, 154, 231, 91, 222, 206, 121, 129, 150, 83, 80, 32, 142, 181, 233, 155, 4, 213, 205, 36, 233, 85, 173, 169, 97, 248, 192, 161, 98, 222, 231, 64, 190, 123, 220, 108, 60, 6, 19, 186, 46, 177]
// LOG  masterPublicKeyHex:  86243290bbcbfd9ae75bdece7981965350208eb5e99b04d5cd24e955ada961f8c0a162dee740be7bdc6c3c0613ba2eb1

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Run"
        onPress={() => {
          const seed = Uint8Array.from([
            0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220,
            18, 102, 58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
          ]);
          const privateKey = AugSchemeMPL.keyGen(seed);
          console.log(privateKey.toBytes());
          console.log(privateKey.toHex());
          const test = AugSchemeMPL.aggregate([privateKey.getG2()]);
          console.log(test.toBytes());
          const msg3 = Uint8Array.from([1, 2, 3]);
          const msg4 = Uint8Array.from([1, 2, 3, 4]);
          const msg5 = Uint8Array.from([1, 2]);
          const test1 = AugSchemeMPL.aggregateVerify(
            [privateKey.getG1()],
            [msg3, msg4, msg5],
            privateKey.getG2()
          );
          console.log(test1);
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
