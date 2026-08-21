import { StyleSheet } from "react-native";
import { theme } from "../../../../theme/colors";

import { occurrenceFormSharedStyles } from "./occurrenceFormControls.styles";
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

