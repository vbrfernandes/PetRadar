import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { authCommonStyles } from '../../styles/authCommon.styles';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  logo?: ReactNode;
  style?: StyleProp<ViewStyle>;
  logoBadgeStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export function AuthHeader({
  title,
  subtitle,
  icon,
  logo,
  style,
  logoBadgeStyle,
  titleStyle,
  subtitleStyle,
}: AuthHeaderProps) {
  return (
    <View style={[authCommonStyles.header, style]}>
      {logo}
      {!logo && icon ? (
        <View style={[authCommonStyles.logoBadge, logoBadgeStyle]}>{icon}</View>
      ) : null}
      {title ? (
        <Text style={[authCommonStyles.brandTitle, titleStyle]}>{title}</Text>
      ) : null}
      {subtitle ? (
        <Text style={[authCommonStyles.brandTagline, subtitleStyle]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
