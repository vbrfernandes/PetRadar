import {
  Platform,
  StyleSheet,
} from "react-native";

import { theme } from "../../../theme";

export const mapScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  pressed: {
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  controlPressed: {
    backgroundColor: theme.colors.inputBg,
  },

  /**
   * ========================================================
   * LOADING LOCALIZAÇÃO
   * ========================================================
   */

  locationLoading: {
    position: "absolute",
    top: Platform.OS === "ios" ? 112 : 104,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },

  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.button,
    backgroundColor: "rgba(255,255,255,0.96)",
    ...theme.shadows.elevation1,
  },

  loadingText: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "600",
  },

  headerFilterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  /**
   * ========================================================
   * LOADING OCORRÊNCIAS
   * ========================================================
   */

  ocorrenciasLoading: {
    position: "absolute",
    top: Platform.OS === "ios" ? 166 : 170,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 19,
  },

  ocorrenciasLoadingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.94)",
    ...theme.shadows.elevation1,
  },

  ocorrenciasLoadingText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },

  /**
   * ========================================================
   * HEADER
   * ========================================================
   */

  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 34 : 38,
    left: theme.spacing.padding,
    right: theme.spacing.padding,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 10,
  },

  headerIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  searchBox: {
    flex: 1,
    height: 50,
    borderRadius: theme.radius.button,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 9,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderWidth: 1.5,
    ...theme.shadows.elevation1,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 0,
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "500",
  },

  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  onlineIndicator: {
    position: "absolute",
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.semantic.success.text,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  /**
   * ========================================================
   * STATUS
   * ========================================================
   */

  statusCardContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 104 : 108,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.94)",
    ...theme.shadows.elevation1,
  },

  statusIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
    marginRight: 9,
  },

  statusContent: {
    flexShrink: 1,
  },

  statusTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textBody,
    marginBottom: 1,
  },

  statusDescription: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
    backgroundColor: theme.colors.semantic.success.text,
  },

  liveText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: theme.colors.semantic.success.text,
  },

  /**
   * ========================================================
   * CONTROLES
   * ========================================================
   */

  mapZoomControls: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "ios" ? 330 : 318,
    alignItems: "center",
    zIndex: 8,
  },

  controlGroup: {
    width: 46,
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  mapControlButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  controlDivider: {
    height: 1,
    marginHorizontal: 10,
    backgroundColor: theme.colors.inputBg,
  },

  filterButton: {
    minWidth: 106,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: theme.radius.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.shadows.elevation1,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  /**
   * ========================================================
   * LOCALIZAÇÃO
   * ========================================================
   */

  locationButton: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === "ios" ? 260 : 250,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    zIndex: 8,
    ...theme.shadows.elevation1,
  },

  locationButtonPressed: {
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  locationButtonInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },

  /**
   * ========================================================
   * ÁREA INFERIOR
   * ========================================================
   */

  bottomArea: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 60 : 62,
    zIndex: 10,
    gap: 10,
  },

  discoveryCard: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.96)",
    ...theme.shadows.elevation1,
  },

  discoveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
    marginRight: 11,
  },

  discoveryContent: {
    flex: 1,
    paddingRight: 8,
  },

  discoveryTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
    marginBottom: 3,
  },

  discoveryDescription: {
    fontSize: 10.5,
    lineHeight: 15,
    color: theme.colors.textBody,
  },

  primaryButton: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 19,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },

  primaryButtonPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  primaryButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    marginRight: 11,
  },

  primaryButtonContent: {
    flex: 1,
  },

  primaryButtonLabel: {
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  primaryButtonHint: {
    marginTop: 2,
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "500",
  },

  primaryButtonArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  // ========================================================
  // BANNER DE ANÚNCIO PROVISÓRIO
  // ========================================================

  adBanner: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderWidth: 1,
    borderColor: theme.colors.inputBg,
    ...theme.shadows.elevation1,
  },

  adBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: theme.colors.inputBg,
    marginRight: 10,
  },

  adBadgeText: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: theme.colors.textBody,
  },

  adContent: {
    flex: 1,
    paddingRight: 8,
  },

  adTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
    marginBottom: 2,
  },

  adDescription: {
    fontSize: 9.5,
    lineHeight: 13,
    color: theme.colors.textBody,
  },

  adIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },
  /**
   * ========================================================
   * MARCADOR PREMIUM
   * ========================================================
   */

  markerPressable: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerPressed: {
    transform: [
      {
        scale: 0.92,
      },
    ],
  },

  occurrenceMarker: {
    width: 68,
    height: 82,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "visible",
  },

  markerPin: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.brand,
    ...theme.shadows.elevation1,
  },

  markerPhotoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },

  markerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.inputBg,
  },

  markerPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },

  markerAnimalBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 19,
    height: 19,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },

  markerPointer: {
    width: 0,
    height: 0,
    marginTop: -1,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: theme.colors.brand,
  },

  /**
   * ========================================================
   * FILTROS
   * ========================================================
   */

  filterModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  filterBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  filterSheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 32 : 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
    backgroundColor: theme.colors.inputBg,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  sheetSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textBody,
  },

  sheetClose: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },

  filterSectionTitle: {
    marginBottom: 11,
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  secondFilterSection: {
    marginTop: 23,
  },

  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  filterChip: {
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: theme.radius.button,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: "transparent",
  },

  filterChipSelected: {
    backgroundColor: theme.colors.semantic.success.bg,
    borderColor: theme.colors.brand,
  },

  filterChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  filterChipTextSelected: {
    color: theme.colors.brand,
    fontWeight: "800",
  },

  filterActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
  },

  clearFiltersButton: {
    flex: 0.35,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.inputBg,
  },

  clearFiltersText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  applyFiltersButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.brand,
    ...theme.shadows.buttonGlow,
  },

  applyFiltersText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.surface,
  },

  /**
   * ========================================================
   * SOS
   * ========================================================
   */

  sosCard: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.semantic.danger.bg,
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  sosIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },

  sosContent: {
    flex: 1,
    marginLeft: 10,
  },

  sosTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.semantic.danger.text,
  },

  sosDescription: {
    marginTop: 2,
    fontSize: 9,
    color: theme.colors.textBody,
  },
});
