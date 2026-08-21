import { Dimensions, Platform, StyleSheet } from "react-native";

import { theme } from "../../../../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const profileQuickMenuStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: Platform.OS === "ios" ? 96 : 100,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  profileMenu: {
    width: Math.min(SCREEN_WIDTH - 32, 340),
    padding: 14,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },
  profileMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileMenuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    marginRight: 11,
  },
  profileMenuIdentity: {
    flex: 1,
  },
  profileMenuName: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textTitle,
    marginBottom: 3,
  },
  profileMenuEmail: {
    fontSize: 11,
    color: theme.colors.textBody,
  },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.inputBg,
    marginVertical: 11,
  },
  profileMenuItem: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 6,
  },
  profileMenuItemPressed: {
    backgroundColor: theme.colors.inputBg,
  },
  menuItemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
    marginRight: 10,
  },
  menuItemContent: {
    flexShrink: 1,
  },
  menuItemTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },
  menuItemDescription: {
    marginTop: 2,
    fontSize: 10,
    color: theme.colors.textBody,
  },
  menuItemArrow: {
    marginLeft: "auto",
  },
  notificationBadge: {
    marginLeft: "auto",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.danger.text,
  },
  notificationBadgeText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "800",
  },
  logoutButton: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 13,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.semantic.danger.text,
  },
});
