import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme/colors';
import { authCommonStyles } from '../../styles/authCommon.styles';

interface AuthBackButtonProps
  extends Omit<TouchableOpacityProps, 'children' | 'style'> {
  style?: StyleProp<ViewStyle>;
}

export function AuthBackButton({ style, ...props }: AuthBackButtonProps) {
  return (
    <TouchableOpacity
      style={[authCommonStyles.backButton, style]}
      {...props}
    >
      <Ionicons name="arrow-back" size={24} color={theme.colors.brand} />
    </TouchableOpacity>
  );
}
