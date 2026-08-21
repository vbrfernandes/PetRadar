import { StyleSheet } from "react-native";

import { theme } from "../../../../theme";

export const profileEditStyles = StyleSheet.create({
  editScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  editingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.warning.bg,
  },
  editingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
    backgroundColor: theme.colors.semantic.warning.text,
  },
  editingText: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.semantic.warning.text,
  },
  formCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.subtle,
    ...theme.shadows.elevation1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },
  inputWrapper: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    backgroundColor: theme.colors.surfaceSoft,
  },
  inputWrapperMultiline: {
    alignItems: "flex-start",
    paddingTop: 13,
  },
  multilineIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },
  multilineInput: {
    minHeight: 76,
    paddingTop: 0,
    lineHeight: 20,
  },
  inputSuffix: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.brand,
  },
  helperText: {
    marginTop: 7,
    fontSize: 11,
    lineHeight: 16,
    color: theme.colors.textBody,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
  },
  preferenceIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },
  preferenceContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  preferenceTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },
  preferenceDescription: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    color: theme.colors.textBody,
  },
  switchTrack: {
    width: 52,
    height: 30,
    padding: 2,
    borderRadius: 15,
    justifyContent: "center",
    backgroundColor: theme.colors.disabled,
  },
  switchTrackActive: {
    backgroundColor: theme.colors.brand,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editActions: {
    marginTop: 16,
    gap: 10,
  },
  primaryButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.surface,
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.faint,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textBody,
  },
});
