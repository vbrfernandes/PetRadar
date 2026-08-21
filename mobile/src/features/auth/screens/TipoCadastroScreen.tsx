import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../navigation/navigation.types';
import { theme } from '../../../theme/colors';
import { AuthBackButton } from '../components/common/AuthBackButton';
import { AuthHeader } from '../components/common/AuthHeader';
import { tipoCadastroStyles as styles } from '../styles/tipoCadastro.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'TipoCadastro'>;

export default function TipoCadastroScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AuthBackButton
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        />

        <AuthHeader
          icon={
            <MaterialCommunityIcons
              name="paw"
              size={40}
              color={theme.colors.brand}
            />
          }
          title="Junte-se a nós"
          subtitle="Como você deseja utilizar o aplicativo?"
          style={styles.header}
          logoBadgeStyle={styles.logoBadge}
          titleStyle={styles.brandTitle}
          subtitleStyle={styles.brandTagline}
        />

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CadastroUser')}
          >
            <View style={[styles.iconContainer, styles.iconContainerPrimary]}>
              <MaterialCommunityIcons
                name="account-heart"
                size={32}
                color={theme.colors.brand}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Pessoa Física</Text>
              <Text style={styles.cardDescription}>
                Quero ajudar ou cadastrar animais perdidos.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={theme.colors.brand}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CadastroONG')}
          >
            <View style={[styles.iconContainer, styles.iconContainerAccent]}>
              <MaterialCommunityIcons
                name="domain"
                size={32}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>ONG ou Instituição</Text>
              <Text style={styles.cardDescription}>
                Represento uma organização e quero gerenciar um perfil.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={theme.colors.brand}
            />
          </TouchableOpacity>
        </View>

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
