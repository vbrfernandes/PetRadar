import { StyleSheet } from 'react-native';

import { theme } from '../../../theme/colors';

export const cadastroONGStyles = StyleSheet.create({
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

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.brand,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.brand,
  },

  brandTagline: {
    fontSize: 13,
    color: theme.colors.textBody,
    marginTop: 4,
    textAlign: 'center',
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.card,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.brand,
    marginBottom: 16,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textTitle,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textTitle,
    fontWeight: '500',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 14,
  },

  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textTitle,
    flex: 1,
  },

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.brandSoft,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },

  uploadText: {
    color: theme.colors.brand,
    fontWeight: '600',
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: theme.colors.brand,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  submitButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});

export const cadastroUserStyles = StyleSheet.create({
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

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.brand,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.brand,
  },

  brandTagline: {
    fontSize: 13,
    color: theme.colors.textBody,
    marginTop: 4,
    textAlign: 'center',
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.card,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.brand,
    marginBottom: 16,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textTitle,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textTitle,
    fontWeight: '500',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 14,
  },

  switchTextContent: {
    flex: 1,
    paddingRight: 10,
  },

  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textTitle,
  },

  switchSublabel: {
    fontSize: 11,
    color: theme.colors.textBody,
    marginTop: 2,
  },

  submitButton: {
    backgroundColor: theme.colors.brand,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  submitButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});

export const esqueceuSenhaStyles = StyleSheet.create({
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

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.brand,
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.brand,
  },

  brandTagline: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.card,
  },

  inputWrapper: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textTitle,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textTitle,
    fontWeight: '500',
  },

  submitButton: {
    backgroundColor: theme.colors.brand,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  submitButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});

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

  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: '600',
    color: theme.colors.textTitle,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textTitle,
    fontWeight: '500',
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
    backgroundColor: theme.colors.brand,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.brand,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  loginButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
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

export const tipoCadastroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: theme.colors.brand,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.brand,
    letterSpacing: -0.5,
  },

  brandTagline: {
    fontSize: 14,
    color: theme.colors.textBody,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },

  cardsContainer: {
    gap: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.card,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  iconContainerPrimary: {
    backgroundColor: theme.colors.brandSoft,
  },

  iconContainerAccent: {
    backgroundColor: theme.colors.accentSoft,
  },

  cardTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textTitle,
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 13,
    color: theme.colors.textBody,
    lineHeight: 18,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },

  footerText: {
    color: theme.colors.textBody,
    fontSize: 14,
  },

  loginText: {
    color: theme.colors.brand,
    fontSize: 14,
    fontWeight: '700',
  },
});