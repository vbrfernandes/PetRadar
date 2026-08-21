import { StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";

export const procuraSeReportStyles = StyleSheet.create({
  reportOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.38)",
  },
  reportBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  reportSheet: {
    paddingHorizontal: theme.spacing.globalMargin,
    paddingTop: 10,
    paddingBottom: 26,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },
  reportHandle: {
    width: 38,
    height: 4,
    alignSelf: "center",
    marginBottom: 15,
    borderRadius: 2,
    backgroundColor: theme.colors.inputBg,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },
  reportHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.danger.bg,
  },
  reportHeaderContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },
  reportTitle: {
    color: theme.colors.textTitle,
    fontSize: 16,
    fontWeight: "900",
  },
  reportDescription: {
    marginTop: 3,
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 16,
  },
  reportCloseButton: {
    width: 38,
    height: 38,
    marginLeft: 8,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  reportReasons: {
    gap: 8,
  },
  reportReasonButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
  },
  reportReasonButtonPressed: {
    opacity: 0.72,
  },
  reportReasonIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  reportReasonText: {
    flex: 1,
    marginHorizontal: 10,
    color: theme.colors.textTitle,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  reportLoading: {
    minHeight: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  reportLoadingText: {
    color: theme.colors.textBody,
    fontSize: 12,
    fontWeight: "600",
  },
  reportCancelButton: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.inputBg,
  },
  reportCancelText: {
    color: theme.colors.textBody,
    fontSize: 12,
    fontWeight: "800",
  },
});
