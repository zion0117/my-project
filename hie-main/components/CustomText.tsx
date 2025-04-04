// components/CustomText.tsx
import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

export const CustomText = (props: TextProps) => (
  <RNText {...props} style={[styles.text, props.style]} />
);

const styles = StyleSheet.create({
  text: {
    fontFamily: 'GmarketSansMedium',
  },
});
