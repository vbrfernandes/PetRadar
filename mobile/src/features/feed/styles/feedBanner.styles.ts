import { StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";

export const feedBannerStyles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 4,
    marginBottom: 14,
  },
  slide: {
    justifyContent: "center",
  },
  banner: {
    minHeight: 104,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.elevation1,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 13,
  },
  appLabel: {
    marginBottom: 3,
    color: theme.colors.surface,
    fontSize: 8,
    fontWeight: "700",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  sponsoredLabel: {
    alignSelf: "flex-start",
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.button,
    color: theme.colors.brand,
    fontSize: 8,
    fontWeight: "800",
    backgroundColor: theme.colors.surface,
  },
  title: {
    color: theme.colors.surface,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900",
  },
  description: {
    marginTop: 4,
    color: theme.colors.surface,
    fontSize: 10,
    lineHeight: 15,
    opacity: 0.92,
  },
  pagination: {
    minHeight: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingTop: 8,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.inputBg,
  },
  paginationDotActive: {
    width: 17,
    backgroundColor: theme.colors.brand,
  },
});
