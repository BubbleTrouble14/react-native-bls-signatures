import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface CheckboxProps {
  value: boolean;
  onValueChange: () => void;
}

const Checkbox = ({ value, onValueChange }: CheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onValueChange}
      style={[
        styles.checkbox,
        {
          borderRadius: Platform.OS === 'android' ? 4 : 16,
          width: Platform.OS === 'android' ? 24 : 32,
          height: Platform.OS === 'android' ? 24 : 32,
          backgroundColor:
            Platform.OS === 'android' && value ? '#009988' : 'transparent',
          borderColor: value
            ? Platform.OS === 'android'
              ? '#009a33'
              : '#3B96FF'
            : '#afafaf',
        },
      ]}
    >
      {value && (
        <Text
          style={[
            styles.checkmark,
            {
              top: Platform.OS === 'android' ? -2 : 0,
              color: Platform.OS === 'android' ? '#fff' : '#3B96FF',
            },
          ]}
        >
          ✓
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default Checkbox;
