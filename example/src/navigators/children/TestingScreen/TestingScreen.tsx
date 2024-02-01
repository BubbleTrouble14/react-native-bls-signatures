import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Checkbox from '../../../components/Checkbox';
import { Suite } from '../../../components/Suite';
import type { RootStackParamList } from '../../RootProps';
import { Indentator } from '../../../components/Indentator';
import { FlashList } from '@shopify/flash-list';
import ResultItem from '../../../components/ResultItem';

type TestingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TestingScreen'
>;

export const TestingScreen: React.FC<TestingScreenProps> = ({
  route,
}: TestingScreenProps) => {
  const navigation = useNavigation();
  const { results, suiteName } = route.params;
  const [showFailed, setShowFailed] = useState<boolean>(true);
  const [showPassed, setShowPassed] = useState<boolean>(true);

  React.useLayoutEffect(() => {
    const dynamicTitle = suiteName || 'Default Title';
    navigation.setOptions({
      title: dynamicTitle,
    });
  }, [navigation, suiteName]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.showMenu}>
        <TouchableOpacity
          style={styles.showMenuItem}
          onPress={() => {
            setShowFailed(!showFailed);
          }}
        >
          <Checkbox
            value={showFailed}
            onValueChange={() => setShowFailed(!showFailed)}
          />
          <Text style={styles.showMenuLabel}>Show Failed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.showMenuItem}
          onPress={() => {
            setShowPassed(!showPassed);
          }}
        >
          <Checkbox
            value={showPassed}
            onValueChange={() => setShowPassed(!showPassed)}
          />
          <Text style={styles.showMenuLabel}>Show Passed</Text>
        </TouchableOpacity>
      </View>
      {/* <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {results.map((it, index) => {
          let InnerElement = <View key={index + it.type} />;
          if (showPassed && it.type === 'correct') {
            InnerElement = (
              <ResultItem
                key={`${index}-correct`}
                description={it.description}
              />
            );
          }
          if (showFailed && it.type === 'incorrect') {
            const errorMsg = it.errorMsg || ''; // Trick TS - How to do it as it should be? :)
            InnerElement = (
              <ResultItem
                key={`${index}-correct`}
                description={it.description}
                errorMsg={errorMsg}
              />
            );
          }
          if (it.type === 'grouping') {
            InnerElement = <Suite description={it.description} />;
          }
          return (
            <Indentator
              key={it.suiteName + index}
              indentation={it.indentation - 1}
            >
              {InnerElement}
            </Indentator>
          );
        })}
      </ScrollView> */}
      <FlashList
        data={results}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        renderItem={({ item }) => {
          let InnerElement = <View />;
          if (item.type === 'grouping') {
            InnerElement = <Suite description={item.description} />;
          } else {
            InnerElement = (
              <ResultItem
                description={item.description}
                errorMsg={item.errorMsg}
              />
            );
          }
          return (
            <Indentator indentation={item.indentation - 1}>
              {InnerElement}
            </Indentator>
          );
        }}
        getItemType={(item) => {
          return item.type === 'grouping' ? 'sectionHeader' : 'row';
        }}
        estimatedItemSize={100}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom: 30,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 5,
  },
  showMenu: {
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingBottom: 5,
  },
  showMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showMenuLabel: {
    paddingLeft: 5,
  },
  scroll: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
});
