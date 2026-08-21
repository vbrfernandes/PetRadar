import React, { ReactNode } from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '../../../../theme/colors';
import { authCommonStyles } from '../../styles/authCommon.styles';

export interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: ReactNode;
  rightAccessory?: ReactNode;
  wrapperStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
}

export function AuthInput({
  label,
  icon,
  rightAccessory,
  wrapperStyle,
  labelStyle,
  containerStyle,
  iconContainerStyle,
  style,
  placeholderTextColor = theme.colors.placeholder,
  ...textInputProps
}: AuthInputProps) {
  return (
    <View style={[authCommonStyles.inputWrapper, wrapperStyle]}>
      <Text style={[authCommonStyles.label, labelStyle]}>{label}</Text>
      <View style={[authCommonStyles.inputContainer, containerStyle]}>
        {icon ? (
          <View style={[authCommonStyles.inputIcon, iconContainerStyle]}>
            {icon}
          </View>
        ) : null}
        <TextInput
          {...textInputProps}
          style={[authCommonStyles.input, style]}
          placeholderTextColor={placeholderTextColor}
        />
        {rightAccessory}
      </View>
    </View>
  );
}
