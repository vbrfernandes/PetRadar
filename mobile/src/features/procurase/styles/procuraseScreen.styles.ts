import { StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";

export { feedButtonPressedStyle as procuraSeButtonPressedStyle } from "../../feed/styles/feedScreen.styles";

export const procuraSeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.globalMargin,
    paddingBottom: 125,
  },
});
