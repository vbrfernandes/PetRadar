import { StyleSheet } from "react-native";

import { theme } from "../../../../theme/colors";

export const petDetailStyles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(15,23,42,0.56)",
    },
    detailContainer: {
        padding: 20,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: theme.colors.surface,
    },
    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.textTitle,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surfaceSoft,
    },
    detailPhotoWrapper: {
        width: 130,
        height: 130,
        alignSelf: "center",
        marginBottom: 14,
        borderRadius: 65,
        overflow: "hidden",
        backgroundColor: theme.colors.semantic.success.bg,
    },
    detailPhoto: {
        width: "100%",
        height: "100%",
    },
    detailPlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    detailPetName: {
        marginBottom: 18,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "800",
        color: theme.colors.textTitle,
    },
    detailCard: {
        marginBottom: 16,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: theme.colors.surfaceSoft,
    },
    detailRow: {
        minHeight: 54,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(15,23,42,0.06)",
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: theme.colors.textBody,
    },
    detailValue: {
        maxWidth: "60%",
        textAlign: "right",
        fontSize: 13,
        fontWeight: "700",
        color: theme.colors.textTitle,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    lostPetButton: {
        minHeight: 62,
        marginTop: 4,
        paddingHorizontal: 16,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.semantic.danger.text,
        ...theme.shadows.elevation1,
    },
    lostPetButtonContent: {
        flex: 1,
        marginLeft: 12,
    },
    lostPetButtonTitle: {
        fontSize: 13,
        fontWeight: "800",
        color: theme.colors.surface,
    },
    lostPetButtonSubtitle: {
        marginTop: 2,
        fontSize: 10,
        color: "rgba(255,255,255,0.78)",
    },
});
