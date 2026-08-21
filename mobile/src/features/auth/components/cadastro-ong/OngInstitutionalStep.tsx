import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme/colors';
import { cadastroONGStyles as styles } from '../../styles/cadastroONG.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface OngInstitutionalStepProps {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: string;
  onCnpjChange: (value: string) => void;
  onRazaoSocialChange: (value: string) => void;
  onNomeFantasiaChange: (value: string) => void;
  onEnderecoChange: (value: string) => void;
  onNext: () => void;
}

export function OngInstitutionalStep({
  cnpj,
  razaoSocial,
  nomeFantasia,
  endereco,
  onCnpjChange,
  onRazaoSocialChange,
  onNomeFantasiaChange,
  onEnderecoChange,
  onNext,
}: OngInstitutionalStepProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>1. Dados Institucionais</Text>

      <AuthInput
        label="CNPJ *"
        icon={
          <Ionicons name="business-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="00.000.000/0001-00"
        keyboardType="numeric"
        value={cnpj}
        onChangeText={onCnpjChange}
      />

      <AuthInput
        label="Razão Social *"
        placeholder="Nome Jurídico Completo"
        value={razaoSocial}
        onChangeText={onRazaoSocialChange}
      />

      <AuthInput
        label="Nome Fantasia *"
        placeholder="Nome de divulgação da ONG"
        value={nomeFantasia}
        onChangeText={onNomeFantasiaChange}
      />

      <AuthInput
        label="Endereço Completo *"
        icon={
          <Ionicons name="location-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="Rua, Número, Bairro, Cidade - UF"
        value={endereco}
        onChangeText={onEnderecoChange}
      />

      <AuthSubmitButton
        text="Próximo: Estrutura"
        onPress={onNext}
        icon={
          <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
        }
      />
    </>
  );
}
