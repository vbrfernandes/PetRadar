import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme';
import { cadastroUserStyles as styles } from '../../styles/cadastroUser.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface UserPersonalDataStepProps {
  nome: string;
  cpf: string;
  telefone: string;
  temPet: boolean;
  onNomeChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onTemPetChange: (value: boolean) => void;
  onNext: () => void;
}

export function UserPersonalDataStep({
  nome,
  cpf,
  telefone,
  temPet,
  onNomeChange,
  onCpfChange,
  onTelefoneChange,
  onTemPetChange,
  onNext,
}: UserPersonalDataStepProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>1. Dados Pessoais</Text>

      <AuthInput
        label="Nome Completo *"
        icon={
          <Ionicons name="person-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="Seu nome"
        value={nome}
        onChangeText={onNomeChange}
      />

      <AuthInput
        label="CPF *"
        placeholder="000.000.000-00"
        keyboardType="numeric"
        value={cpf}
        onChangeText={onCpfChange}
      />

      <AuthInput
        label="Telefone *"
        icon={
          <Ionicons name="call-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={onTelefoneChange}
      />

      <View style={styles.switchRow}>
        <View style={styles.switchTextContent}>
          <Text style={styles.switchLabel}>Possui cachorro / pet?</Text>
          <Text style={styles.switchSublabel}>
            Ajuda a personalizar os alertas de resgate e animais perdidos.
          </Text>
        </View>
        <Switch
          value={temPet}
          onValueChange={onTemPetChange}
          trackColor={{
            false: theme.colors.disabled,
            true: theme.colors.accent,
          }}
        />
      </View>

      <AuthSubmitButton
        text="Próximo: Dados de Acesso"
        onPress={onNext}
        icon={
          <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
        }
      />
    </>
  );
}
