import { StyleSheet } from "react-native";
import { theme } from "../../../../theme/colors";

export const commentItemStyles = StyleSheet.create({
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
});

