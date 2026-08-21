import { StyleSheet } from "react-native";
import { theme } from "../../../../theme/colors";

import { occurrenceFormSharedStyles } from "./occurrenceFormControls.styles";
export const cadastroOcorrenciaScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  flex: {
    flex: 1,
  },

  editLoadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  editLoadingTitle: {
    marginTop: 16,
    color: theme.colors.textTitle,
    fontSize: 17,
    fontWeight: "800",
  },

  editLoadingText: {
    marginTop: 6,
    color: theme.colors.textBody,
    fontSize: 13,
    textAlign: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  topBar: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  topBarTitle: {
    flex: 1,
    alignItems: "center",
  },

  topBarSpacer: {
    width: 42,
  },

  eyebrow: {
    color: theme.colors.brand,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 2,
  },

  screenTitle: {
    color: theme.colors.textTitle,
    fontSize: 17,
    fontWeight: "800",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    ...theme.shadows.elevation1,
  },

  hero: {
    backgroundColor: theme.colors.brand,
    borderRadius: 24,
    padding: 22,
    marginBottom: 14,
    overflow: "hidden",
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  heroTitle: {
    color: theme.colors.surface,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  heroDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.brandAlpha.medium,
    marginBottom: 24,
    overflow: "hidden",
  },

  progressFill: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: theme.colors.action,
  },

  ...occurrenceFormSharedStyles,

  sectionDivider: {
    height: 1,
    backgroundColor: theme.colors.brandAlpha.soft,
    marginVertical: 20,
  },

  urgencyList: {
    gap: 8,
  },

  urgencyItem: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  urgencyItemActive: {
    backgroundColor: theme.colors.surface,
  },

  urgencyDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: theme.colors.semantic.success.text,
  },

  urgencyDotDanger: {
    backgroundColor: theme.colors.semantic.danger.text,
  },

  urgencyDotWarning: {
    backgroundColor: theme.colors.semantic.warning.text,
  },

  urgencyDotSuccess: {
    backgroundColor: theme.colors.semantic.success.text,
  },

  urgencyText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 14,
    fontWeight: "700",
  },

  urgencyTextActive: {
    color: theme.colors.textTitle,
  },

  dateChoiceRow: {
    gap: 10,
  },

  dateChoiceCard: {
    minHeight: 70,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  dateChoiceCardActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.07)",
  },

  dateChoiceContent: {
    flex: 1,
  },

  dateChoiceTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  dateChoiceTitleActive: {
    color: theme.colors.brand,
  },

  dateChoiceSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 3,
  },

  dateModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  dateModalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 20,
    ...theme.shadows.elevation1,
  },

  dateModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  dateModalTitle: {
    color: theme.colors.textTitle,
    fontSize: 19,
    fontWeight: "800",
  },

  dateModalSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 4,
  },

  dateModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },

  dateModalLabel: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  dateModalInputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  dateModalConfirm: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: theme.colors.brand,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  dateModalConfirmText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },

  infoNote: {
    marginTop: 13,
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 13,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  infoNoteText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 16,
  },

  textAreaContainer: {
    minHeight: 125,
    alignItems: "flex-start",
    paddingVertical: 4,
  },

  textArea: {
    minHeight: 115,
  },

  characterCount: {
    color: theme.colors.textBody,
    fontSize: 10,
    textAlign: "right",
    marginTop: -5,
  },

  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    paddingHorizontal: 4,
    marginBottom: 16,
  },

  footerNoteText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 17,
  },

  submitButton: {
    minHeight: 66,
    borderRadius: 22,
    backgroundColor: theme.colors.brand,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    ...theme.shadows.buttonGlow,
  },

  submitButtonPressed: {
    transform: [{ scale: 0.985 }],
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  submitContent: {
    flex: 1,
  },

  submitTitle: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },

  submitSubtitle: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 11,
    marginTop: 2,
  },

  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    marginTop: 8,
  },

  cancelButtonText: {
    color: theme.colors.textBody,
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },
});

