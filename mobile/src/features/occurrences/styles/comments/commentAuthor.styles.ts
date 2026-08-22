import { StyleSheet } from "react-native";
import { theme } from "../../../../theme";

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

