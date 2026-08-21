import React, { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
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
import {
    petsTabStyles as styles,
} from "../styles/pets.styles";



export default function PetsTab() {
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
                <ActivityIndicator color={theme.colors.brand} />

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
                                <Ionicons name="add" size={22} color={theme.colors.surface} />
                            </View>

                            <View style={styles.addButtonContent}>
                                <Text style={styles.addButtonTitle}>Adicionar pet</Text>

                                <Text style={styles.addButtonSubtitle}>
                                    Cadastre um novo animal
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={20} color={theme.colors.surface} />
                        </Pressable>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <MaterialCommunityIcons
                                name="paw-outline"
                                size={36}
                                color={theme.colors.brand}
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