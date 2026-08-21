import { StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";

export const procuraSeStatesStyles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },
  emptyTitle: {
    marginTop: 17,
    color: theme.colors.textTitle,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    maxWidth: 290,
    marginTop: 7,
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  clearButton: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingHorizontal: 17,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.inputBg,
  },
  clearButtonText: {
    color: theme.colors.brand,
    fontSize: 11,
    fontWeight: "800",
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  stateIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: theme.colors.semantic.success.bg,
  },
  errorIcon: {
    backgroundColor: theme.colors.semantic.danger.bg,
  },
  stateTitle: {
    marginTop: 14,
    color: theme.colors.textTitle,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  stateDescription: {
    maxWidth: 300,
    marginTop: 8,
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
  },
  stateButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 22,
    paddingHorizontal: 20,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },
  stateButtonText: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: "800",
  },
});
