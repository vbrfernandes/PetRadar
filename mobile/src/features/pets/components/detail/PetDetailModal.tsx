import React from "react";

import { Image, Modal, Pressable, Text, View } from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { petDetailStyles as styles } from "../../styles/detail/petDetail.styles";
import type { Pet } from "../../types/pet.types";
import PetDetailRow from "./PetDetailRow";
import PetLostButton from "./PetLostButton";

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

                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons
                                name="close"
                                size={21}
                                color={theme.colors.textTitle}
                            />
                        </Pressable>
                    </View>

                    {pet && (
                        <>
                            <View style={styles.detailPhotoWrapper}>
                                {pet.foto ? (
                                    <Image
                                        source={{ uri: pet.foto }}
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
                                <PetLostButton
                                    pet={pet}
                                    onReportLost={onReportLost}
                                />
                                <PetDetailRow
                                    label="Espécie"
                                    value={pet.especie}
                                />
                                <PetDetailRow
                                    label="Raça"
                                    value={pet.raca || "Não informada"}
                                />
                                <PetDetailRow
                                    label="Sexo"
                                    value={pet.sexo || "Não informado"}
                                />
                                <PetDetailRow
                                    label="Cor"
                                    value={pet.cor || "Não informada"}
                                />
                                <PetDetailRow
                                    label="Porte"
                                    value={pet.porte || "Não informado"}
                                />
                                <PetDetailRow
                                    label="Idade"
                                    value={pet.idade || "Não informada"}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}
