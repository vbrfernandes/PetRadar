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
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textTitle,
    flex: 1,
  },
  uploadWrapper: {
    marginBottom: 14,
  },
  uploadLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textTitle,
    marginBottom: 6,
    textTransform: 'uppercase',
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
});
