import {
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

import { theme } from "../../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const PROFILE_DRAWER_WIDTH = SCREEN_WIDTH * 0.88;

export const profileDetailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.52)",
  },

  backdrop: {
    flex: 1,
  },

  drawerContainer: {
    width: PROFILE_DRAWER_WIDTH,
    height: "100%",
    backgroundColor: theme.colors.background,

    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,

    overflow: "hidden",

    ...theme.shadows.elevation1,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 74, //

    paddingBottom: 10, //
    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: theme.colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderAlpha.faint,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surfaceSoft,
  },

  logoutHeaderButton: {
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.textTitle,
    letterSpacing: -0.2,
  },

  headerSubtitle: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  // ==========================================================
  // HERO
  // ==========================================================

  profileHero: {
    alignItems: "center",

    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,

    backgroundColor: theme.colors.surface,

    overflow: "hidden",

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroGlow: {
    position: "absolute",

    width: 180,
    height: 180,

    borderRadius: 90,

    top: -100,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  avatarRing: {
    width: 104,
    height: 104,

    borderRadius: 52,

    padding: 4,

    backgroundColor: theme.colors.semantic.success.bg,

    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.15)",

    ...theme.shadows.elevation1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },

  avatarPlaceholder: {
    flex: 1,

    borderRadius: 48,

    backgroundColor: theme.colors.surfaceSoft,

    justifyContent: "center",
    alignItems: "center",
  },

  uploadingOverlay: {
    ...StyleSheet.absoluteFill,

    borderRadius: 52,

    backgroundColor: "rgba(15, 23, 42, 0.68)",

    justifyContent: "center",
    alignItems: "center",
  },

  uploadingText: {
    marginTop: 6,

    fontSize: 10,
    fontWeight: "700",

    color: theme.colors.surface,
  },

  photoActionBadge: {
    position: "absolute",

    right: 0,
    bottom: 0,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 3,
    borderColor: theme.colors.surface,

    ...theme.shadows.buttonGlow,
  },

  photoAddBadge: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: theme.colors.brand,
  },

  photoEditBadge: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: theme.colors.brand,
  },

  profileName: {
    maxWidth: "90%",

    fontSize: 22,
    fontWeight: "800",

    color: theme.colors.textTitle,

    letterSpacing: -0.5,
  },

  profileEmail: {
    maxWidth: "90%",

    marginTop: 4,

    fontSize: 13,
    fontWeight: "500",

    color: theme.colors.textBody,
  },

  profileMeta: {
    marginTop: 12,
  },

  accountBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 100,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  accountBadgeDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 7,

    backgroundColor: theme.colors.brand,
  },

  accountBadgeText: {
    fontSize: 12,
    fontWeight: "700",

    color: theme.colors.brand,
  },

  photoActionHint: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 9,
  },

  photoHint: {
    marginLeft: 4,

    fontSize: 10,
    fontWeight: "500",

    color: theme.colors.textBody,
  },

  // ==========================================================
  // TABS
  // ==========================================================

  tabContainer: {
    flexDirection: "row",

    marginHorizontal: 12, //
    marginTop: 14,

    padding: 4,

    borderRadius: 16,

    backgroundColor: "rgba(15, 23, 42, 0.045)",
  },
  tabButton: {
    flex: 1,

    minHeight: 48,

    borderRadius: 13,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 3, //

    minWidth: 0,

    position: "relative", //
  },
  tabButtonActive: {
    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  tabIconContainer: {
    width: 26, //
    height: 26, //

    borderRadius: 9,

    alignItems: "center",
    justifyContent: "center",

    flexShrink: 0, //
  },

  tabIconContainerActive: {
    backgroundColor: theme.colors.semantic.success.bg,
  },

  tabText: {
    marginLeft: 4,

    fontSize: 11, //
    fontWeight: "600",

    color: theme.colors.textBody,

    flexShrink: 1,

    includeFontPadding: false, //
  },

  tabTextActive: {
    color: theme.colors.brand,
    fontWeight: "800",
  },

  // ==========================================================
  // CONTENT
  // ==========================================================

  contentContainer: {
    flex: 1,
  },

  profileScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  editScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // ==========================================================
  // SECTIONS
  // ==========================================================

  sectionHeader: {
    flexDirection: "row",

    alignItems: "flex-start",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",

    color: theme.colors.textTitle,

    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    marginTop: 3,

    fontSize: 12,
    lineHeight: 17,

    color: theme.colors.textBody,
  },

  cardSectionTitle: {
    marginTop: 24,
    marginBottom: 10,

    fontSize: 14,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  // ==========================================================
  // EDIT BUTTON
  // ==========================================================

  editButton: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 12,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  editButtonText: {
    marginLeft: 5,

    fontSize: 12,
    fontWeight: "800",

    color: theme.colors.brand,
  },

  // ==========================================================
  // INFO CARD
  // ==========================================================

  infoCard: {
    backgroundColor: theme.colors.surface,

    borderRadius: 20,

    paddingHorizontal: 16,
    paddingVertical: 4,

    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.subtle,

    ...theme.shadows.elevation1,
  },

  infoRow: {
    minHeight: 72,

    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: "600",

    color: theme.colors.textBody,

    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    lineHeight: 19,

    fontWeight: "700",

    color: theme.colors.textTitle,
  },

  infoDivider: {
    height: 1,

    marginLeft: 52,

    backgroundColor: theme.colors.borderAlpha.faint,
  },

  // ==========================================================
  // ACCOUNT CARD
  // ==========================================================

  accountCard: {
    flexDirection: "row",

    marginTop: 24,
    padding: 16,

    borderRadius: 18,

    backgroundColor: theme.colors.semantic.success.bg,

    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
  },

  accountIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.surface,
  },

  accountContent: {
    flex: 1,
    marginLeft: 12,
  },

  accountTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: theme.colors.brand,
  },

  accountDescription: {
    marginTop: 3,

    fontSize: 11,
    lineHeight: 16,

    color: theme.colors.textBody,
  },

  manageAccountLabel: {
    marginTop: 24,
    marginBottom: 10,

    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,

    color: theme.colors.textBody,
  },

  deleteAccountCard: {
    padding: 16,

    borderRadius: 18,

    backgroundColor: theme.colors.surface,

    borderWidth: 1,
    borderColor: theme.colors.semantic.danger.bg,

    ...theme.shadows.elevation1,
  },

  deleteAccountHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteAccountIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.danger.bg,
  },

  deleteAccountContent: {
    flex: 1,
    marginLeft: 12,
  },

  deleteAccountTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  deleteAccountDescription: {
    marginTop: 3,

    fontSize: 11,
    lineHeight: 16,

    color: theme.colors.textBody,
  },

  deleteAccountButton: {
    minHeight: 46,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 14,

    borderRadius: 14,

    backgroundColor: theme.colors.semantic.danger.bg,

    borderWidth: 1,
    borderColor: theme.colors.semantic.danger.text,
  },

  deleteAccountButtonText: {
    marginLeft: 7,

    fontSize: 13,
    fontWeight: "800",

    color: theme.colors.semantic.danger.text,
  },

  // ==========================================================
  // DELETE ACCOUNT MODAL
  // ==========================================================

  deleteModalOverlay: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 20,

    backgroundColor: "rgba(15, 23, 42, 0.62)",
  },

  deleteModalBackdrop: {
    ...StyleSheet.absoluteFill,
  },

  deleteModalCard: {
    width: "100%",
    maxWidth: 420,

    padding: 22,

    borderRadius: 22,

    backgroundColor: theme.colors.surface,

    ...theme.shadows.elevation1,
  },

  deleteModalIcon: {
    width: 52,
    height: 52,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.danger.bg,
  },

  deleteModalTitle: {
    marginTop: 16,

    fontSize: 20,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  deleteModalDescription: {
    marginTop: 8,

    fontSize: 13,
    lineHeight: 19,

    color: theme.colors.textBody,
  },

  deletePasswordLabel: {
    marginTop: 20,
    marginBottom: 8,

    fontSize: 12,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  deletePasswordWrapper: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 14,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: theme.colors.semantic.danger.bg,

    backgroundColor: theme.colors.surface,
  },

  deletePasswordInput: {
    flex: 1,

    marginLeft: 10,
    paddingVertical: 0,

    fontSize: 14,

    color: theme.colors.textTitle,
  },

  deletePasswordToggle: {
    width: 48,
    minHeight: 50,

    alignItems: "center",
    justifyContent: "center",
  },

  deleteModalActions: {
    marginTop: 20,
    gap: 10,
  },

  deleteModalCancelButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: theme.colors.surface,

    borderWidth: 1,
    borderColor: theme.colors.semantic.danger.bg,
  },

  deleteModalCancelText: {
    fontSize: 13,
    fontWeight: "700",

    color: theme.colors.textBody,
  },

  deleteModalConfirmButton: {
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: theme.colors.semantic.danger.text,
  },

  deleteModalButtonDisabled: {
    opacity: 0.7,
  },

  deleteModalConfirmText: {
    marginLeft: 7,

    fontSize: 13,
    fontWeight: "800",

    color: theme.colors.surface,
  },

  // ==========================================================
  // EDITING
  // ==========================================================

  editingIndicator: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 100,

    backgroundColor: theme.colors.semantic.warning.bg,
  },

  editingDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,

    backgroundColor: theme.colors.semantic.warning.text,
  },

  editingText: {
    fontSize: 10,
    fontWeight: "800",

    color: theme.colors.semantic.warning.text,
  },

  formCard: {
    padding: 16,

    borderRadius: 20,

    backgroundColor: theme.colors.surface,

    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.subtle,

    ...theme.shadows.elevation1,
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    marginBottom: 8,

    fontSize: 12,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  inputWrapper: {
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",

    backgroundColor: theme.colors.surfaceSoft,
  },

  inputWrapperMultiline: {
    alignItems: "flex-start",
    paddingTop: 13,
  },

  multilineIcon: {
    marginTop: 2,
  },

  input: {
    flex: 1,

    marginLeft: 10,

    paddingVertical: 0,

    fontSize: 14,
    fontWeight: "600",

    color: theme.colors.textTitle,
  },

  multilineInput: {
    minHeight: 76,

    paddingTop: 0,

    lineHeight: 20,
  },

  inputSuffix: {
    marginLeft: 6,

    fontSize: 13,
    fontWeight: "800",

    color: theme.colors.brand,
  },

  helperText: {
    marginTop: 7,

    fontSize: 11,
    lineHeight: 16,

    color: theme.colors.textBody,
  },

  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",

    paddingTop: 4,
  },

  preferenceIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.success.bg,
  },

  preferenceContent: {
    flex: 1,

    marginHorizontal: 12,
  },

  preferenceTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  preferenceDescription: {
    marginTop: 2,

    fontSize: 11,
    lineHeight: 16,

    color: theme.colors.textBody,
  },

  // ==========================================================
  // SWITCH
  // ==========================================================

  switchTrack: {
    width: 52,
    height: 30,

    padding: 2,

    borderRadius: 15,

    justifyContent: "center",

    backgroundColor: theme.colors.disabled,
  },

  switchTrackActive: {
    backgroundColor: theme.colors.brand,
  },

  switchThumb: {
    width: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: theme.colors.surface,

    shadowColor: theme.colors.shadow,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },

  // ==========================================================
  // ACTIONS
  // ==========================================================

  editActions: {
    marginTop: 16,
    gap: 10,
  },

  primaryButton: {
    minHeight: 52,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 15,

    backgroundColor: theme.colors.brand,

    ...theme.shadows.buttonGlow,
  },

  primaryButtonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    marginLeft: 8,

    fontSize: 14,
    fontWeight: "800",

    color: theme.colors.surface,
  },

  secondaryButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 15,

    backgroundColor: theme.colors.surfaceSoft,

    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.faint,
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",

    color: theme.colors.textBody,
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingBottom: 60,
  },

  loadingContent: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 50,
  },

  loadingIcon: {
    width: 62,
    height: 62,

    borderRadius: 31,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,

    backgroundColor: theme.colors.semantic.success.bg,
  },

  loadingText: {
    marginTop: 12,

    fontSize: 13,
    fontWeight: "600",

    color: theme.colors.textBody,
  },

  // ==========================================================
  // OCORRÊNCIAS
  // ==========================================================

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  occurrencesHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  occurrenceCountBadge: {
    minWidth: 34,
    height: 34,

    paddingHorizontal: 9,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.success.bg,
  },

  occurrenceCountText: {
    fontSize: 12,
    fontWeight: "800",

    color: theme.colors.brand,
  },

  occurrenceCard: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
    padding: 12,

    borderRadius: 18,

    backgroundColor: theme.colors.surface,

    borderWidth: 1,
    borderColor: theme.colors.borderAlpha.subtle,

    ...theme.shadows.elevation1,
  },

  occurrenceCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  occurrenceImageWrapper: {
    width: 76,
    height: 76,

    borderRadius: 15,

    overflow: "hidden",

    backgroundColor: theme.colors.surfaceSoft,
  },

  occurrenceImage: {
    width: "100%",
    height: "100%",
  },

  occurrenceImagePlaceholder: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  occurrenceInfo: {
    flex: 1,

    marginLeft: 12,
    marginRight: 7,
  },

  occurrenceTopRow: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,
  },

  statusDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: "900",
  },

  urgencyText: {
    maxWidth: 80,

    fontSize: 10,
    fontWeight: "600",

    color: theme.colors.textBody,
  },

  animalName: {
    marginTop: 8,

    fontSize: 15,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  locationRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 4,
  },

  locationText: {
    flex: 1,

    marginLeft: 3,

    fontSize: 10,

    color: theme.colors.textBody,
  },

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  emptyContainer: {
    alignItems: "center",

    paddingHorizontal: 30,
    paddingTop: 60,
  },

  emptyIcon: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colors.semantic.success.bg,
  },

  emptyTitle: {
    marginTop: 18,

    fontSize: 16,
    fontWeight: "800",

    color: theme.colors.textTitle,
  },

  emptyText: {
    maxWidth: 280,

    marginTop: 7,

    fontSize: 12,
    lineHeight: 18,

    textAlign: "center",

    color: theme.colors.textBody,
  },
});

export const profileQuickMenuStyles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,

        alignItems: "flex-end",

        paddingTop:
            Platform.OS === "ios"
                ? 96
                : 100,

        paddingHorizontal: 16,

        backgroundColor:
            "rgba(0,0,0,0.16)",
    },

    profileMenu: {
        width: Math.min(
            SCREEN_WIDTH - 32,
            340,
        ),

        padding: 14,

        borderRadius: 22,

        backgroundColor:
            theme.colors.surface,

        ...theme.shadows.elevation1,
    },

    // ========================================================
    // USUÁRIO
    // ========================================================

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

        color:
            theme.colors.textTitle,

        marginBottom: 3,
    },

    profileMenuEmail: {
        fontSize: 11,

        color:
            theme.colors.textBody,
    },

    verifiedBadge: {
        width: 22,
        height: 22,

        borderRadius: 11,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor:
            theme.colors.semantic
                .success.text,
    },

    // ========================================================
    // DIVISOR
    // ========================================================

    menuDivider: {
        height: 1,

        backgroundColor:
            theme.colors.inputBg,

        marginVertical: 11,
    },

    // ========================================================
    // ITENS
    // ========================================================

    profileMenuItem: {
        minHeight: 54,

        flexDirection: "row",

        alignItems: "center",

        borderRadius: 15,

        paddingHorizontal: 6,
    },

    profileMenuItemPressed: {
        backgroundColor:
            theme.colors.inputBg,
    },

    menuItemIcon: {
        width: 38,
        height: 38,

        borderRadius: 12,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor:
            theme.colors.semantic
                .success.bg,

        marginRight: 10,
    },

    menuItemContent: {
        flexShrink: 1,
    },

    menuItemTitle: {
        fontSize: 12,
        fontWeight: "700",

        color:
            theme.colors.textTitle,
    },

    menuItemDescription: {
        marginTop: 2,

        fontSize: 10,

        color:
            theme.colors.textBody,
    },

    menuItemArrow: {
        marginLeft: "auto",
    },

    // ========================================================
    // NOTIFICAÇÕES
    // ========================================================

    notificationBadge: {
        marginLeft: "auto",

        width: 22,
        height: 22,

        borderRadius: 11,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor:
            theme.colors.semantic
                .danger.text,
    },

    notificationBadgeText: {
        color:
            theme.colors.surface,

        fontSize: 10,
        fontWeight: "800",
    },

    // ========================================================
    // LOGOUT
    // ========================================================

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

        color:
            theme.colors.semantic
                .danger.text,
    },
});
