import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { TestResult } from '../types/TestResults';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigators/RootProps';
import Checkbox from './Checkbox';

type TestItemProps = {
  description: string;
  value: boolean;
  count: number;
  results: TestResult[];
  onToggle: (description: string) => void;
};

export const TestItem: React.FC<TestItemProps> = ({
  description,
  value,
  count,
  results,
  onToggle,
}: TestItemProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Entry'>>();

  // get pass/fail stats from results
  let pass = 0;
  let fail = 0;
  results.map((r) => {
    if (r.type === 'correct') pass++;
    if (r.type === 'incorrect') fail++;
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('TestingScreen', {
          results,
          suiteName: description,
        });
      }}
    >
      <Checkbox
        value={value}
        onValueChange={() => {
          console.log('onValueChange', description);
          onToggle(description);
        }}
      />
      <View
        style={styles.touchable}
        // onPress={() => {
        //   navigation.navigate('TestingScreen', {
        //     results,
        //     suiteName: description,
        //   });
        // }}
      >
        <Text style={styles.label} numberOfLines={1}>
          {description}
        </Text>
        <Text style={[styles.pass, styles.count]} numberOfLines={1}>
          {pass || ''}
        </Text>
        <Text style={[styles.fail, styles.count]} numberOfLines={1}>
          {fail || ''}
        </Text>
        <Text style={styles.count} numberOfLines={1}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 12,
    flex: 8,
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
  },
  pass: {
    color: 'green',
  },
  fail: {
    color: 'red',
  },
  count: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
});
