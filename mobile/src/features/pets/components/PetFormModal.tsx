import React, { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import { theme } from "../../../theme/colors";

import { petService } from "../services/petService";
import type { Pet } from "../types/pet.types";

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

const COLORS = {
    primary: theme.colors.brand,
    surface: theme.colors.surface,
    textTitle: theme.colors.textTitle,
    textBody: theme.colors.textBody,
    border: theme.colors.inputBg,
    successBg: theme.colors.semantic.success.bg,
    white: "#FFFFFF",
    muted: "#94A3B8",
    soft: "#F8FAFC",
};

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
                            <Ionicons name="close" size={21} color={COLORS.textTitle} />
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
                                        color={COLORS.primary}
                                    />

                                    <Text style={styles.photoTitle}>Adicionar foto</Text>

                                    <Text style={styles.photoHint}>Toque para escolher</Text>
                                </>
                            )}
                        </Pressable>

                        <Text style={styles.label}>Nome *</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="paw-outline" size={19} color={COLORS.primary} />

                            <TextInput
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Nome do pet"
                                placeholderTextColor={COLORS.muted}
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
                                        color={especie === item ? COLORS.white : COLORS.primary}
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
                                        color={COLORS.primary}
                                    />

                                    <TextInput
                                        value={especieOutro}
                                        onChangeText={setEspecieOutro}
                                        placeholder="Ex.: Coelho, ave, furão..."
                                        placeholderTextColor={COLORS.muted}
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
                                color={COLORS.primary}
                            />

                            <TextInput
                                value={raca}
                                onChangeText={setRaca}
                                placeholder="Ex.: Border Collie"
                                placeholderTextColor={COLORS.muted}
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
                                color={COLORS.primary}
                            />

                            <TextInput
                                value={cor}
                                onChangeText={setCor}
                                placeholder="Ex.: Preto e branco"
                                placeholderTextColor={COLORS.muted}
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
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={21}
                                        color={COLORS.white}
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

const styles = StyleSheet.create({
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

        backgroundColor: COLORS.surface,
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
        color: COLORS.textTitle,
    },

    modalSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: COLORS.textBody,
    },

    closeButton: {
        width: 40,
        height: 40,

        borderRadius: 20,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: COLORS.soft,
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
        borderColor: COLORS.successBg,

        backgroundColor: COLORS.soft,
    },

    selectedPhoto: {
        width: "100%",
        height: "100%",
    },

    photoTitle: {
        marginTop: 5,

        fontSize: 11,
        fontWeight: "700",

        color: COLORS.primary,
    },

    photoHint: {
        marginTop: 2,

        fontSize: 9,

        color: COLORS.textBody,
    },

    label: {
        marginTop: 15,
        marginBottom: 7,

        fontSize: 12,
        fontWeight: "700",

        color: COLORS.textTitle,
    },

    inputContainer: {
        minHeight: 52,

        paddingHorizontal: 14,

        borderRadius: 14,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.soft,
    },

    input: {
        flex: 1,

        marginLeft: 10,

        fontSize: 14,

        color: COLORS.textTitle,
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
        borderColor: COLORS.border,

        backgroundColor: COLORS.soft,
    },

    sizeButton: {
        flex: 1,

        minHeight: 44,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 14,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.soft,
    },

    optionButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },

    optionText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textBody,
    },

    optionTextActive: {
        color: COLORS.white,
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

        backgroundColor: COLORS.primary,

        ...theme.shadows.buttonGlow,
    },

    saveButtonDisabled: {
        opacity: 0.6,
    },

    saveButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: COLORS.white,
    },
});
