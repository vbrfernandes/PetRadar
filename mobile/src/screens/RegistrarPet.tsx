import React, { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
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

import api from "../services/api";
import { theme } from "../theme/colors";

import { useNavigation } from '@react-navigation/native';

import type {
    BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

import type {
    AppTabParamList,
} from '../../App';

interface Pet {
    id_pet: number;
    id_usuario: number;

    nome: string;
    especie: string;

    raca: string | null;

    // ALTERE AQUI
    sexo: string | null;

    // ALTERE AQUI
    cor: string | null;

    porte: string | null;

    // ALTERE AQUI
    idade: string | null;

    foto: string | null;
}

type TipoEspecie = "Cachorro" | "Gato" | "Outro";
interface FotoSelecionada {
    uri: string;
    nome: string;
    tipo: string;
}

const COLORS = {
    primary: theme.colors.brand,
    action: theme.colors.action,

    background: theme.colors.background,
    surface: theme.colors.surface,

    textTitle: theme.colors.textTitle,
    textBody: theme.colors.textBody,

    border: theme.colors.inputBg,

    success: theme.colors.semantic.success.text,
    successBg: theme.colors.semantic.success.bg,

    danger: theme.colors.semantic.danger.text,
    dangerBg: theme.colors.semantic.danger.bg,

    white: "#FFFFFF",
    muted: "#94A3B8",
    soft: "#F8FAFC",
};

export default function RegistrarPet() {
    const navigation =
        useNavigation<
            BottomTabNavigationProp<AppTabParamList>
        >();

    const [pets, setPets] = useState<Pet[]>([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [formVisible, setFormVisible] = useState(false);

    const [petSelecionado, setPetSelecionado] = useState<Pet | null>(null);

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
    // CARREGAR PETS
    // ==========================================================

    const carregarPets = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get<Pet[]>("/pets/meus");

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
        setFormVisible(false);
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

            const response = await api.post<Pet>("/pets/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setPets((petsAtuais) => [response.data, ...petsAtuais]);

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
                    <Pressable
                        onPress={() => setPetSelecionado(item)}
                        accessibilityRole="button"
                        accessibilityLabel={`Abrir detalhes de ${item.nome}`}
                        style={({ pressed }) => [
                            styles.petCard,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <View style={styles.petImageWrapper}>
                            {item.foto ? (
                                <Image
                                    source={{
                                        uri: item.foto,
                                    }}
                                    style={styles.petImage}
                                />
                            ) : (
                                <View style={styles.petPlaceholder}>
                                    <MaterialCommunityIcons
                                        name={
                                            item.especie.toLowerCase() === "gato"
                                                ? "cat"
                                                : item.especie.toLowerCase() === "cachorro"
                                                    ? "dog"
                                                    : "paw-outline"
                                        }
                                        size={30}
                                        color={COLORS.primary}
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.petInfo}>
                            <Text style={styles.petName} numberOfLines={1}>
                                {item.nome}
                            </Text>

                            <Text style={styles.petMeta} numberOfLines={1}>
                                {item.especie}

                                {item.raca ? ` • ${item.raca}` : ""}
                            </Text>

                            {item.porte ? (
                                <Text style={styles.petSize}>Porte {item.porte}</Text>
                            ) : null}
                        </View>

                        <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                    </Pressable>
                )}
            />

            {/* ===================================================== */}
            {/* FORMULÁRIO */}
            {/* ===================================================== */}

            <Modal
                visible={formVisible}
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

            {/* ===================================================== */}
            {/* DETALHES DO PET */}
            {/* ===================================================== */}

            <Modal
                visible={petSelecionado !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setPetSelecionado(null)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.detailContainer}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailTitle}>Detalhes do pet</Text>

                            <Pressable
                                onPress={() => setPetSelecionado(null)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={21} color={COLORS.textTitle} />
                            </Pressable>
                        </View>

                        {petSelecionado && (
                            <>
                                <View style={styles.detailPhotoWrapper}>
                                    {petSelecionado.foto ? (
                                        <Image
                                            source={{
                                                uri: petSelecionado.foto,
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

                                <Text style={styles.detailPetName}>{petSelecionado.nome}</Text>

                                <View style={styles.detailCard}>
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={`Informar ${petSelecionado.nome} como perdido`}
                                        accessibilityHint="Abre uma ocorrência de pet perdido já preenchida com os dados deste animal"
                                        onPress={() =>
                                            informarComoPerdido(
                                                petSelecionado
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
                                        value={petSelecionado.especie}
                                    />

                                    <DetailRow
                                        label="Raça"
                                        value={
                                            petSelecionado.raca ||
                                            'Não informada'
                                        }
                                    />

                                    <DetailRow
                                        label="Sexo"
                                        value={
                                            petSelecionado.sexo ||
                                            'Não informado'
                                        }
                                    />

                                    <DetailRow
                                        label="Cor"
                                        value={
                                            petSelecionado.cor ||
                                            'Não informada'
                                        }
                                    />

                                    <DetailRow
                                        label="Porte"
                                        value={
                                            petSelecionado.porte ||
                                            'Não informado'
                                        }
                                    />

                                    <DetailRow
                                        label="Idade"
                                        value={
                                            petSelecionado.idade ||
                                            'Não informada'
                                        }
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
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

    petCard: {
        minHeight: 84,

        marginBottom: 10,
        padding: 12,

        borderRadius: 18,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: COLORS.surface,

        borderWidth: 1,
        borderColor: "rgba(15,23,42,0.06)",

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

        backgroundColor: COLORS.successBg,
    },

    petInfo: {
        flex: 1,
        marginLeft: 12,
    },

    petName: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.textTitle,
    },

    petMeta: {
        marginTop: 3,
        fontSize: 12,
        color: COLORS.textBody,
    },

    petSize: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: "600",
        color: COLORS.primary,
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

    detailContainer: {
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

    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 18,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textTitle,
    },

    detailTitle: {
        fontSize: 18,
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
