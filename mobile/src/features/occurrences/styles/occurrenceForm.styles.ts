import { StyleSheet } from "react-native";
import { theme } from "../../../theme/colors";

export const occurrenceFormSharedStyles = {
  fieldLabel: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 3,
  },

  fieldLabelSpacing: {
    marginTop: 16,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  inputIcon: {
    marginRight: 10,
    marginTop: 1,
  },

  input: {
    flex: 1,
    color: theme.colors.textTitle,
    fontSize: 15,
    lineHeight: 21,
    paddingVertical: 12,
  },

  binaryRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 4,
  },
} as const;

export const occurrenceConditionStyles = {
  conditionalBox: {
    marginTop: 14,
    padding: 13,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.07)",
  },

  conditionalTitle: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },
} as const;

export const animalSectionStyles = StyleSheet.create({
  ...occurrenceFormSharedStyles,

  otherAnimalField: {
    marginTop: 14,
  },

  optionalText: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
  },
});


export const animalTypeSelectorStyles = StyleSheet.create({
  animalGrid: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 4,
  },

  animalCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  animalCardActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.07)",
  },

  animalIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  animalIconActive: {
    backgroundColor: theme.colors.brand,
  },

  animalTitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    fontWeight: "700",
  },

  animalTitleActive: {
    color: theme.colors.brand,
  },

  pressed: {
    opacity: 0.82,
  },
});

export const choiceButtonStyles = StyleSheet.create({
  choiceButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
  },

  choiceButtonActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.07)",
  },

  choiceButtonDanger: {
    borderColor: theme.colors.semantic.danger.text,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  choiceButtonText: {
    color: theme.colors.textBody,
    fontSize: 14,
    fontWeight: "700",
  },

  choiceButtonTextActive: {
    color: theme.colors.brand,
  },

  choiceButtonTextDanger: {
    color: theme.colors.semantic.danger.text,
  },

  pressed: {
    opacity: 0.82,
  },
});

export const disabilitySectionStyles = StyleSheet.create({
  ...occurrenceFormSharedStyles,
  ...occurrenceConditionStyles,
});

export const healthSectionStyles = StyleSheet.create({
  ...occurrenceFormSharedStyles,
  ...occurrenceConditionStyles,
});

export const initialCareSectionStyles = StyleSheet.create({
  careRow: {
    flexDirection: "row",
    gap: 12,
  },

  careButton: {
    flex: 1,
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
  },

  careButtonActive: {
    backgroundColor: "rgba(31, 92, 77, 0.07)",
    borderColor: theme.colors.brand,
  },

  careIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  careIconActive: {
    backgroundColor: theme.colors.brand,
  },

  careButtonText: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  careButtonTextActive: {
    color: theme.colors.brand,
  },

  careCheck: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },

  caregiverCard: {
    marginTop: 13,
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.06)",
  },

  careInfoRow: {
    flexDirection: "row",
    gap: 9,
  },

  careInfo: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 10,
    minHeight: 65,
  },

  careInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },

  careInfoLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
  },

  careInfoValue: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "700",
  },

  careHint: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  careHintText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
  },

  pressed: {
    opacity: 0.82,
  },
});

export const locationSectionStyles = StyleSheet.create({
  ...occurrenceFormSharedStyles,

  addressInput: {
    alignItems: "flex-start",
    paddingTop: 3,
    paddingBottom: 3,
  },

  addressLoading: {
    marginTop: 14,
    marginLeft: 8,
  },

  addressSuggestions: {
    marginTop: -4,
    marginBottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadows.elevation1,
  },

  addressSuggestionItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  addressSuggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  addressSuggestionContent: {
    flex: 1,
    paddingRight: 8,
  },

  addressSuggestionTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },

  addressSuggestionSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 17,
  },

  addressSuggestionDivider: {
    height: 1,
    marginLeft: 58,
    backgroundColor: theme.colors.brandAlpha.soft,
  },

  locationButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.14)",
    backgroundColor: "rgba(31, 92, 77, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },

  locationButtonText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },
});


export const occurrenceFormSectionStyles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.06)",
    ...theme.shadows.elevation1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: theme.colors.brandAlpha.medium,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sectionNumberText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: "800",
  },

  sectionHeaderContent: {
    flex: 1,
  },

  sectionTitle: {
    color: theme.colors.textTitle,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    color: theme.colors.textBody,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});

export const occurrenceTypeSectionStyles = StyleSheet.create({
  typeList: {
    gap: 10,
  },

  typeCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.background,
  },

  typeCardActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  typeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  typeIconActive: {
    backgroundColor: theme.colors.brand,
  },

  typeContent: {
    flex: 1,
  },

  typeTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "700",
  },

  typeTitleActive: {
    color: theme.colors.brand,
  },

  typeDescription: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },

  radioOuter: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(31, 92, 77, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  radioOuterActive: {
    borderColor: theme.colors.brand,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.brand,
  },

  pressed: {
    opacity: 0.82,
  },
});


export const photoSectionStyles = StyleSheet.create({
  photoArea: {
    height: 210,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(31, 92, 77, 0.22)",
    backgroundColor: "rgba(31, 92, 77, 0.035)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  photoAreaFilled: {
    borderStyle: "solid",
    borderColor: "rgba(31, 92, 77, 0.12)",
  },

  photoIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(31, 92, 77, 0.09)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  photoTitle: {
    color: theme.colors.textTitle,
    fontSize: 15,
    fontWeight: "800",
  },

  photoDescription: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 4,
  },

  photoPreview: {
    width: "100%",
    height: "100%",
  },

  photoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
  },

  photoOverlayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  photoOverlayText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.82,
  },
});

export const reviewSectionStyles = StyleSheet.create({
  reviewCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    overflow: "hidden",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  reviewHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.brandAlpha.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  reviewHeaderContent: {
    flex: 1,
  },

  reviewHeaderTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  reviewHeaderText: {
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },

  reviewDivider: {
    height: 1,
    backgroundColor: theme.colors.brandAlpha.soft,
  },

  reviewItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31, 92, 77, 0.06)",
  },

  reviewLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 3,
  },

  reviewValue: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
});

export const selectionChipStyles = StyleSheet.create({
  optionChip: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.background,
  },

  optionChipActive: {
    borderColor: theme.colors.brand,
    backgroundColor: theme.colors.brandAlpha.soft,
  },

  optionChipText: {
    color: theme.colors.textBody,
    fontSize: 13,
    fontWeight: "600",
  },

  optionChipTextActive: {
    color: theme.colors.brand,
    fontWeight: "700",
  },

  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "rgba(31, 92, 77, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  checkCircleActive: {
    backgroundColor: theme.colors.brand,
    borderColor: theme.colors.brand,
  },

  pressed: {
    opacity: 0.82,
  },
});

export const selectionChipGroupStyles = StyleSheet.create({
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 13,
  },
});


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