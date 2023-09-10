import * as React from 'react';

import { Button, StyleSheet, View } from 'react-native';
import {
  testReadme,
  testSchemes,
  testVectorsInvalid,
  testVectorsValid,
} from './tests/index.test';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Run"
        onPress={() => {
          testVectorsInvalid();
          testVectorsValid();
          testSchemes();
          testReadme();
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
