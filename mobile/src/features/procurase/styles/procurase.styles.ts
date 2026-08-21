// ============================================================
// D:\PetRadar\src\mobile\src\features\procurase\styles\procurase.styles.ts
// ============================================================
import { Dimensions, StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";

const PROCURA_SE_MODE_CAROUSEL_WIDTH =
  Dimensions.get("window").width - theme.spacing.globalMargin * 2;

export { feedButtonPressedStyle as procuraSeButtonPressedStyle } from "../../feed/styles/feed.styles";

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

    transform: [
      {
        scale: 0.985,
      },
    ],
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

export const procuraSeScreenStyles = StyleSheet.create({
  // ========================================================
  // BASE
  // ========================================================

  container: {
    flex: 1,

    backgroundColor: theme.colors.background,
  },

  listContent: {
    paddingHorizontal: theme.spacing.globalMargin,

    paddingBottom: 125,
  },

  // ========================================================
  // HEADER
  // ========================================================

  header: {
    minHeight: 82,

    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 10,

    gap: 12,
  },

  headerMenuButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  headerContent: {
    flex: 1,

    justifyContent: "center",

    minWidth: 0,
  },

  headerTitle: {
    color: theme.colors.textTitle,

    fontSize: 20,

    fontWeight: "900",

    letterSpacing: -0.3,

    textAlign: "center",
  },

  headerActions: {
    alignItems: "center",

    justifyContent: "center",

    gap: 5,
  },

  headerAvatarButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    padding: 2,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  headerAvatarImage: {
    width: "100%",
    height: "100%",

    borderRadius: 21,
  },

  headerOnlineIndicator: {
    position: "absolute",

    right: 1,
    bottom: 1,

    width: 11,
    height: 11,

    borderRadius: 6,

    backgroundColor: theme.colors.semantic.success.text,

    borderWidth: 2,

    borderColor: theme.colors.surface,
  },

  radiusBadge: {
    minHeight: 25,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 3,

    paddingHorizontal: 8,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  radiusText: {
    color: theme.colors.brand,

    fontSize: 10,

    fontWeight: "800",
  },

  // ========================================================
  // DENÚNCIA
  // ========================================================

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

  // ========================================================
  // EMPTY
  // ========================================================

  emptyContainer: {
    alignItems: "center",

    paddingHorizontal: 25,

    paddingVertical: 60,
  },

  emptyIcon: {
    width: 72,
    height: 72,

    borderRadius: 36,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: theme.colors.semantic.success.bg,
  },

  emptyTitle: {
    marginTop: 17,

    color: theme.colors.textTitle,

    fontSize: 16,

    fontWeight: "900",

    textAlign: "center",
  },

  emptyText: {
    maxWidth: 290,

    marginTop: 7,

    color: theme.colors.textBody,

    fontSize: 12,

    lineHeight: 18,

    textAlign: "center",
  },

  clearButton: {
    minHeight: 40,

    alignItems: "center",

    justifyContent: "center",

    marginTop: 18,

    paddingHorizontal: 17,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.inputBg,
  },

  clearButtonText: {
    color: theme.colors.brand,

    fontSize: 11,

    fontWeight: "800",
  },

  // ========================================================
  // REGISTRAR OCORRÊNCIA
  // ========================================================

  registerButton: {
    position: "absolute",

    left: theme.spacing.globalMargin,

    right: theme.spacing.globalMargin,

    bottom: 18,

    minHeight: 66,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 12,

    borderRadius: 21,

    backgroundColor: theme.colors.brand,

    ...theme.shadows.buttonGlow,
  },

  registerButtonPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],

    opacity: 0.96,
  },

  registerButtonIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: theme.colors.surface,
  },

  registerButtonContent: {
    flex: 1,

    marginLeft: 11,
  },

  registerButtonTitle: {
    color: theme.colors.surface,

    fontSize: 13,

    fontWeight: "900",
  },

  registerButtonSubtitle: {
    marginTop: 2,

    color: theme.colors.surface,

    fontSize: 9,

    fontWeight: "500",
  },

  registerButtonArrow: {
    width: 38,
    height: 38,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: theme.colors.action,
  },

  // ========================================================
  // LOADING / ERRO / LOCALIZAÇÃO
  // ========================================================

  stateContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 30,
  },

  stateIcon: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 16,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  errorIcon: {
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  stateTitle: {
    marginTop: 14,

    color: theme.colors.textTitle,

    fontSize: 18,

    fontWeight: "900",

    textAlign: "center",
  },

  stateDescription: {
    maxWidth: 300,

    marginTop: 8,

    color: theme.colors.textBody,

    fontSize: 12,

    lineHeight: 19,

    textAlign: "center",
  },

  stateButton: {
    minHeight: 48,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,

    marginTop: 22,

    paddingHorizontal: 20,

    borderRadius: theme.radius.button,

    backgroundColor: theme.colors.brand,

    ...theme.shadows.buttonGlow,
  },

  stateButtonText: {
    color: theme.colors.surface,

    fontSize: 12,

    fontWeight: "800",
  },
});
