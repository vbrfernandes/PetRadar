import { StyleSheet } from "react-native";

import { theme } from "../../../../theme";

export const petCardStyles = StyleSheet.create({
    petCard: {
        minHeight: 84,
        marginBottom: 10,
        padding: 12,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.borderAlpha.faint,
        ...theme.shadows.elevation1,
    },
    petImageWrapper: {
        width: 58,
        height: 58,
        borderRadius: 18,
        overflow: "hidden",
    },
    petImage: {
        width: "100%",
        height: "100%",
    },
    petPlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.semantic.success.bg,
    },
    petInfo: {
        flex: 1,
        marginLeft: 12,
    },
    petName: {
        fontSize: 15,
        fontWeight: "800",
        color: theme.colors.textTitle,
    },
    petMeta: {
        marginTop: 3,
        fontSize: 12,
        color: theme.colors.textBody,
    },
    petSize: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: "600",
        color: theme.colors.brand,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
});
