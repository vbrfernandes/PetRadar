import { StyleSheet } from "react-native";

import { theme } from "../../../../theme";

export const occurrenceCareStyles = StyleSheet.create({
  historyButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 5,
    borderRadius: 12,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  historyButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.brand,
  },

  careActionsCard: {
    padding: 11,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  careButtonRow: {
    flexDirection: "row",
    gap: 9,
  },

  careButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 106,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
  },

  careButtonIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    borderRadius: 15,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  careButtonTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  careButtonSubtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: theme.colors.textBody,
  },

  careError: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    gap: 7,
    borderRadius: 12,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  careErrorText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    color: theme.colors.semantic.danger.text,
  },

  subsectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  careInfoCard: {
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  careInfo: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },

  careInfoIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderRadius: 13,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  careInfoContent: {
    flex: 1,
    minWidth: 0,
  },

  careInfoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  careInfoDate: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  careInfoAuthor: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  authorRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  careInfoDivider: {
    height: 1,
    marginLeft: 51,
    backgroundColor: theme.colors.borderAlpha.faint,
  },

  legacyCareCard: {
    marginTop: 11,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 11,
    gap: 7,
    borderRadius: 14,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  legacyCareText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    color: theme.colors.textBody,
  },

  historyBackdrop: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },

  historyModal: {
    maxHeight: "80%",
    padding: 19,
    borderRadius: 23,
    backgroundColor: theme.colors.background,
    ...theme.shadows.elevation1,
  },

  historyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 17,
  },

  historyHeaderContent: {
    flex: 1,
    minWidth: 0,
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  historySubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.textBody,
  },

  closeHistoryButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
  },

  historyList: {
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
  },

  historyItem: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  historyItemIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderRadius: 13,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  historyItemContent: {
    flex: 1,
    minWidth: 0,
  },

  historyItemTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  historyItemDate: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },

  historyItemAuthor: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.textBody,
  },

  historyRegistered: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 13,
    color: theme.colors.muted,
  },

  historyDivider: {
    height: 1,
    marginLeft: 52,
    backgroundColor: theme.colors.borderAlpha.faint,
  },

  historyState: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  historyStateText: {
    maxWidth: 250,
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: theme.colors.textBody,
  },

  historyErrorIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 27,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  historyErrorText: {
    maxWidth: 260,
    marginBottom: 13,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: theme.colors.semantic.danger.text,
  },

  historyEmptyIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
    borderRadius: 27,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  historyEmptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    color: theme.colors.textTitle,
  },

  retryButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    gap: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  retryButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.brand,
  },
});

