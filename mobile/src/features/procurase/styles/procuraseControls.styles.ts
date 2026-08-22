import { Dimensions, StyleSheet } from "react-native";

import { theme } from "../../../theme";

const PROCURA_SE_MODE_CAROUSEL_WIDTH =
  Dimensions.get("window").width - theme.spacing.globalMargin * 2;

export const procuraSeControlsStyles = StyleSheet.create({
  feedModeCarouselWrapper: {
    width: "100%",
    overflow: "hidden",
  },
  feedModeCarouselPage: {
    width: PROCURA_SE_MODE_CAROUSEL_WIDTH,
  },
  searchBox: {
    width: "100%",
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 9,
    color: theme.colors.textTitle,
    fontSize: 13,
  },
  feedSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 12,
  },
  feedSectionText: {
    flex: 1,
    paddingRight: 12,
  },
  feedSectionTitle: {
    color: theme.colors.textTitle,
    fontSize: 16,
    fontWeight: "900",
  },
  feedSectionSubtitle: {
    marginTop: 3,
    color: theme.colors.textBody,
    fontSize: 10,
  },
  counterBadge: {
    minWidth: 34,
    height: 30,
    paddingHorizontal: 9,
    borderRadius: theme.radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },
  counterText: {
    color: theme.colors.brand,
    fontSize: 11,
    fontWeight: "900",
  },
  feedModeButtonsPage: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 12,
  },
  feedModeButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.inputBg,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },
  feedModeButtonActive: {
    borderColor: theme.colors.brand,
    backgroundColor: theme.colors.brand,
  },
  feedModeButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  feedModeIconBox: {
    width: 42,
    height: 42,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: theme.colors.semantic.success.bg,
  },
  feedModeIconBoxActive: {
    backgroundColor: theme.colors.action,
  },
  feedModeEcoIcon: {
    width: 26,
    height: 26,
  },
  feedModeContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  feedModeTitle: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "900",
  },
  feedModeTitleActive: {
    color: theme.colors.surface,
  },
  feedModeSubtitle: {
    marginTop: 4,
    color: theme.colors.textBody,
    fontSize: 9,
    fontWeight: "600",
  },
  feedModeSubtitleActive: {
    color: theme.colors.surface,
  },
  filtersContent: {
    gap: 8,
    paddingBottom: 14,
    paddingRight: 6,
  },
  filterChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.colors.inputBg,
    backgroundColor: theme.colors.surface,
  },
  filterChipActive: {
    borderColor: theme.colors.brand,
    backgroundColor: theme.colors.brand,
  },
  filterText: {
    color: theme.colors.textBody,
    fontSize: 11,
    fontWeight: "700",
  },
  filterTextActive: {
    color: theme.colors.surface,
  },
});
