import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme';
import { AuthInput, AuthInputProps } from './AuthInput';

interface AuthPasswordInputProps
  extends Omit<AuthInputProps, 'rightAccessory' | 'secureTextEntry'> {
  isPasswordVisible: boolean;
  onToggleVisibility?: () => void;
  toggleStyle?: StyleProp<ViewStyle>;
}

export function AuthPasswordInput({
  isPasswordVisible,
  onToggleVisibility,
  toggleStyle,
  ...inputProps
}: AuthPasswordInputProps) {
  const rightAccessory = onToggleVisibility ? (
    <TouchableOpacity onPress={onToggleVisibility} style={toggleStyle}>
      <Ionicons
        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
        size={20}
        color={theme.colors.textBody}
      />
    </TouchableOpacity>
  ) : undefined;

  return (
    <AuthInput
      {...inputProps}
      secureTextEntry={!isPasswordVisible}
      rightAccessory={rightAccessory}
    />
  );
}
