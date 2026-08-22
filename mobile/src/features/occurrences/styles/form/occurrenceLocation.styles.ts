import { StyleSheet } from "react-native";
import { theme } from "../../../../theme";

import { occurrenceFormSharedStyles } from "./occurrenceFormControls.styles";
export const locationSectionStyles = StyleSheet.create({
  ...occurrenceFormSharedStyles,

  addressInput: {
    alignItems: "flex-start",
    paddingTop: 3,
    paddingBottom: 3,
  },

  addressLoading: {
    marginTop: 14,
    marginLeft: 8,
  },

  addressSuggestions: {
    marginTop: -4,
    marginBottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.brandAlpha.medium,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadows.elevation1,
  },

  addressSuggestionItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  addressSuggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  addressSuggestionContent: {
    flex: 1,
    paddingRight: 8,
  },

  addressSuggestionTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },

  addressSuggestionSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 17,
  },

  addressSuggestionDivider: {
    height: 1,
    marginLeft: 58,
    backgroundColor: theme.colors.brandAlpha.soft,
  },

  locationButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.14)",
    backgroundColor: "rgba(31, 92, 77, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },

  locationButtonText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },
});

