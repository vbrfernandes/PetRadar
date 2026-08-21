import { StyleSheet } from "react-native";
import { theme } from "../../../../theme";

export const photoSectionStyles = StyleSheet.create({
  photoArea: {
    height: 210,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(31, 92, 77, 0.22)",
    backgroundColor: "rgba(31, 92, 77, 0.035)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  photoAreaFilled: {
    borderStyle: "solid",
    borderColor: "rgba(31, 92, 77, 0.12)",
  },

  photoIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(31, 92, 77, 0.09)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  photoTitle: {
    color: theme.colors.textTitle,
    fontSize: 15,
    fontWeight: "800",
  },

  photoDescription: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 4,
  },

  photoPreview: {
    width: "100%",
    height: "100%",
  },

  photoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
  },

  photoOverlayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  photoOverlayText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.82,
  },
});

export const reviewSectionStyles = StyleSheet.create({
  reviewCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.soft,
    overflow: "hidden",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  reviewHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.brandAlpha.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  reviewHeaderContent: {
    flex: 1,
  },

  reviewHeaderTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  reviewHeaderText: {
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },

  reviewDivider: {
    height: 1,
    backgroundColor: theme.colors.brandAlpha.soft,
  },

  reviewItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31, 92, 77, 0.06)",
  },

  reviewLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 3,
  },

  reviewValue: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
});

