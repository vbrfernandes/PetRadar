import { StyleSheet } from 'react-native';

import { theme } from '../../../theme';

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
});
