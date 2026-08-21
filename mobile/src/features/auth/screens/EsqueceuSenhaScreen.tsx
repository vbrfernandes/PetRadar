import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../navigation/navigation.types';
import { AuthHeader } from '../components/common/AuthHeader';
import { AuthStepHeader } from '../components/common/AuthStepHeader';
import { PasswordResetRequestStep } from '../components/password-recovery/PasswordResetRequestStep';
import { PasswordResetStep } from '../components/password-recovery/PasswordResetStep';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';
import { esqueceuSenhaStyles as styles } from '../styles/esqueceuSenha.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'EsqueceuSenha'>;

export default function EsqueceuSenhaScreen({ navigation }: Props) {
  const recovery = usePasswordRecovery(() => navigation.navigate('Login'));

  const handleBack = () => {
    if (recovery.etapa === 2) {
      recovery.voltarEtapa();
      return;
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AuthStepHeader
            currentStep={recovery.etapa}
            totalSteps={2}
            prefix="Passo"
            onBack={handleBack}
            style={styles.stepHeader}
          />

          <AuthHeader
            title="Recuperar Senha"
            subtitle={
              recovery.etapa === 1
                ? 'Informe seu e-mail cadastrado para receber um código de verificação.'
                : 'Digite o código recebido e defina sua nova senha.'
            }
            style={styles.header}
            subtitleStyle={styles.tagline}
          />

          <View style={styles.card}>
            {recovery.etapa === 1 ? (
              <PasswordResetRequestStep
                email={recovery.email}
                loading={recovery.loading}
                onEmailChange={recovery.setEmail}
                onSubmit={recovery.handleSolicitarCodigo}
              />
            ) : (
              <PasswordResetStep
                codigo={recovery.codigo}
                novaSenha={recovery.novaSenha}
                confirmaSenha={recovery.confirmaSenha}
                showPassword={recovery.showPassword}
                loading={recovery.loading}
                onCodigoChange={recovery.setCodigo}
                onNovaSenhaChange={recovery.setNovaSenha}
                onConfirmaSenhaChange={recovery.setConfirmaSenha}
                onTogglePassword={recovery.togglePassword}
                onSubmit={recovery.handleRedefinirSenha}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
