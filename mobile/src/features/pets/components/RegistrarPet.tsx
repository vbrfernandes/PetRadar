import React, { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";

import { useNavigation } from '@react-navigation/native';

import type {
    BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

import type {
    AppTabParamList,
} from '../../../navigation/navigation.types';

import { petService } from "../services/petService";
import type { Pet } from "../types/pet.types";
import PetCard from "./PetCard";
import PetDetailModal from "./PetDetailModal";
import PetFormModal from "./PetFormModal";

const COLORS = {
    primary: theme.colors.brand,
    action: theme.colors.action,

    background: theme.colors.background,
    textTitle: theme.colors.textTitle,
    textBody: theme.colors.textBody,

    success: theme.colors.semantic.success.text,
    successBg: theme.colors.semantic.success.bg,

    danger: theme.colors.semantic.danger.text,
    dangerBg: theme.colors.semantic.danger.bg,

    white: "#FFFFFF",
};

export default function RegistrarPet() {
    const navigation =
        useNavigation<
            BottomTabNavigationProp<AppTabParamList>
        >();

    const [pets, setPets] = useState<Pet[]>([]);

    const [loading, setLoading] = useState(true);

    const [formVisible, setFormVisible] = useState(false);

    const [petSelecionado, setPetSelecionado] = useState<Pet | null>(null);

    // ==========================================================
    // CARREGAR PETS
    // ==========================================================

    const carregarPets = useCallback(async () => {
        try {
            setLoading(true);

            const response = await petService.getMyPets();

            setPets(Array.isArray(response.data) ? response.data : []);
        } catch (error: any) {
            console.error(
                "[RegistrarPet] Erro ao carregar pets:",
                error?.response?.status,
                error?.response?.data || error?.message,
            );

            Alert.alert(
                "Não foi possível carregar",
                error?.response?.data?.detail || "Não foi possível carregar seus pets.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void carregarPets();
    }, [carregarPets]);

    const adicionarPetCriado = (
        pet: Pet,
    ) => {
        setPets((petsAtuais) => [
            pet,
            ...petsAtuais,
        ]);
    };

    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {
        return (
            <View style={styles.stateContainer}>
                <ActivityIndicator color={COLORS.primary} />

                <Text style={styles.stateText}>Carregando seus pets...</Text>
            </View>
        );
    }
    // ==========================================================
    // INFORMAR PET COMO PERDIDO
    // ==========================================================

    const informarComoPerdido = (
        pet: Pet
    ) => {
        setPetSelecionado(null);

        navigation.navigate(
            'CadastroOcorrencia',
            {
                pet: {
                    id_pet: pet.id_pet,
                    nome: pet.nome,
                    especie: pet.especie,
                    raca: pet.raca,
                    sexo: pet.sexo,
                    cor: pet.cor,
                    porte: pet.porte,
                    idade: pet.idade,
                    foto: pet.foto,
                },
            }
        );
    };

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <View style={styles.container}>
            <FlatList
                data={pets}
                keyExtractor={(item) => String(item.id_pet)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title}>Meus pets</Text>

                                <Text style={styles.subtitle}>
                                    Pets vinculados à sua conta.
                                </Text>
                            </View>

                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{pets.length}</Text>
                            </View>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Adicionar pet"
                            onPress={() => setFormVisible(true)}
                            style={({ pressed }) => [
                                styles.addButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <View style={styles.addButtonIcon}>
                                <Ionicons name="add" size={22} color={COLORS.white} />
                            </View>

                            <View style={styles.addButtonContent}>
                                <Text style={styles.addButtonTitle}>Adicionar pet</Text>

                                <Text style={styles.addButtonSubtitle}>
                                    Cadastre um novo animal
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                        </Pressable>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <MaterialCommunityIcons
                                name="paw-outline"
                                size={36}
                                color={COLORS.primary}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>

                        <Text style={styles.emptyText}>
                            Adicione seus pets para mantê-los vinculados ao seu perfil no
                            PetRadar.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <PetCard
                        pet={item}
                        onPress={() => setPetSelecionado(item)}
                    />
                )}
            />

            {/* ===================================================== */}
            {/* FORMULÁRIO */}
            {/* ===================================================== */}

            <PetFormModal
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                onPetCreated={adicionarPetCriado}
            />

            {/* ===================================================== */}
            {/* DETALHES DO PET */}
            {/* ===================================================== */}

            <PetDetailModal
                pet={petSelecionado}
                onClose={() => setPetSelecionado(null)}
                onReportLost={informarComoPerdido}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
        color: COLORS.textTitle,
    },

    subtitle: {
        marginTop: 3,
        fontSize: 12,
        color: COLORS.textBody,
    },

    countBadge: {
        minWidth: 30,
        height: 30,
        paddingHorizontal: 8,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.successBg,
    },

    countText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.primary,
    },

    addButton: {
        minHeight: 70,
        marginBottom: 18,
        paddingHorizontal: 14,

        borderRadius: 18,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: COLORS.primary,

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
        color: COLORS.white,
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
        color: COLORS.textBody,
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

        backgroundColor: COLORS.successBg,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.textTitle,
    },

    emptyText: {
        marginTop: 6,

        textAlign: "center",

        fontSize: 12,
        lineHeight: 18,

        color: COLORS.textBody,
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
