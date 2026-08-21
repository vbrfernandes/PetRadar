import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { authCommonStyles } from '../../styles/authCommon.styles';
import { AuthBackButton } from './AuthBackButton';

interface AuthStepHeaderProps {
  currentStep: number;
  totalSteps: number;
  prefix: 'Etapa' | 'Passo';
  onBack: () => void;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<TextStyle>;
}

export function AuthStepHeader({
  currentStep,
  totalSteps,
  prefix,
  onBack,
  style,
  indicatorStyle,
}: AuthStepHeaderProps) {
  return (
    <View style={[authCommonStyles.stepHeader, style]}>
      <AuthBackButton onPress={onBack} />
      <Text style={[authCommonStyles.stepIndicator, indicatorStyle]}>
        {prefix} {currentStep} de {totalSteps}
      </Text>
    </View>
  );
}
