import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/colors';

export type AuthStackParamList = {
  Login: undefined;
  TipoCadastro: undefined;
  CadastroUser: undefined;
  CadastroONG: undefined;
};

type TipoCadastroNavProp = NativeStackNavigationProp<AuthStackParamList, 'TipoCadastro'>;

export default function TipoCadastroScreen() {
  const navigation = useNavigation<TipoCadastroNavProp>();
  const insets = useSafeAreaInsets();

  const handleSelectOption = (screenName: keyof AuthStackParamList) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screenName);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Como você deseja participar?</Text>
          <Text style={styles.subtitle}>
            Escolha o perfil que melhor descreve você para personalizarmos sua experiência no PetRadar.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.cardUser]}
            onPress={() => handleSelectOption('CadastroUser')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar como Usuário ou Tutor"
          >
            <Text style={styles.cardTitle}>Usuário / Tutor</Text>
            <Text style={styles.cardDescription}>
              Quero relatar avistamentos, buscar pets perdidos ou adotar um animal.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardONG]}
            onPress={() => handleSelectOption('CadastroONG')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar como Organização Não Governamental"
          >
            <Text style={styles.cardTitle}>Sou uma ONG / Instituição</Text>
            <Text style={styles.cardDescription}>
              Represento um abrigo ou ONG e quero gerenciar resgates e feiras de adoção.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.goBack();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Já tem uma conta? Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.globalMargin,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textTitle,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textBody,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    padding: 20,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.inputBg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },
  cardUser: {
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.brand,
  },
  cardONG: {
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.action,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textTitle,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textBody,
    lineHeight: 20,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  backButtonText: {
    color: theme.colors.brand,
    fontSize: 15,
    fontWeight: '600',
  },
});