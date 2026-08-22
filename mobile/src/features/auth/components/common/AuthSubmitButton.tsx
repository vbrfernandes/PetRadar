import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '../../../../theme';
import { authCommonStyles } from '../../styles/authCommon.styles';

interface AuthSubmitButtonProps
  extends Omit<TouchableOpacityProps, 'children' | 'disabled' | 'style'> {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function AuthSubmitButton({
  text,
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  contentStyle,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      style={[authCommonStyles.submitButton, style]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.surface} />
      ) : icon ? (
        <View style={[authCommonStyles.buttonContent, contentStyle]}>
          <Text style={[authCommonStyles.submitButtonText, textStyle]}>
            {text}
          </Text>
          {icon}
        </View>
      ) : (
        <Text style={[authCommonStyles.submitButtonText, textStyle]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
