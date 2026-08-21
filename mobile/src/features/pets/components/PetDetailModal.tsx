import React from "react";

import {
    Image,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";

import type { Pet } from "../types/pet.types";
import {
    petDetailModalStyles as styles,
} from "../styles/pets.styles";

interface PetDetailModalProps {
    pet: Pet | null;
    onClose: () => void;
    onReportLost: (pet: Pet) => void;
}



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
                            <Ionicons name="close" size={21} color={theme.colors.textTitle} />
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
                                            color={theme.colors.brand}
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
                                        color={theme.colors.surface}
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
                                        color={theme.colors.surface}
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