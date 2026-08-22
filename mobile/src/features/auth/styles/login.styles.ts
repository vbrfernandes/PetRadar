import { StyleSheet } from 'react-native';

import { theme } from '../../../theme';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoImage: {
    width: 220,
    height: 180,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.card,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    fontSize: 16,
  },
  eyeIcon: {
    padding: 6,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.colors.brand,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    height: 56,
    marginTop: 0,
    shadowColor: theme.colors.brand,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: theme.colors.textBody,
    fontSize: 15,
  },
  registerText: {
    color: theme.colors.brand,
    fontSize: 15,
    fontWeight: '700',
  },
});
