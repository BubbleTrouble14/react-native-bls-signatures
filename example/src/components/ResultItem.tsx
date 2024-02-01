import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ResultItemProps = {
  description: string;
  errorMsg?: string | null;
};

const ResultItem: React.FC<ResultItemProps> = ({
  description,
  errorMsg = null,
}: ResultItemProps) => {
  // const emoji = '✅';
  // const fullText = emoji + ' [' + description + ']';

  return (
    <View style={styles.itemContainer}>
      <Text>{errorMsg ? '❌' : '✅'}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {description}
          {/* {description.substring(1, description.length)} */}
        </Text>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    gap: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#bdbdbd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 12,
    // backgroundColor: 'blue',
  },
  error: {
    color: '#ff1f1f',
    flex: 1,
    fontSize: 12,
  },
});

export default ResultItem;
