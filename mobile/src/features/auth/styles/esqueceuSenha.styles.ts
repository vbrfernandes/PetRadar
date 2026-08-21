import { StyleSheet } from 'react-native';

import { theme } from '../../../theme';

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
  stepHeader: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  tagline: {
    fontSize: 14,
    marginTop: 6,
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
});
