import React from "react";

import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";

import type { Pet } from "../types/pet.types";

interface PetDetailModalProps {
    pet: Pet | null;
    onClose: () => void;
    onReportLost: (pet: Pet) => void;
}

const COLORS = {
    primary: theme.colors.brand,
    surface: theme.colors.surface,
    textTitle: theme.colors.textTitle,
    textBody: theme.colors.textBody,
    successBg: theme.colors.semantic.success.bg,
    danger: theme.colors.semantic.danger.text,
    white: "#FFFFFF",
    soft: "#F8FAFC",
};

export default function PetDetailModal({
    pet,
    onClose,
    onReportLost,
}: PetDetailModalProps) {
    return (
        <Modal
            visible={pet !== null}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.detailContainer}>
                    <View style={styles.detailHeader}>
                        <Text style={styles.detailTitle}>Detalhes do pet</Text>

                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={21} color={COLORS.textTitle} />
                        </Pressable>
                    </View>

                    {pet && (
                        <>
                            <View style={styles.detailPhotoWrapper}>
                                {pet.foto ? (
                                    <Image
                                        source={{
                                            uri: pet.foto,
                                        }}
                                        style={styles.detailPhoto}
                                    />
                                ) : (
                                    <View style={styles.detailPlaceholder}>
                                        <MaterialCommunityIcons
                                            name="paw"
                                            size={48}
                                            color={COLORS.primary}
                                        />
                                    </View>
                                )}
                            </View>

                            <Text style={styles.detailPetName}>{pet.nome}</Text>

                            <View style={styles.detailCard}>
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`Informar ${pet.nome} como perdido`}
                                    accessibilityHint="Abre uma ocorrência de pet perdido já preenchida com os dados deste animal"
                                    onPress={() =>
                                        onReportLost(
                                            pet
                                        )
                                    }
                                    style={({ pressed }) => [
                                        styles.lostPetButton,
                                        pressed &&
                                        styles.buttonPressed,
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name="alert-circle-outline"
                                        size={22}
                                        color={COLORS.white}
                                    />

                                    <View
                                        style={
                                            styles.lostPetButtonContent
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.lostPetButtonTitle
                                            }
                                        >
                                            INFORMAR COMO PERDIDO
                                        </Text>

                                        <Text
                                            style={
                                                styles.lostPetButtonSubtitle
                                            }
                                        >
                                            Criar ocorrência usando estes dados
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={20}
                                        color={COLORS.white}
                                    />
                                </Pressable>
                                <DetailRow
                                    label="Espécie"
                                    value={pet.especie}
                                />

                                <DetailRow
                                    label="Raça"
                                    value={
                                        pet.raca ||
                                        'Não informada'
                                    }
                                />

                                <DetailRow
                                    label="Sexo"
                                    value={
                                        pet.sexo ||
                                        'Não informado'
                                    }
                                />

                                <DetailRow
                                    label="Cor"
                                    value={
                                        pet.cor ||
                                        'Não informada'
                                    }
                                />

                                <DetailRow
                                    label="Porte"
                                    value={
                                        pet.porte ||
                                        'Não informado'
                                    }
                                />

                                <DetailRow
                                    label="Idade"
                                    value={
                                        pet.idade ||
                                        'Não informada'
                                    }
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

interface DetailRowProps {
    label: string;
    value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>

            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,

        justifyContent: "flex-end",

        backgroundColor: "rgba(15,23,42,0.56)",
    },

    detailContainer: {
        padding: 20,

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,

        backgroundColor: COLORS.surface,
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
        color: COLORS.textTitle,
    },

    closeButton: {
        width: 40,
        height: 40,

        borderRadius: 20,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: COLORS.soft,
    },

    detailPhotoWrapper: {
        width: 130,
        height: 130,

        alignSelf: "center",

        marginBottom: 14,

        borderRadius: 65,

        overflow: "hidden",

        backgroundColor: COLORS.successBg,
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

        color: COLORS.textTitle,
    },

    detailCard: {
        marginBottom: 16,

        borderRadius: 18,

        overflow: "hidden",

        backgroundColor: COLORS.soft,
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
        color: COLORS.textBody,
    },

    detailValue: {
        maxWidth: "60%",

        textAlign: "right",

        fontSize: 13,
        fontWeight: "700",

        color: COLORS.textTitle,
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
            COLORS.danger,

        ...theme.shadows.elevation1,
    },

    lostPetButtonContent: {
        flex: 1,

        marginLeft: 12,
    },

    lostPetButtonTitle: {
        fontSize: 13,
        fontWeight: '800',

        color: COLORS.white,
    },

    lostPetButtonSubtitle: {
        marginTop: 2,

        fontSize: 10,

        color:
            'rgba(255,255,255,0.78)',
    },
});
