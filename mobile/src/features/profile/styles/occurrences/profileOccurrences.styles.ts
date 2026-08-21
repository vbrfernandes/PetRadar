import { StyleSheet } from "react-native";

import { theme } from "../../../../theme";

export const profileOccurrencesStyles = StyleSheet.create({
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
