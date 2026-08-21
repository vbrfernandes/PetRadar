import { StyleSheet } from "react-native";
import { theme } from "../../../../theme/colors";

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

