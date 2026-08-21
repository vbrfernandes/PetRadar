import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../theme/colors';

import {
  tipoCadastroStyles as styles,
} from '../styles/auth.styles';

export default function TipoCadastroScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Botão de Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.brand} />
        </TouchableOpacity>

        {/* Header / Brand */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="paw" size={40} color={theme.colors.brand} />
          </View>
          <Text style={styles.brandTitle}>Junte-se a nós</Text>
          <Text style={styles.brandTagline}>Como você deseja utilizar o aplicativo?</Text>
        </View>

        {/* Opções de Cadastro */}
        <View style={styles.cardsContainer}>
          {/* Card Pessoa Física */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CadastroUser')}
          >
            <View style={[styles.iconContainer, styles.iconContainerPrimary]}>
              <MaterialCommunityIcons name="account-heart" size={32} color={theme.colors.brand} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Pessoa Física</Text>
              <Text style={styles.cardDescription}>
                Quero ajudar ou cadastrar animais perdidos.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.brand} />
          </TouchableOpacity>

          {/* Card ONG */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CadastroONG')}
          >
            <View
              style={[
                styles.iconContainer,
                styles.iconContainerAccent,
              ]}
            >
              <MaterialCommunityIcons name="domain" size={32} color={theme.colors.accent} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>ONG ou Instituição</Text>
              <Text style={styles.cardDescription}>
                Represento uma organização e quero gerenciar um perfil.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.brand} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}