import { StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";

export const profileCommonStyles = StyleSheet.create({
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
});
