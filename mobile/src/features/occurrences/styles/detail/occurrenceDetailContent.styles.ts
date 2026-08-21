import { StyleSheet } from "react-native";

import { theme } from "../../../../theme";

export const occurrenceDetailContentStyles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
    ...theme.shadows.elevation1,
  },

  photoContainer: {
    width: "100%",
    height: 238,
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.colors.inputBg,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.semantic.success.bg,
  },

  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.brand,
  },

  photoShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.overlay.modal,
  },

  photoOccurrenceTag: {
    position: "absolute",
    left: 14,
    bottom: 14,
    maxWidth: "58%",
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    gap: 6,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
  },

  photoOccurrenceTagText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.surface,
  },

  photoActions: {
    position: "absolute",
    right: 14,
    bottom: 14,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  photoCommentButton: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,

    backgroundColor: "rgba(255, 255, 255, 0.92)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",
  },

  photoCommentButtonPressed: {
    opacity: 0.82,

    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  photoIdTag: {
    minHeight: 38,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 10,

    borderRadius: 12,

    backgroundColor:
      "rgba(255, 255, 255, 0.92)",
  },

  photoIdTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.textTitle,
  },

  heroContent: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 19,
  },

  heroHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  heroHeadingText: {
    flex: 1,
    minWidth: 0,
  },

  animalName: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: theme.colors.textTitle,
  },

  animalBreed: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.textBody,
  },

  statusBadge: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderRadius: 100,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  occurrenceSummary: {
    marginTop: 16,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
  },

  summaryRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  summaryIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },

  summaryContent: {
    flex: 1,
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  summaryValue: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  summaryDivider: {
    height: 1,
    marginLeft: 57,
    backgroundColor: theme.colors.borderAlpha.faint,
  },

  badgeRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  urgencyBadge: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
    borderRadius: 100,
  },

  urgencyText: {
    fontSize: 10,
    fontWeight: "800",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionHeaderContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 9,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: theme.colors.textTitle,
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.textBody,
  },

  detailsCard: {
    overflow: "hidden",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  detailRow: {
    minHeight: 69,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  detailIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 13,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  detailContent: {
    flex: 1,
    minWidth: 0,
  },

  detailLabel: {
    marginBottom: 2,
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textBody,
  },

  detailValue: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },

  detailDivider: {
    height: 1,
    marginLeft: 52,
    backgroundColor: theme.colors.borderAlpha.faint,
  },

  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
  },

  alertCardDanger: {
    backgroundColor: theme.colors.semantic.danger.bg,
    borderColor: "rgba(235, 87, 87, 0.16)",
  },

  alertCardNeutral: {
    backgroundColor: theme.colors.surface,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  alertIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },

  alertIconDanger: {
    backgroundColor: theme.colors.surface,
  },

  alertIconNeutral: {
    backgroundColor: theme.colors.semantic.success.bg,
  },

  alertContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },

  alertTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  alertText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.textBody,
  },

  specialCareCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    backgroundColor: theme.colors.semantic.success.bg,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
  },

  specialCareIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: theme.colors.surface,
  },

  specialCareContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },

  specialCareTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.brand,
  },

  specialCareText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.textBody,
  },

  observationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.05)",
    ...theme.shadows.elevation1,
  },

  observationIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 13,
    backgroundColor: theme.colors.semantic.success.bg,
  },

  observationText: {
    flex: 1,
    paddingTop: 2,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
    color: theme.colors.textTitle,
  },

  managementSection: {
    marginBottom: 20,
  },

  managementActions: {
    gap: 10,
  },

  managementButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.18)",
    borderRadius: 15,
    backgroundColor: theme.colors.surface,
  },

  managementDeleteButton: {
    borderColor: "rgba(185, 28, 28, 0.18)",
    backgroundColor: theme.colors.semantic.danger.bg,
  },

  managementButtonDisabled: {
    opacity: 0.55,
  },

  managementButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.brand,
  },

  managementDeleteButtonText: {
    color: theme.colors.semantic.danger.text,
  },

  footer: {
    marginTop: 2,
    marginBottom: 8,
  },

  footerLine: {
    height: 1,
    marginBottom: 18,
    backgroundColor: theme.colors.borderAlpha.faint,
  },

  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  footerText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});

