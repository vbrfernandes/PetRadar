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
    borderColor: "rgba(31, 92, 77, 0.08)",
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
