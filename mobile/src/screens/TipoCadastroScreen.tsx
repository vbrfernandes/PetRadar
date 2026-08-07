import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Paleta de Cores Premium (Verde)
const COLORS = {
  primary: '#1F5C4D',       // Verde Principal / Brand
  primaryLight: '#E8F5E9',  // Fundo Suave para Ícones
  accent: '#10B981',        // Verde Vibrante
  accentLight: '#E6F4EA',   // Fundo Suave Secundário
  background: '#F4F7F6',    // Fundo Neutro Elegante
  surface: '#FFFFFF',       // Cards e Inputs
  textTitle: '#1A1A1A',
  textBody: '#666666',
  border: '#E2E8F0',
};

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
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Header / Brand */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="paw" size={40} color={COLORS.primary} />
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
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons name="account-heart" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Pessoa Física</Text>
              <Text style={styles.cardDescription}>
                Quero ajudar ou cadastrar animais perdidos.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Card ONG */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CadastroONG')}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.accentLight }]}>
              <MaterialCommunityIcons name="domain" size={32} color={COLORS.accent} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>ONG ou Instituição</Text>
              <Text style={styles.cardDescription}>
                Represento uma organização e quero gerenciar um perfil.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24 
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  brandTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: COLORS.primary,
    letterSpacing: -0.5 
  },
  brandTagline: { 
    fontSize: 14, 
    color: COLORS.textBody, 
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center'
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 18,
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 28 
  },
  footerText: { 
    color: COLORS.textBody, 
    fontSize: 14 
  },
  loginText: { 
    color: COLORS.primary, 
    fontSize: 14, 
    fontWeight: '700' 
  },
});