import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../../../theme';
import { cadastroONGStyles as styles } from '../../styles/cadastroONG.styles';
import { AuthInput } from '../common/AuthInput';
import { AuthSubmitButton } from '../common/AuthSubmitButton';

interface OngCapacityStepProps {
  ofereceLarTemporario: boolean;
  vagasEmergenciais: boolean;
  capacidadeTotal: string;
  lotacaoAtual: string;
  linkPrestacao: string;
  onOfereceLarTemporarioChange: (value: boolean) => void;
  onVagasEmergenciaisChange: (value: boolean) => void;
  onCapacidadeTotalChange: (value: string) => void;
  onLotacaoAtualChange: (value: string) => void;
  onLinkPrestacaoChange: (value: string) => void;
  onNext: () => void;
}

export function OngCapacityStep({
  ofereceLarTemporario,
  vagasEmergenciais,
  capacidadeTotal,
  lotacaoAtual,
  linkPrestacao,
  onOfereceLarTemporarioChange,
  onVagasEmergenciaisChange,
  onCapacidadeTotalChange,
  onLotacaoAtualChange,
  onLinkPrestacaoChange,
  onNext,
}: OngCapacityStepProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>2. Capacidade e Operação</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Oferece Lar Temporário?</Text>
        <Switch
          value={ofereceLarTemporario}
          onValueChange={onOfereceLarTemporarioChange}
          trackColor={{
            false: theme.colors.disabled,
            true: theme.colors.accent,
          }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Possui vagas para lar emergencial?</Text>
        <Switch
          value={vagasEmergenciais}
          onValueChange={onVagasEmergenciaisChange}
          trackColor={{
            false: theme.colors.disabled,
            true: theme.colors.accent,
          }}
        />
      </View>

      <AuthInput
        label="Capacidade Total de Animais"
        placeholder="Ex: 50"
        keyboardType="numeric"
        value={capacidadeTotal}
        onChangeText={onCapacidadeTotalChange}
      />

      <AuthInput
        label="Lotação Atual"
        placeholder="Ex: 35"
        keyboardType="numeric"
        value={lotacaoAtual}
        onChangeText={onLotacaoAtualChange}
      />

      <AuthInput
        label="Link de Prestação de Contas (Opcional)"
        icon={
          <Ionicons name="link-outline" size={20} color={theme.colors.brand} />
        }
        placeholder="https://..."
        autoCapitalize="none"
        value={linkPrestacao}
        onChangeText={onLinkPrestacaoChange}
      />

      <AuthSubmitButton
        text="Próximo: Gestor e Acesso"
        onPress={onNext}
        icon={
          <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
        }
      />
    </>
  );
}
