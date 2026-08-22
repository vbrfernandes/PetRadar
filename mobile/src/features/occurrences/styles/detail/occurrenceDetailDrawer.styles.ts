import { StyleSheet } from "react-native";

import { theme } from "../../../../theme";

export const occurrenceDetailDrawerStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.overlay.modal,
  },

  overlayPressable: {
  ...StyleSheet.absoluteFill,
},

  drawer: {
    height: "100%",
    marginLeft: "auto",
    overflow: "hidden",
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
    ...theme.shadows.elevation1,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    minHeight: 68,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderAlpha.faint,
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: theme.colors.background,
  },

  headerContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  headerSubtitle: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  pressed: {
    opacity: 0.74,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.55,
  },

  scrollContent: {
    paddingBottom: 38,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 60,
  },

  loadingIcon: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 31,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  loadingTitle: {
    marginTop: 13,
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  loadingText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: theme.colors.textBody,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },

  errorIcon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 32,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    color: theme.colors.textTitle,
  },

  errorText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: theme.colors.textBody,
  },

  errorButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },

  errorButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.surface,
  },
});

