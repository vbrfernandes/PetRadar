import React from "react";

import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { usePetForm } from "../../hooks/usePetForm";
import { usePetPhoto } from "../../hooks/usePetPhoto";
import { petService } from "../../services/petService";
import { petFormStyles as styles } from "../../styles/form/petForm.styles";
import type { Pet } from "../../types/pet.types";
import {
    getPetErrorContext,
    getPetErrorMessage,
} from "../../utils/petErrors";
import { buildPetFormData } from "../../utils/petFormData";
import PetBasicInfoSection from "./sections/PetBasicInfoSection";
import PetCharacteristicsSection from "./sections/PetCharacteristicsSection";
import PetPhotoSection from "./sections/PetPhotoSection";

interface PetFormModalProps {
    visible: boolean;
    onClose: () => void;
    onPetCreated: (pet: Pet) => void;
}

export default function PetFormModal({
    visible,
    onClose,
    onPetCreated,
}: PetFormModalProps) {
    const {
        values,
        saving,
        setSaving,
        setField,
        resetForm,
        validateName,
        validateSpecies,
    } = usePetForm();
    const { photo, selectPhoto, clearPhoto } = usePetPhoto();

    const fecharFormulario = () => {
        resetForm();
        clearPhoto();
        onClose();
    };

    const cadastrarPet = async () => {
        if (!validateName()) {
            return;
        }

        try {
            setSaving(true);

            if (!validateSpecies()) {
                return;
            }

            const formData = buildPetFormData(values, photo);
            const response = await petService.createPet(formData);

            onPetCreated(response.data);
            fecharFormulario();

            Alert.alert(
                "Pet cadastrado",
                `${response.data.nome} foi adicionado ao seu perfil.`,
            );
        } catch (error: unknown) {
            const errorContext = getPetErrorContext(error);

            console.error(
                "[RegistrarPet] Erro ao cadastrar pet:",
                errorContext.status,
                errorContext.details,
            );

            Alert.alert(
                "Não foi possível cadastrar",
                getPetErrorMessage(
                    error,
                    "O cadastro do pet não pôde ser concluído.",
                ),
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={fecharFormulario}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalTitle}>Novo pet</Text>
                            <Text style={styles.modalSubtitle}>
                                Adicione um pet ao seu perfil.
                            </Text>
                        </View>

                        <Pressable
                            onPress={fecharFormulario}
                            accessibilityLabel="Fechar cadastro"
                            style={styles.closeButton}
                        >
                            <Ionicons
                                name="close"
                                size={21}
                                color={theme.colors.textTitle}
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <PetPhotoSection
                            photo={photo}
                            onSelectPhoto={selectPhoto}
                        />
                        <PetBasicInfoSection
                            values={values}
                            setField={setField}
                        />
                        <PetCharacteristicsSection
                            values={values}
                            setField={setField}
                        />

                        <Pressable
                            onPress={cadastrarPet}
                            disabled={saving}
                            style={[
                                styles.saveButton,
                                saving && styles.saveButtonDisabled,
                            ]}
                        >
                            {saving ? (
                                <ActivityIndicator
                                    color={theme.colors.surface}
                                />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={21}
                                        color={theme.colors.surface}
                                    />
                                    <Text style={styles.saveButtonText}>
                                        Cadastrar pet
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
