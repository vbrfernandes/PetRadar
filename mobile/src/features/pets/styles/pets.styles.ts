import { StyleSheet } from "react-native";

import { theme } from "../../../theme/colors";


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

        backgroundColor:
            theme.colors.semantic.success.bg,
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

        transform: [
            {
                scale: 0.99,
            },
        ],
    },
});

export const petDetailModalStyles = StyleSheet.create({
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

        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    lostPetButton: {
        minHeight: 62,

        marginTop: 4,

        paddingHorizontal: 16,

        borderRadius: 16,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor:
            theme.colors.semantic.danger.text,

        ...theme.shadows.elevation1,
    },

    lostPetButtonContent: {
        flex: 1,

        marginLeft: 12,
    },

    lostPetButtonTitle: {
        fontSize: 13,
        fontWeight: '800',

        color: theme.colors.surface,
    },

    lostPetButtonSubtitle: {
        marginTop: 2,

        fontSize: 10,

        color:
            'rgba(255,255,255,0.78)',
    },
});

export const petFormModalStyles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,

        justifyContent: "flex-end",

        backgroundColor: "rgba(15,23,42,0.56)",
    },

    modalContainer: {
        maxHeight: "88%",

        padding: 20,

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,

        backgroundColor: theme.colors.surface,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: theme.colors.textTitle,
    },

    modalSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: theme.colors.textBody,
    },

    closeButton: {
        width: 40,
        height: 40,

        borderRadius: 20,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: theme.colors.surfaceSoft,
    },

    photoSelector: {
        width: 116,
        height: 116,

        alignSelf: "center",

        marginBottom: 22,

        borderRadius: 58,

        alignItems: "center",
        justifyContent: "center",

        overflow: "hidden",

        borderWidth: 2,
        borderColor: theme.colors.semantic.success.bg,

        backgroundColor: theme.colors.surfaceSoft,
    },

    selectedPhoto: {
        width: "100%",
        height: "100%",
    },

    photoTitle: {
        marginTop: 5,

        fontSize: 11,
        fontWeight: "700",

        color: theme.colors.brand,
    },

    photoHint: {
        marginTop: 2,

        fontSize: 9,

        color: theme.colors.textBody,
    },

    label: {
        marginTop: 15,
        marginBottom: 7,

        fontSize: 12,
        fontWeight: "700",

        color: theme.colors.textTitle,
    },

    inputContainer: {
        minHeight: 52,

        paddingHorizontal: 14,

        borderRadius: 14,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: theme.colors.inputBg,

        backgroundColor: theme.colors.surfaceSoft,
    },

    input: {
        flex: 1,

        marginLeft: 10,

        fontSize: 14,

        color: theme.colors.textTitle,
    },

    optionContainer: {
        flexDirection: "row",
        gap: 8,
    },

    optionButton: {
        flex: 1,

        minHeight: 48,

        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 7,

        borderRadius: 14,

        borderWidth: 1,
        borderColor: theme.colors.inputBg,

        backgroundColor: theme.colors.surfaceSoft,
    },

    sizeButton: {
        flex: 1,

        minHeight: 44,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 14,

        borderWidth: 1,
        borderColor: theme.colors.inputBg,

        backgroundColor: theme.colors.surfaceSoft,
    },

    optionButtonActive: {
        borderColor: theme.colors.brand,
        backgroundColor: theme.colors.brand,
    },

    optionText: {
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.textBody,
    },

    optionTextActive: {
        color: theme.colors.surface,
    },

    saveButton: {
        minHeight: 54,

        marginTop: 26,
        marginBottom: 20,

        borderRadius: 16,

        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 8,

        backgroundColor: theme.colors.brand,

        ...theme.shadows.buttonGlow,
    },

    saveButtonDisabled: {
        opacity: 0.6,
    },

    saveButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: theme.colors.surface,
    },
});

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

        transform: [
            {
                scale: 0.99,
            },
        ],
    },

});