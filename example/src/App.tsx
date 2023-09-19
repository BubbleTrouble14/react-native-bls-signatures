import * as React from 'react';

import { Button, StyleSheet, View } from 'react-native';
import { testLib } from './testing/MochaSetup';
import { TEST_LIST } from './testing/TestList';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Test"
        onPress={() => {
          const registrators = TEST_LIST.map(
            (testItem) => testItem.registrator
          );

          testLib(() => {}, registrators);
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
