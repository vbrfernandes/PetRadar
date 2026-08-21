import { StyleSheet } from "react-native";

import { theme } from "../../../theme";

export const petsTabStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.textTitle,
    },
    subtitle: {
        marginTop: 3,
        fontSize: 12,
        color: theme.colors.textBody,
    },
    countBadge: {
        minWidth: 30,
        height: 30,
        paddingHorizontal: 8,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.semantic.success.bg,
    },
    countText: {
        fontSize: 12,
        fontWeight: "800",
        color: theme.colors.brand,
    },
    addButton: {
        minHeight: 70,
        marginBottom: 18,
        paddingHorizontal: 14,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.brand,
        ...theme.shadows.elevation1,
    },
    addButtonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.16)",
    },
    addButtonContent: {
        flex: 1,
        marginLeft: 12,
    },
    addButtonTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: theme.colors.surface,
    },
    addButtonSubtitle: {
        marginTop: 2,
        fontSize: 11,
        color: "rgba(255,255,255,0.78)",
    },
    stateContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
    },
    stateText: {
        marginTop: 10,
        fontSize: 13,
        color: theme.colors.textBody,
    },
    emptyContainer: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 36,
    },
    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
        backgroundColor: theme.colors.semantic.success.bg,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: theme.colors.textTitle,
    },
    emptyText: {
        marginTop: 6,
        textAlign: "center",
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.textBody,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
});
