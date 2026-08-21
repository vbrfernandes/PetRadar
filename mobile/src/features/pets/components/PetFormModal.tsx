import React, { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import { theme } from "../../../theme/colors";

import { petService } from "../services/petService";
import type { Pet } from "../types/pet.types";
import {
    petFormModalStyles as styles,
} from "../styles/pets.styles";

type TipoEspecie = "Cachorro" | "Gato" | "Outro";

interface FotoSelecionada {
    uri: string;
    nome: string;
    tipo: string;
}

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
    const [saving, setSaving] = useState(false);

    const [nome, setNome] = useState("");

    const [especie, setEspecie] = useState<TipoEspecie>("Cachorro");

    // ALTERE AQUI
    const [especieOutro, setEspecieOutro] = useState("");

    const [raca, setRaca] = useState("");

    // ALTERE AQUI
    const [sexo, setSexo] = useState("");

    // ALTERE AQUI
    const [cor, setCor] = useState("");

    const [porte, setPorte] = useState<"Pequeno" | "Médio" | "Grande">("Médio");

    // ALTERE AQUI
    const [idade, setIdade] = useState("");

    const [foto, setFoto] = useState<FotoSelecionada | null>(null);

    // ==========================================================
    // LIMPAR FORMULÁRIO
    // ==========================================================

    const limparFormulario = () => {
        setNome("");

        setEspecie("Cachorro");
        setEspecieOutro("");

        setRaca("");
        setSexo("");
        setCor("");

        setPorte("Médio");
        setIdade("");

        setFoto(null);
    };

    const fecharFormulario = () => {
        limparFormulario();
        onClose();
    };

    // ==========================================================
    // FOTO
    // ==========================================================

    const selecionarFoto = async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Permissão necessária",
                    "Permita o acesso às fotos para adicionar uma imagem do pet.",
                );

                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets?.[0]) {
                return;
            }

            const asset = result.assets[0];

            const nomeArquivo =
                asset.fileName || asset.uri.split("/").pop() || "pet.jpg";

            setFoto({
                uri: asset.uri,

                nome: nomeArquivo,

                tipo: asset.mimeType || "image/jpeg",
            });
        } catch (error) {
            console.error("[RegistrarPet] Erro ao selecionar foto:", error);

            Alert.alert("Erro", "Não foi possível selecionar a foto.");
        }
    };

    // ==========================================================
    // CADASTRAR
    // ==========================================================

    const cadastrarPet = async () => {
        const nomeNormalizado = nome.trim();

        if (!nomeNormalizado) {
            Alert.alert("Nome obrigatório", "Informe o nome do pet.");

            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("nome", nomeNormalizado);

            const especieFinal =
                especie === 'Outro'
                    ? especieOutro.trim()
                    : especie;

            if (!especieFinal) {
                Alert.alert(
                    'Espécie obrigatória',
                    'Informe qual é o animal.'
                );

                return;
            }

            formData.append(
                'especie',
                especieFinal
            );

            if (raca.trim()) {
                formData.append(
                    'raca',
                    raca.trim()
                );
            }


            if (sexo) {
                formData.append(
                    'sexo',
                    sexo
                );
            }


            if (cor.trim()) {
                formData.append(
                    'cor',
                    cor.trim()
                );
            }

            formData.append(
                'porte',
                porte
            );


            if (idade) {
                formData.append(
                    'idade',
                    idade
                );
            }

            if (foto) {
                formData.append("foto", {
                    uri: foto.uri,
                    name: foto.nome,
                    type: foto.tipo,
                } as any);
            }

            const response = await petService.createPet(formData);

            onPetCreated(response.data);

            fecharFormulario();

            Alert.alert(
                "Pet cadastrado",
                `${response.data.nome} foi adicionado ao seu perfil.`,
            );
        } catch (error: any) {
            console.error(
                "[RegistrarPet] Erro ao cadastrar pet:",
                error?.response?.status,
                error?.response?.data || error?.message,
            );

            Alert.alert(
                "Não foi possível cadastrar",
                error?.response?.data?.detail ||
                "O cadastro do pet não pôde ser concluído.",
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
                            <Ionicons name="close" size={21} color={theme.colors.textTitle} />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Pressable onPress={selecionarFoto} style={styles.photoSelector}>
                            {foto ? (
                                <Image
                                    source={{
                                        uri: foto.uri,
                                    }}
                                    style={styles.selectedPhoto}
                                />
                            ) : (
                                <>
                                    <MaterialCommunityIcons
                                        name="camera-plus-outline"
                                        size={34}
                                        color={theme.colors.brand}
                                    />

                                    <Text style={styles.photoTitle}>Adicionar foto</Text>

                                    <Text style={styles.photoHint}>Toque para escolher</Text>
                                </>
                            )}
                        </Pressable>

                        <Text style={styles.label}>Nome *</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="paw-outline" size={19} color={theme.colors.brand} />

                            <TextInput
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Nome do pet"
                                placeholderTextColor={theme.colors.muted}
                                style={styles.input}
                                autoCapitalize="words"
                            />
                        </View>

                        <Text style={styles.label}>Espécie *</Text>

                        <View style={styles.optionContainer}>
                            {(["Cachorro", "Gato", "Outro"] as const).map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => setEspecie(item)}
                                    style={[
                                        styles.optionButton,
                                        especie === item && styles.optionButtonActive,
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name={
                                            item === "Cachorro"
                                                ? "dog"
                                                : item === "Gato"
                                                    ? "cat"
                                                    : "paw-outline"
                                        }
                                        size={20}
                                        color={especie === item ? theme.colors.surface : theme.colors.brand}
                                    />

                                    <Text
                                        style={[
                                            styles.optionText,
                                            especie === item && styles.optionTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {especie === "Outro" && (
                            <>
                                <Text style={styles.label}>Qual animal? *</Text>

                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons
                                        name="paw-outline"
                                        size={19}
                                        color={theme.colors.brand}
                                    />

                                    <TextInput
                                        value={especieOutro}
                                        onChangeText={setEspecieOutro}
                                        placeholder="Ex.: Coelho, ave, furão..."
                                        placeholderTextColor={theme.colors.muted}
                                        style={styles.input}
                                        autoCapitalize="sentences"
                                        maxLength={50}
                                    />
                                </View>
                            </>
                        )}
                        <Text style={styles.label}>Raça</Text>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons
                                name="paw-outline"
                                size={19}
                                color={theme.colors.brand}
                            />

                            <TextInput
                                value={raca}
                                onChangeText={setRaca}
                                placeholder="Ex.: Border Collie"
                                placeholderTextColor={theme.colors.muted}
                                style={styles.input}
                                autoCapitalize="words"
                            />
                        </View>

                        <Text style={styles.label}>Sexo</Text>

                        <View style={styles.optionContainer}>
                            {["Masculino", "Feminino", "Não sei"].map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => setSexo(item)}
                                    style={[
                                        styles.sizeButton,
                                        sexo === item && styles.optionButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            sexo === item && styles.optionTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.label}>Cor</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="color-palette-outline"
                                size={19}
                                color={theme.colors.brand}
                            />

                            <TextInput
                                value={cor}
                                onChangeText={setCor}
                                placeholder="Ex.: Preto e branco"
                                placeholderTextColor={theme.colors.muted}
                                style={styles.input}
                                autoCapitalize="sentences"
                                maxLength={50}
                            />
                        </View>

                        <Text style={styles.label}>Porte</Text>

                        <View style={styles.optionContainer}>
                            {(["Pequeno", "Médio", "Grande"] as const).map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => setPorte(item)}
                                    style={[
                                        styles.sizeButton,
                                        porte === item && styles.optionButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            porte === item && styles.optionTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.label}>Idade</Text>

                        <View style={styles.optionContainer}>
                            {["Filhote", "Adulto", "Idoso"].map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => setIdade(item)}
                                    style={[
                                        styles.sizeButton,
                                        idade === item && styles.optionButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            idade === item && styles.optionTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable
                            onPress={cadastrarPet}
                            disabled={saving}
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        >
                            {saving ? (
                                <ActivityIndicator color={theme.colors.surface} />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={21}
                                        color={theme.colors.surface}
                                    />

                                    <Text style={styles.saveButtonText}>Cadastrar pet</Text>
                                </>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}