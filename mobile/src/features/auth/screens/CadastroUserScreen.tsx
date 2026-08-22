import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../app/navigation/types/authNavigation.types';
import { UserAccessStep } from '../components/cadastro-user/UserAccessStep';
import { UserPersonalDataStep } from '../components/cadastro-user/UserPersonalDataStep';
import { AuthHeader } from '../components/common/AuthHeader';
import { AuthStepHeader } from '../components/common/AuthStepHeader';
import { useCadastroUser } from '../hooks/useCadastroUser';
import { cadastroUserStyles as styles } from '../styles/cadastroUser.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CadastroUser'>;

export default function CadastroUsuarioScreen({ navigation }: Props) {
  const cadastro = useCadastroUser(() => navigation.navigate('Login'));

  const handleBack = () => {
    if (cadastro.etapa > 1) {
      cadastro.voltarEtapa();
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
            currentStep={cadastro.etapa}
            totalSteps={2}
            prefix="Etapa"
            onBack={handleBack}
          />

          <AuthHeader
            title="Criar Conta"
            subtitle="Cadastre-se para adotar ou reportar resgates."
          />

          <View style={styles.card}>
            {cadastro.etapa === 1 ? (
              <UserPersonalDataStep
                nome={cadastro.nome}
                cpf={cadastro.cpf}
                telefone={cadastro.telefone}
                temPet={cadastro.temPet}
                onNomeChange={cadastro.setNome}
                onCpfChange={cadastro.setCpf}
                onTelefoneChange={cadastro.setTelefone}
                onTemPetChange={cadastro.setTemPet}
                onNext={cadastro.avançarEtapa1}
              />
            ) : (
              <UserAccessStep
                email={cadastro.email}
                senha={cadastro.senha}
                confirmaSenha={cadastro.confirmaSenha}
                showPassword={cadastro.showPassword}
                loading={cadastro.loading}
                onEmailChange={cadastro.setEmail}
                onSenhaChange={cadastro.setSenha}
                onConfirmaSenhaChange={cadastro.setConfirmaSenha}
                onTogglePassword={cadastro.togglePassword}
                onSubmit={cadastro.handleCadastro}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
