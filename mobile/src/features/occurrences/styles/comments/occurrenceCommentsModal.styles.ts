import { StyleSheet } from "react-native";
import { theme } from "../../../../theme";

export const occurrenceCommentsModalStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: theme.colors.overlay.modal,
  },

  panel: {
    width: "100%",

    backgroundColor: theme.colors.surface,

    overflow: "hidden",

    ...theme.shadows.elevation1,
  },

  panelCollapsed: {
    height: "78%",

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  panelExpanded: {
    height: "100%",
  },

  safeArea: {
    flex: 1,
  },

  // ============================================================
  // HANDLE
  // ============================================================

  handleArea: {
    height: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surface,
  },

  handle: {
    width: 34,
    height: 4,

    borderRadius: 2,

    backgroundColor: "rgba(15, 23, 42, 0.12)",
  },

  // ============================================================
  // HEADER
  // ============================================================

  header: {
    minHeight: 58,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    backgroundColor: theme.colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderAlpha.subtle,
  },

  headerButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "transparent",
  },

  expandButton: {
    backgroundColor: theme.colors.brandAlpha.faint,
  },

  headerContent: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 8,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  headerTitle: {
    color: theme.colors.textTitle,

    fontSize: 17,

    fontWeight: "800",
  },

  headerSubtitle: {
    marginTop: 1,

    color: theme.colors.textBody,

    fontSize: 9,

    fontWeight: "500",
  },

  // ============================================================
  // CONTEXTO
  // ============================================================

  contextBar: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 8,

    backgroundColor: theme.colors.background,

    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderAlpha.subtle,
  },

  contextIcon: {
    width: 30,
    height: 30,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,

    backgroundColor: theme.colors.brandAlpha.faint,
  },

  contextContent: {
    flex: 1,

    minWidth: 0,
  },

  contextTitle: {
    color: theme.colors.textTitle,

    fontSize: 11,

    fontWeight: "700",
  },

  contextText: {
    marginTop: 1,

    color: theme.colors.textBody,

    fontSize: 9.5,
  },

  // ============================================================
  // LISTA
  // ============================================================

  messagesContainer: {
    flex: 1,

    backgroundColor: theme.colors.surface,
  },

  messagesList: {
    paddingHorizontal: 16,

    paddingTop: 14,
    paddingBottom: 22,
  },

  messagesListEmpty: {
    flexGrow: 1,
  },

  // ============================================================
  // COMENTÁRIO
  // ============================================================

  composerMode: {
    minHeight: 46,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 7,

    backgroundColor: theme.colors.brandAlpha.faint,

    borderTopWidth: 1,
    borderTopColor: theme.colors.borderAlpha.subtle,
  },

  composerModeIcon: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,

    marginRight: 8,

    backgroundColor: theme.colors.surface,
  },

  composerModeContent: {
    flex: 1,

    minWidth: 0,
  },

  composerModeTitle: {
    fontSize: 10.5,

    fontWeight: "700",

    color: theme.colors.brand,
  },

  composerModeText: {
    marginTop: 1,

    fontSize: 9.5,

    color: theme.colors.textBody,
  },

  composerModeClose: {
    width: 28,
    height: 28,

    marginLeft: 8,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: "transparent",
  },

  // ============================================================
  // COMPOSER
  // ============================================================

  composer: {
    flexDirection: "row",

    alignItems: "flex-end",

    paddingHorizontal: 12,

    paddingTop: 8,
    paddingBottom: 8,

    gap: 8,

    backgroundColor: theme.colors.surface,

    borderTopWidth: 1,
    borderTopColor: theme.colors.borderAlpha.subtle,
  },

  inputWrapper: {
    flex: 1,

    minHeight: 42,
    maxHeight: 108,

    justifyContent: "center",

    borderRadius: 14,

    paddingHorizontal: 13,

    backgroundColor: theme.colors.mutedSurface,

    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.subtle,
  },

  input: {
    minHeight: 40,
    maxHeight: 100,

    paddingVertical: 9,

    color: theme.colors.textTitle,

    fontSize: 13,

    lineHeight: 18,
  },

  sendButton: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.brand,

    ...theme.shadows.buttonGlow,
  },

  sendButtonDisabled: {
    opacity: 0.38,
  },

  sendButtonPressed: {
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  // ============================================================
  // ERRO INLINE
  // ============================================================

  inlineError: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 7,

    gap: 6,

    backgroundColor: theme.colors.semantic.danger.bg,
  },

  inlineErrorText: {
    flex: 1,

    color: theme.colors.semantic.danger.text,

    fontSize: 10,

    fontWeight: "600",
  },

  // ============================================================
  // ESTADOS
  // ============================================================

  stateContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,
  },

  stateIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 11,

    backgroundColor: theme.colors.brandAlpha.faint,
  },

  errorStateIcon: {
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  stateTitle: {
    color: theme.colors.textTitle,

    fontSize: 15,

    fontWeight: "700",

    textAlign: "center",
  },

  stateText: {
    marginTop: 5,

    color: theme.colors.textBody,

    fontSize: 11,

    lineHeight: 16,

    textAlign: "center",
  },

  retryButton: {
    minHeight: 36,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 14,

    paddingHorizontal: 12,

    gap: 5,

    borderRadius: 10,

    backgroundColor: theme.colors.brandAlpha.faint,
  },

  retryButtonText: {
    color: theme.colors.brand,

    fontSize: 10.5,

    fontWeight: "700",
  },

  // ============================================================
  // ESTADO VAZIO
  // ============================================================

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 11,

    backgroundColor: theme.colors.brandAlpha.faint,
  },

  emptyTitle: {
    color: theme.colors.textTitle,

    fontSize: 15,

    fontWeight: "700",
  },

  emptyText: {
    marginTop: 5,

    color: theme.colors.textBody,

    fontSize: 11,

    lineHeight: 17,

    textAlign: "center",
  },

  // ============================================================
  // PRESS
  // ============================================================

  pressed: {
    opacity: 0.62,
  },
});

