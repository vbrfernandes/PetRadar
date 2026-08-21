import { StyleSheet } from "react-native";
import { theme } from "../../../theme/colors";


export const commentAuthorModalStyles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.overlay.modalStrong,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    overflow: "hidden",
    borderRadius: 26,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },

  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderAlpha.default,
  },

  headerIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  headerTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  closeButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: theme.colors.background,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
  },

  avatar: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 46,
    backgroundColor: theme.colors.semantic.success.bg,
    borderWidth: 3,
    borderColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitials: {
    fontSize: 25,
    fontWeight: "900",
    color: theme.colors.brand,
  },

  name: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
    color: theme.colors.textTitle,
  },

  typeBadge: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 11,
    gap: 6,
    borderRadius: 100,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  typeText: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.brand,
  },

  infoCard: {
    width: "100%",
    marginTop: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 17,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.default,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderRadius: 13,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  infoValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  helperText: {
    marginTop: 15,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    color: theme.colors.textBody,
  },

  pressed: {
    opacity: 0.72,
  },
});

export const occurrenceCommentsModalStyles = StyleSheet.create({
  // ============================================================
  // MODAL
  // ============================================================

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

  commentRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "flex-start",

    paddingVertical: 3,
  },

  commentAvatar: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",

    borderRadius: 18,

    backgroundColor: theme.colors.brandAlpha.faint,

    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.border,
  },

  commentAvatarImage: {
    width: "100%",
    height: "100%",
  },

  commentAvatarInitials: {
    fontSize: 10,

    fontWeight: "800",

    color: theme.colors.brand,
  },

  commentBody: {
    flex: 1,

    minWidth: 0,

    marginLeft: 10,
  },

  // ============================================================
  // HEADER DO COMENTÁRIO
  // ============================================================

  commentHeader: {
    minHeight: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  commentHeaderRight: {
    flexDirection: "row",

    alignItems: "center",

    flexShrink: 0,

    marginLeft: 8,
  },

  commentMeta: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  commentEdited: {
    fontSize: 8.5,

    fontWeight: "500",

    color: theme.colors.textBody,
  },

  commentOptionsButton: {
    width: 26,
    height: 26,

    marginLeft: 2,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 13,
  },

  commentAuthorButton: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",
    alignItems: "center",

    marginRight: 8,
  },

  commentAuthorName: {
    flexShrink: 1,

    fontSize: 12,

    fontWeight: "700",

    color: theme.colors.textTitle,
  },

  youBadge: {
    marginLeft: 6,

    paddingHorizontal: 6,
    paddingVertical: 1,

    borderRadius: 6,

    backgroundColor: theme.colors.brandAlpha.faint,
  },

  youBadgeText: {
    fontSize: 8,

    fontWeight: "700",

    color: theme.colors.brand,
  },

  commentTime: {
    fontSize: 8.5,

    fontWeight: "500",

    color: theme.colors.textBody,
  },

  // ============================================================
  // TEXTO
  // ============================================================

  commentText: {
    marginTop: 3,

    fontSize: 13,

    lineHeight: 18,

    fontWeight: "400",

    color: theme.colors.textTitle,
  },

  deletedCommentText: {
    marginTop: 4,

    fontSize: 12,

    lineHeight: 18,

    fontStyle: "italic",

    color: theme.colors.textBody,
  },

  // ============================================================
  // AÇÕES
  // ============================================================

  commentActions: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 5,
  },

  replyButton: {
    minHeight: 24,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 0,
    paddingRight: 6,

    gap: 4,

    backgroundColor: "transparent",
  },

  replyButtonPressed: {
    opacity: 0.55,
  },

  replyButtonText: {
    fontSize: 10,

    fontWeight: "700",

    color: theme.colors.brand,
  },

  authorPressed: {
    opacity: 0.6,
  },

  // ============================================================
  // THREAD
  // ============================================================

  commentThread: {
    width: "100%",
  },

  repliesToggleButton: {
    alignSelf: "flex-start",

    flexDirection: "row",

    alignItems: "center",

    marginTop: 6,
    marginLeft: 46,

    minHeight: 26,

    paddingRight: 6,

    gap: 5,
  },

  repliesToggleButtonPressed: {
    opacity: 0.55,
  },

  repliesToggleLine: {
    width: 18,
    height: 1,

    backgroundColor: theme.colors.brandAlpha.border,
  },

  repliesToggleText: {
    fontSize: 10,

    fontWeight: "700",

    color: theme.colors.brand,
  },

  // ============================================================
  // PRIMEIRO NÍVEL DE RESPOSTAS
  // ============================================================

  repliesContainer: {
    marginTop: 8,
    marginLeft: 18,

    paddingLeft: 12,

    borderLeftWidth: 1,
    borderLeftColor: theme.colors.brandAlpha.border,
  },

  replyItem: {
    width: "100%",
  },

  replyItemWithSpacing: {
    marginTop: 10,

    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: theme.colors.borderAlpha.subtle,
  },

  // ============================================================
  // SEGUNDO NÍVEL DE RESPOSTAS
  // ============================================================

  nestedRepliesContainer: {
    marginTop: 8,
    marginLeft: 14,

    paddingLeft: 10,

    borderLeftWidth: 1,
    borderLeftColor: theme.colors.borderAlpha.subtle,
  },

  nestedReplyItem: {
    width: "100%",
  },

  nestedReplyItemWithSpacing: {
    marginTop: 8,

    paddingTop: 8,

    borderTopWidth: 1,
    borderTopColor: theme.colors.borderAlpha.subtle,
  },

  // ============================================================
  // OCULTAR RESPOSTAS
  // ============================================================

  hideRepliesButton: {
    alignSelf: "flex-start",

    flexDirection: "row",

    alignItems: "center",

    minHeight: 28,

    marginTop: 8,

    paddingHorizontal: 0,
    paddingRight: 6,

    gap: 4,

    backgroundColor: "transparent",
  },

  hideRepliesText: {
    fontSize: 10,

    fontWeight: "700",

    color: theme.colors.brand,
  },

  // ============================================================
  // SEPARAÇÃO ENTRE THREADS
  // ============================================================

  commentSeparator: {
    height: 1,

    marginLeft: 46,

    marginVertical: 13,

    backgroundColor: theme.colors.borderAlpha.subtle,
  },

  // ============================================================
  // MODO RESPONDER / EDITAR
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

