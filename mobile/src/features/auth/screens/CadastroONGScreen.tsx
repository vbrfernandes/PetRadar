import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../app/navigation/types/authNavigation.types';
import { theme } from '../../../theme';
import { OngCapacityStep } from '../components/cadastro-ong/OngCapacityStep';
import { OngInstitutionalStep } from '../components/cadastro-ong/OngInstitutionalStep';
import { OngManagerAccessStep } from '../components/cadastro-ong/OngManagerAccessStep';
import { AuthHeader } from '../components/common/AuthHeader';
import { AuthStepHeader } from '../components/common/AuthStepHeader';
import { useCadastroOng } from '../hooks/useCadastroOng';
import { cadastroONGStyles as styles } from '../styles/cadastroONG.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CadastroONG'>;

export default function CadastroONGScreen({ navigation }: Props) {
  const cadastro = useCadastroOng(() => navigation.navigate('Login'));

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
            totalSteps={3}
            prefix="Etapa"
            onBack={handleBack}
          />

          <AuthHeader
            icon={
              <MaterialCommunityIcons
                name="domain"
                size={40}
                color={theme.colors.brand}
              />
            }
            title="Cadastro de ONG"
            subtitle="Gerencie resgates e prestação de contas no PetRadar."
          />

          <View style={styles.card}>
            {cadastro.etapa === 1 ? (
              <OngInstitutionalStep
                cnpj={cadastro.cnpj}
                razaoSocial={cadastro.razaoSocial}
                nomeFantasia={cadastro.nomeFantasia}
                endereco={cadastro.endereco}
                onCnpjChange={cadastro.setCnpj}
                onRazaoSocialChange={cadastro.setRazaoSocial}
                onNomeFantasiaChange={cadastro.setNomeFantasia}
                onEnderecoChange={cadastro.setEndereco}
                onNext={cadastro.avançarEtapa1}
              />
            ) : null}

            {cadastro.etapa === 2 ? (
              <OngCapacityStep
                ofereceLarTemporario={cadastro.ofereceLarTemporario}
                vagasEmergenciais={cadastro.vagasEmergenciais}
                capacidadeTotal={cadastro.capacidadeTotal}
                lotacaoAtual={cadastro.lotacaoAtual}
                linkPrestacao={cadastro.linkPrestacao}
                onOfereceLarTemporarioChange={
                  cadastro.setOfereceLarTemporario
                }
                onVagasEmergenciaisChange={cadastro.setVagasEmergenciais}
                onCapacidadeTotalChange={cadastro.setCapacidadeTotal}
                onLotacaoAtualChange={cadastro.setLotacaoAtual}
                onLinkPrestacaoChange={cadastro.setLinkPrestacao}
                onNext={cadastro.avançarEtapa2}
              />
            ) : null}

            {cadastro.etapa === 3 ? (
              <OngManagerAccessStep
                nomeGestor={cadastro.nomeGestor}
                cpfGestor={cadastro.cpfGestor}
                telefone={cadastro.telefone}
                email={cadastro.email}
                senha={cadastro.senha}
                confirmaSenha={cadastro.confirmaSenha}
                showPassword={cadastro.showPassword}
                comprovanteUri={cadastro.comprovanteUri}
                loading={cadastro.loading}
                onNomeGestorChange={cadastro.setNomeGestor}
                onCpfGestorChange={cadastro.setCpfGestor}
                onTelefoneChange={cadastro.setTelefone}
                onEmailChange={cadastro.setEmail}
                onSenhaChange={cadastro.setSenha}
                onConfirmaSenhaChange={cadastro.setConfirmaSenha}
                onTogglePassword={cadastro.togglePassword}
                onSelectDocument={cadastro.selecionarComprovante}
                onSubmit={cadastro.handleCadastroFinal}
              />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
