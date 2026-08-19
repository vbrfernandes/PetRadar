// ============================================================
// D:\PetRadar\src\mobile\src\features\feed\screens\ProcuraSeScreen.tsx
// ============================================================

import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import * as Location from "expo-location";

import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";

import type {
    BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import type {
    AppTabParamList,
} from "../../../navigation/navigation.types";

import api from "../../../services/api";

import OccurrenceDetailDrawer
    from "../../occurrences/components/OccurrenceDetailDrawer";
import { occurrenceService }
    from "../../occurrences/services/occurrenceService";

import AppNavigationDrawer
    from "../../../components/AppNavigationDrawer";

import ProfileQuickMenu
    from "../../profile/components/ProfileQuickMenu";

import ProcuraSeBannerCarousel
    from "../components/ProcuraSeBannerCarousel";

import ProcuraSeOccurrenceCard
    from "../components/ProcuraSeOccurrenceCard";

import ProcuraSeControls
    from "../components/ProcuraSeControls";

import type {
    FiltroProcuraSe,
    ModoProcuraSe,
    OcorrenciaProcuraSe,
} from "../types/procurase.types";

import {
    ehUrgente,
    normalizarTexto,
} from "../utils/procurase.utils";

import {
    procuraSeButtonPressedStyle,
} from "../styles/procurase.styles";


import ProfileDetailScreen
    from "../../profile/components/ProfileDetailScreen";

import type {
    ProfileUpdateResult,
} from "../../profile/types/profile.types";

import {
    theme,
} from "../../../theme/colors";

import {
    useAuthStore,
} from "../../../store/useAuthStore";

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_SEARCH_RADIUS_KM = 10;
const MIN_SEARCH_RADIUS_KM = 1;
const MAX_SEARCH_RADIUS_KM = 100;

// ============================================================
// MOTIVOS DE DENÚNCIA
// ============================================================

const DENUNCIA_MOTIVOS = [
    {
        id: "INFORMACAO_FALSA",
        label:
            "Informação falsa ou enganosa",
    },

    {
        id: "CONTEUDO_IMPROPRIO",
        label:
            "Conteúdo impróprio",
    },

    {
        id: "SPAM_DUPLICADA",
        label:
            "Spam ou publicação duplicada",
    },

    {
        id: "OUTRO",
        label:
            "Outro problema com a publicação",
    },
] as const;

// ============================================================
// TIPAGEM
// ============================================================


interface ForcaResponse {
    ativo: boolean;
    total_forca: number;
}

type RecarregarListaOcorrencias =
    () => void | Promise<void>;

// ============================================================
// TELA
// ============================================================

export default function ProcuraSeScreen() {
    const navigation =
        useNavigation<
            BottomTabNavigationProp<
                AppTabParamList
            >
        >();

    const user =
        useAuthStore(
            (state) =>
                state.user,
        );

    // ==========================================================
    // OCORRÊNCIA SELECIONADA
    // ==========================================================

    const [
        selectedOccurrenceId,
        setSelectedOccurrenceId,
    ] =
        useState<
            number | null
        >(null);

    // ==========================================================
    // FEED
    // ==========================================================

    const [
        ocorrencias,
        setOcorrencias,
    ] =
        useState<
            OcorrenciaProcuraSe[]
        >([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        refreshing,
        setRefreshing,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(null);

    const [
        localizacaoNegada,
        setLocalizacaoNegada,
    ] =
        useState(false);

    const [
        raioPesquisaKm,
        setRaioPesquisaKm,
    ] =
        useState(
            DEFAULT_SEARCH_RADIUS_KM,
        );

    const [
        search,
        setSearch,
    ] =
        useState("");

    const [
        filtro,
        setFiltro,
    ] =
        useState<FiltroProcuraSe>(
            "TODAS",
        );

    const [
        ModoProcuraSe,
        setModoProcuraSe,
    ] =
        useState<ModoProcuraSe>(
            "PROXIMIDADE",
        );

    const ModoProcuraSeRef =
        useRef<ModoProcuraSe>(
            "PROXIMIDADE",
        );

    // ==========================================================
    // ECO (FORÇA NO BACKEND)
    // ==========================================================

    const [
        forcasEmAndamento,
        setForcasEmAndamento,
    ] =
        useState<
            Set<number>
        >(
            () =>
                new Set<number>(),
        );

    const forcasEmAndamentoRef =
        useRef<
            Set<number>
        >(
            new Set<number>(),
        );

    // ==========================================================
    // LISTA QUE ORIGINOU A ABERTURA DA OCORRÊNCIA
    // ==========================================================

    const recarregarListaOrigemRef =
        useRef<
            RecarregarListaOcorrencias
            | null
        >(null);

    // ==========================================================
    // NAVEGAÇÃO / PERFIL
    // ==========================================================

    const [
        menuVisible,
        setMenuVisible,
    ] =
        useState(false);

    const [
        profileMenuVisible,
        setProfileMenuVisible,
    ] =
        useState(false);

    const [
        profilePhoto,
        setProfilePhoto,
    ] =
        useState<
            string | null
        >(null);

    const [
        profileDetailVisible,
        setProfileDetailVisible,
    ] =
        useState(false);

    // ==========================================================
    // DENÚNCIA
    // ==========================================================

    const [
        denunciaOccurrenceId,
        setDenunciaOccurrenceId,
    ] =
        useState<
            number | null
        >(null);

    const [
        enviandoDenuncia,
        setEnviandoDenuncia,
    ] =
        useState(false);

    // ==========================================================
    // CARREGAR FEED
    // ==========================================================

    const carregarFeed =
        useCallback(
            async (
                modo:
                    | "normal"
                    | "refresh" =
                    "normal",

                modoSelecionado:
                    ModoProcuraSe =
                    ModoProcuraSeRef.current,
            ) => {
                if (
                    modo ===
                    "refresh"
                ) {
                    setRefreshing(
                        true,
                    );
                } else {
                    setLoading(
                        true,
                    );
                }

                setError(
                    null,
                );

                try {
                    // ==================================================
                    // 1. RAIO DO PERFIL
                    // ==================================================

                    let raioAtual =
                        DEFAULT_SEARCH_RADIUS_KM;

                    try {
                        const profileResponse =
                            await api.get(
                                "/auth/me",
                            );

                        setProfilePhoto(
                            profileResponse
                                .data
                                ?.foto_perfil ??
                            null,
                        );

                        const raioRecebido =
                            Number(
                                profileResponse
                                    .data
                                    ?.raio_pesquisa_km,
                            );

                        if (
                            Number.isFinite(
                                raioRecebido,
                            )
                        ) {
                            raioAtual =
                                Math.min(
                                    MAX_SEARCH_RADIUS_KM,

                                    Math.max(
                                        MIN_SEARCH_RADIUS_KM,
                                        raioRecebido,
                                    ),
                                );
                        }
                    } catch (
                    profileError
                    ) {
                        console.warn(
                            "[ProcuraSeScreen] Não foi possível carregar o raio do perfil:",
                            profileError,
                        );
                    }

                    setRaioPesquisaKm(
                        raioAtual,
                    );

                    // ==================================================
                    // 2. PERMISSÃO DE LOCALIZAÇÃO
                    // ==================================================

                    const {
                        status,
                    } =
                        await Location
                            .requestForegroundPermissionsAsync();

                    if (
                        status !==
                        "granted"
                    ) {
                        setLocalizacaoNegada(
                            true,
                        );

                        setOcorrencias(
                            [],
                        );

                        return;
                    }

                    setLocalizacaoNegada(
                        false,
                    );

                    // ==================================================
                    // 3. LOCALIZAÇÃO ATUAL
                    // ==================================================

                    const currentLocation =
                        await Location
                            .getCurrentPositionAsync(
                                {
                                    accuracy:
                                        Location
                                            .Accuracy
                                            .Balanced,
                                },
                            );

                    // ==================================================
                    // 4. OCORRÊNCIAS DO FEED
                    // ==================================================

                    const response =
                        await occurrenceService.getNearby<OcorrenciaProcuraSe>({
                            lat:
                                currentLocation
                                    .coords
                                    .latitude,

                            lng:
                                currentLocation
                                    .coords
                                    .longitude,

                            raio_km:
                                raioAtual,

                            modo:
                                modoSelecionado ===
                                    "ECO"
                                    ? "eco"
                                    : "proximidade",
                        });

                    const dados =
                        Array.isArray(
                            response.data,
                        )
                            ? response.data
                            : [];

                    const ocorrenciasValidas =
                        dados.filter(
                            (
                                occurrence,
                            ) =>
                                Number.isFinite(
                                    Number(
                                        occurrence
                                            .latitude,
                                    ),
                                ) &&
                                Number.isFinite(
                                    Number(
                                        occurrence
                                            .longitude,
                                    ),
                                ),
                        );

                    // ============================================================
                    // PROCURA-SE
                    //
                    // Esta tela aceita SOMENTE:
                    //
                    // - PET_PERDIDO
                    // - PET_AVISTADO
                    //
                    // ANIMAL_DE_RUA nunca entra na lista-base.
                    // ============================================================

                    const ocorrenciasProcuraSe =
                        ocorrenciasValidas.filter(
                            (
                                occurrence,
                            ) => {
                                const tipoOcorrencia =
                                    normalizarTexto(
                                        occurrence
                                            .tipo_ocorrencia,
                                    );

                                return (
                                    tipoOcorrencia ===
                                    "pet_perdido" ||
                                    tipoOcorrencia ===
                                    "pet_avistado"
                                );
                            },
                        );

                    setOcorrencias(
                        ocorrenciasProcuraSe,
                    );
                } catch (
                err: unknown
                ) {
                    console.warn(
                        "[ProcuraSeScreen] Erro ao carregar feed:",
                        err,
                    );

                    setOcorrencias(
                        [],
                    );

                    setError(
                        modoSelecionado ===
                            "ECO"
                            ? "Não foi possível carregar as ocorrências do modo Eco."
                            : "Não foi possível carregar as ocorrências próximas.",
                    );
                } finally {
                    setLoading(
                        false,
                    );

                    setRefreshing(
                        false,
                    );
                }
            },
            [],
        );

    // ==========================================================
    // ATUALIZAR AO ENTRAR NA TELA
    // ==========================================================

    useFocusEffect(
        useCallback(
            () => {
                const atualizarFeed =
                    async () => {
                        await carregarFeed();

                        const recarregarListaOrigem =
                            recarregarListaOrigemRef
                                .current;

                        if (
                            !recarregarListaOrigem
                        ) {
                            return;
                        }

                        recarregarListaOrigemRef.current =
                            null;

                        await recarregarListaOrigem();
                    };

                void atualizarFeed();
            },
            [
                carregarFeed,
            ],
        ),
    );

    // ==========================================================
    // PERFIL ATUALIZADO
    // ==========================================================

    const handleProfileUpdated =
        useCallback(
            (
                updatedProfile:
                    ProfileUpdateResult,
            ) => {
                if (
                    updatedProfile
                        .foto_perfil !==
                    undefined
                ) {
                    setProfilePhoto(
                        updatedProfile
                            .foto_perfil ??
                        null,
                    );
                }

                void carregarFeed();
            },
            [
                carregarFeed,
            ],
        );

    // ==========================================================
    // DETALHES DA OCORRÊNCIA
    // ==========================================================

    const abrirDetalheOcorrencia =
        useCallback(
            (
                occurrenceId:
                    number,

                recarregarLista?:
                    RecarregarListaOcorrencias,
            ) => {
                recarregarListaOrigemRef.current =
                    recarregarLista ??
                    null;

                setSelectedOccurrenceId(
                    occurrenceId,
                );
            },
            [],
        );

    const handleOccurrenceEdit =
        useCallback(
            (
                occurrenceId:
                    number,
            ) => {
                navigation.navigate(
                    "CadastroOcorrencia",

                    {
                        ocorrenciaId:
                            occurrenceId,
                    },
                );
            },
            [
                navigation,
            ],
        );

    const handleOccurrenceDeleted =
        useCallback(
            async (
                occurrenceId:
                    number,
            ) => {
                // ====================================================
                // 1. REMOVE DO FEED IMEDIATAMENTE
                // ====================================================

                setOcorrencias(
                    (
                        atuais,
                    ) =>
                        atuais.filter(
                            (
                                occurrence,
                            ) =>
                                occurrence
                                    .id_ocorrencia !==
                                occurrenceId,
                        ),
                );

                // ====================================================
                // 2. LISTA DE ORIGEM
                // ====================================================

                const recarregarListaOrigem =
                    recarregarListaOrigemRef
                        .current;

                recarregarListaOrigemRef.current =
                    null;

                // ====================================================
                // 3. ATUALIZA LISTAS
                // ====================================================

                const atualizacoes:
                    Promise<unknown>[] =
                    [
                        carregarFeed(
                            "refresh",
                        ),
                    ];

                if (
                    recarregarListaOrigem
                ) {
                    atualizacoes.push(
                        Promise
                            .resolve()
                            .then(
                                recarregarListaOrigem,
                            ),
                    );
                }

                await Promise
                    .allSettled(
                        atualizacoes,
                    );
            },
            [
                carregarFeed,
            ],
        );

    // ==========================================================
    // FORÇA
    // ==========================================================

    const alternarForca =
        useCallback(
            async (
                occurrenceId:
                    number,
            ) => {
                // Impede duplo clique enquanto
                // a requisição está em andamento.

                if (
                    forcasEmAndamentoRef
                        .current
                        .has(
                            occurrenceId,
                        )
                ) {
                    return;
                }

                forcasEmAndamentoRef
                    .current
                    .add(
                        occurrenceId,
                    );

                setForcasEmAndamento(
                    new Set(
                        forcasEmAndamentoRef
                            .current,
                    ),
                );

                try {
                    const response =
                        await api.post<
                            ForcaResponse
                        >(
                            `/ocorrencias/${occurrenceId}/forca`,
                        );

                    const {
                        ativo,
                        total_forca,
                    } =
                        response.data;

                    setOcorrencias(
                        (
                            atuais,
                        ) =>
                            atuais.map(
                                (
                                    occurrence,
                                ) => {
                                    if (
                                        occurrence
                                            .id_ocorrencia !==
                                        occurrenceId
                                    ) {
                                        return occurrence;
                                    }

                                    return {
                                        ...occurrence,

                                        usuario_deu_forca:
                                            Boolean(
                                                ativo,
                                            ),

                                        total_forca:
                                            Math.max(
                                                0,

                                                Number(
                                                    total_forca,
                                                ) || 0,
                                            ),
                                    };
                                },
                            ),
                    );
                } catch (
                err: unknown
                ) {
                    console.warn(
                        "[ProcuraSeScreen] Erro ao atualizar Eco:",
                        err,
                    );

                    Alert.alert(
                        "Não foi possível atualizar",
                        "Tente Ecoar novamente em alguns instantes.",
                    );
                } finally {
                    forcasEmAndamentoRef
                        .current
                        .delete(
                            occurrenceId,
                        );

                    setForcasEmAndamento(
                        new Set(
                            forcasEmAndamentoRef
                                .current,
                        ),
                    );
                }
            },
            [],
        );

    // ==========================================================
    // OPÇÕES / DENÚNCIA
    // ==========================================================

    const abrirOpcoesOcorrencia =
        useCallback(
            (
                occurrenceId:
                    number,
            ) => {
                setDenunciaOccurrenceId(
                    occurrenceId,
                );
            },
            [],
        );

    const fecharDenuncia =
        useCallback(
            () => {
                if (
                    enviandoDenuncia
                ) {
                    return;
                }

                setDenunciaOccurrenceId(
                    null,
                );
            },
            [
                enviandoDenuncia,
            ],
        );

    const enviarDenuncia =
        useCallback(
            async (
                motivo:
                    string,
            ) => {
                if (
                    denunciaOccurrenceId ===
                    null ||
                    enviandoDenuncia
                ) {
                    return;
                }

                setEnviandoDenuncia(
                    true,
                );

                try {
                    await api.post(
                        `/ocorrencias/${denunciaOccurrenceId}/denuncias`,

                        {
                            motivo,
                        },
                    );

                    setDenunciaOccurrenceId(
                        null,
                    );

                    Alert.alert(
                        "Denúncia enviada",
                        "Obrigado. A ocorrência foi sinalizada para análise.",
                    );
                } catch (
                err: unknown
                ) {
                    console.warn(
                        "[ProcuraSeScreen] Erro ao denunciar ocorrência:",
                        err,
                    );

                    Alert.alert(
                        "Não foi possível enviar",
                        "Não conseguimos registrar a denúncia agora. Tente novamente em alguns instantes.",
                    );
                } finally {
                    setEnviandoDenuncia(
                        false,
                    );
                }
            },
            [
                denunciaOccurrenceId,
                enviandoDenuncia,
            ],
        );


    // ==========================================================
    // NAVEGAÇÃO DO FEED
    // ==========================================================

    const abrirMenu =
        useCallback(
            () => {
                setMenuVisible(
                    true,
                );
            },
            [],
        );

    const fecharMenu =
        useCallback(
            () => {
                setMenuVisible(
                    false,
                );
            },
            [],
        );

    const registrarOcorrencia =
        useCallback(
            () => {
                navigation.navigate(
                    "CadastroOcorrencia",
                );
            },
            [
                navigation,
            ],
        );

    const selecionarModoProcuraSe =
        useCallback(
            (
                novoModo:
                    ModoProcuraSe,
            ) => {
                if (
                    ModoProcuraSeRef.current ===
                    novoModo ||
                    refreshing
                ) {
                    return;
                }

                ModoProcuraSeRef.current =
                    novoModo;

                setModoProcuraSe(
                    novoModo,
                );

                void carregarFeed(
                    "refresh",
                    novoModo,
                );
            },
            [
                carregarFeed,
                refreshing,
            ],
        );

    // ==========================================================
    // BUSCA + FILTROS
    // ==========================================================

    const ocorrenciasFiltradas =
        useMemo(
            () => {
                const termo =
                    ModoProcuraSe ===
                        "PROXIMIDADE"
                        ? normalizarTexto(
                            search,
                        )
                        : "";

                return ocorrencias.filter(
                    (
                        occurrence,
                    ) => {
                        const correspondeBusca =
                            !termo ||
                            [
                                occurrence
                                    .tipo_animal,

                                occurrence
                                    .tipo_ocorrencia,

                                occurrence
                                    .status_badge,

                                occurrence
                                    .nivel_urgencia,

                                occurrence
                                    .endereco_localizacao,

                                occurrence
                                    .observacao,

                                occurrence
                                    .autor_nome,
                            ].some(
                                (
                                    valor,
                                ) =>
                                    normalizarTexto(
                                        valor,
                                    ).includes(
                                        termo,
                                    ),
                            );

                        if (
                            !correspondeBusca
                        ) {
                            return false;
                        }

                        const status =
                            normalizarTexto(
                                occurrence
                                    .status_badge,
                            );

                        switch (
                        filtro
                        ) {
                            case "PERDIDOS":
                                return status
                                    .includes(
                                        "perdid",
                                    );

                            case "AVISTADOS":
                                return status
                                    .includes(
                                        "avist",
                                    );


                            case "URGENTES":
                                return ehUrgente(
                                    occurrence
                                        .nivel_urgencia,
                                );

                            case "TODAS":

                            default:
                                return true;
                        }
                    },
                );
            },
            [
                ocorrencias,
                search,
                filtro,
                ModoProcuraSe,
            ],
        );

    // ==========================================================
    // LOADING INICIAL
    // ==========================================================

    if (loading) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.stateContainer
                    }
                >
                    <View
                        style={
                            styles.stateIcon
                        }
                    >
                        <MaterialCommunityIcons
                            name="paw"
                            size={35}
                            color={
                                theme.colors
                                    .brand
                            }
                        />
                    </View>

                    <ActivityIndicator
                        size="small"
                        color={
                            theme.colors
                                .brand
                        }
                    />

                    <Text
                        style={
                            styles.stateTitle
                        }
                    >
                        Buscando ocorrências
                    </Text>

                    <Text
                        style={
                            styles.stateDescription
                        }
                    >
                        Estamos procurando animais próximos da sua localização.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ==========================================================
    // LOCALIZAÇÃO NEGADA
    // ==========================================================

    if (
        localizacaoNegada
    ) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.stateContainer
                    }
                >
                    <View
                        style={
                            styles.stateIcon
                        }
                    >
                        <Ionicons
                            name="location-outline"
                            size={34}
                            color={
                                theme.colors
                                    .brand
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.stateTitle
                        }
                    >
                        Localização necessária
                    </Text>

                    <Text
                        style={
                            styles.stateDescription
                        }
                    >
                        Precisamos da sua localização para mostrar as ocorrências mais próximas de você.
                    </Text>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Tentar permitir localização novamente"
                        onPress={() =>
                            void carregarFeed()
                        }
                        style={({
                            pressed,
                        }) => [
                                styles.stateButton,

                                pressed &&
                                procuraSeButtonPressedStyle,
                            ]}
                    >
                        <Ionicons
                            name="location"
                            size={18}
                            color={
                                theme.colors
                                    .surface
                            }
                        />

                        <Text
                            style={
                                styles.stateButtonText
                            }
                        >
                            Tentar novamente
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // ==========================================================
    // ERRO
    // ==========================================================

    if (error) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.stateContainer
                    }
                >
                    <View
                        style={[
                            styles.stateIcon,
                            styles.errorIcon,
                        ]}
                    >
                        <Ionicons
                            name="cloud-offline-outline"
                            size={34}
                            color={
                                theme.colors
                                    .semantic
                                    .danger
                                    .text
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.stateTitle
                        }
                    >
                        Não foi possível carregar
                    </Text>

                    <Text
                        style={
                            styles.stateDescription
                        }
                    >
                        {error}
                    </Text>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Tentar carregar feed novamente"
                        onPress={() =>
                            void carregarFeed()
                        }
                        style={({
                            pressed,
                        }) => [
                                styles.stateButton,

                                pressed &&
                                procuraSeButtonPressedStyle,
                            ]}
                    >
                        <Ionicons
                            name="refresh"
                            size={18}
                            color={
                                theme.colors
                                    .surface
                            }
                        />

                        <Text
                            style={
                                styles.stateButtonText
                            }
                        >
                            Tentar novamente
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // ==========================================================
    // FEED
    // ==========================================================

    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <FlatList
                data={
                    ocorrenciasFiltradas
                }
                keyExtractor={(
                    item,
                ) =>
                    String(
                        item.id_ocorrencia,
                    )
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.listContent
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={() =>
                            void carregarFeed(
                                "refresh",
                            )
                        }
                        tintColor={
                            theme.colors
                                .brand
                        }
                        colors={[
                            theme.colors
                                .brand,
                        ]}
                    />
                }

                // =====================================================
                // CABEÇALHO
                // =====================================================

                ListHeaderComponent={
                    <>
                        {/* =================================================
                HEADER
            ================================================= */}

                        <View
                            style={
                                styles.header
                            }
                        >
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Abrir menu"
                                accessibilityHint="Abre o menu principal do PetRadar"
                                hitSlop={8}
                                onPress={
                                    abrirMenu
                                }
                                style={({
                                    pressed,
                                }) => [
                                        styles.headerMenuButton,

                                        pressed &&
                                        procuraSeButtonPressedStyle,
                                    ]}
                            >
                                <Ionicons
                                    name="menu-outline"
                                    size={24}
                                    color={
                                        theme.colors
                                            .textTitle
                                    }
                                />
                            </Pressable>

                            <View
                                style={
                                    styles.headerContent
                                }
                            >
                                <Text
                                    style={
                                        styles.headerTitle
                                    }
                                    numberOfLines={1}
                                >
                                    Procura-se
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.headerActions
                                }
                            >
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Abrir perfil"
                                    accessibilityHint="Abre as opções da sua conta"
                                    onPress={() =>
                                        setProfileMenuVisible(
                                            true,
                                        )
                                    }
                                    style={({
                                        pressed,
                                    }) => [
                                            styles.headerAvatarButton,

                                            pressed &&
                                            procuraSeButtonPressedStyle,
                                        ]}
                                >
                                    <Image
                                        source={{
                                            uri:
                                                profilePhoto ||
                                                "https://i.pravatar.cc/150?img=11",
                                        }}
                                        style={
                                            styles.headerAvatarImage
                                        }
                                    />

                                    <View
                                        style={
                                            styles.headerOnlineIndicator
                                        }
                                    />
                                </Pressable>

                                <View
                                    style={
                                        styles.radiusBadge
                                    }
                                >
                                    <Ionicons
                                        name={
                                            ModoProcuraSe ===
                                                "ECO"
                                                ? "earth-outline"
                                                : "navigate-outline"
                                        }
                                        size={13}
                                        color={
                                            theme.colors
                                                .brand
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.radiusText
                                        }
                                    >
                                        {ModoProcuraSe ===
                                            "ECO"
                                            ? "Mundo"
                                            : `${raioPesquisaKm} km`}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* =================================================
                CARROSSEL DE BANNERS
            ================================================= */}

                        <ProcuraSeBannerCarousel />

                        {/* =================================================
                CARROSSEL: BUSCA / MODOS DO FEED
            ================================================= */}

                        <ProcuraSeControls
                            search={
                                search
                            }
                            ModoProcuraSe={
                                ModoProcuraSe
                            }
                            filtro={
                                filtro
                            }
                            raioPesquisaKm={
                                raioPesquisaKm
                            }
                            refreshing={
                                refreshing
                            }
                            quantidadeOcorrenciasFiltradas={
                                ocorrenciasFiltradas
                                    .length
                            }
                            onSearchChange={
                                setSearch
                            }
                            onSelectMode={
                                selecionarModoProcuraSe
                            }
                            onFilterChange={
                                setFiltro
                            }
                        />
                    </>
                }

                // =====================================================
                // CARD
                // =====================================================

                renderItem={({
                    item,
                }) => (
                    <ProcuraSeOccurrenceCard
                        occurrence={
                            item
                        }
                        forcaLoading={
                            forcasEmAndamento.has(
                                item.id_ocorrencia,
                            )
                        }
                        onPress={
                            abrirDetalheOcorrencia
                        }
                        onToggleForca={
                            alternarForca
                        }
                        onOpenOptions={
                            abrirOpcoesOcorrencia
                        }
                    />
                )}

                // =====================================================
                // LISTA VAZIA
                // =====================================================

                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyContainer
                        }
                    >
                        <View
                            style={
                                styles.emptyIcon
                            }
                        >
                            <MaterialCommunityIcons
                                name="paw-outline"
                                size={34}
                                color={
                                    theme.colors
                                        .brand
                                }
                            />
                        </View>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            Nenhuma ocorrência encontrada
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            {ocorrencias.length ===
                                0
                                ? ModoProcuraSe ===
                                    "ECO"
                                    ? "Não encontramos ocorrências disponíveis no modo Eco."
                                    : `Não encontramos ocorrências dentro do raio de ${raioPesquisaKm} km.`
                                : "Não encontramos ocorrências correspondentes à pesquisa ou ao filtro selecionado."}
                        </Text>

                        {((ModoProcuraSe ===
                            "PROXIMIDADE" &&
                            search) ||
                            filtro !==
                            "TODAS") && (
                                <Pressable
                                    onPress={() => {
                                        setSearch(
                                            "",
                                        );

                                        setFiltro(
                                            "TODAS",
                                        );
                                    }}
                                    style={({
                                        pressed,
                                    }) => [
                                            styles.clearButton,

                                            pressed &&
                                            procuraSeButtonPressedStyle,
                                        ]}
                                >
                                    <Text
                                        style={
                                            styles.clearButtonText
                                        }
                                    >
                                        Limpar filtros
                                    </Text>
                                </Pressable>
                            )}
                    </View>
                }
            />

            {/* ======================================================
          REGISTRAR OCORRÊNCIA
      ====================================================== */}

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Registrar nova ocorrência"
                accessibilityHint="Abre o formulário para registrar um animal"
                onPress={
                    registrarOcorrencia
                }
                style={({
                    pressed,
                }) => [
                        styles.registerButton,

                        pressed &&
                        styles.registerButtonPressed,
                    ]}
            >
                <View
                    style={
                        styles.registerButtonIcon
                    }
                >
                    <Ionicons
                        name="add"
                        size={23}
                        color={
                            theme.colors
                                .brand
                        }
                    />
                </View>

                <View
                    style={
                        styles.registerButtonContent
                    }
                >
                    <Text
                        style={
                            styles.registerButtonTitle
                        }
                    >
                        Registrar ocorrência
                    </Text>

                    <Text
                        style={
                            styles.registerButtonSubtitle
                        }
                    >
                        Avise a comunidade
                    </Text>
                </View>

                <View
                    style={
                        styles.registerButtonArrow
                    }
                >
                    <Ionicons
                        name="arrow-forward"
                        size={19}
                        color={
                            theme.colors
                                .surface
                        }
                    />
                </View>
            </Pressable>

            {/* ======================================================
          DENÚNCIA DA PUBLICAÇÃO
      ====================================================== */}

            <Modal
                visible={
                    denunciaOccurrenceId !==
                    null
                }
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={
                    fecharDenuncia
                }
            >
                <View
                    style={
                        styles.reportOverlay
                    }
                >
                    {/* Área externa fecha o modal */}

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Fechar denúncia"
                        onPress={
                            fecharDenuncia
                        }
                        style={
                            StyleSheet.absoluteFill
                        }
                    />

                    <View
                        style={
                            styles.reportSheet
                        }
                    >
                        <View
                            style={
                                styles.reportHandle
                            }
                        />

                        <View
                            style={
                                styles.reportHeader
                            }
                        >
                            <View
                                style={
                                    styles.reportHeaderIcon
                                }
                            >
                                <Ionicons
                                    name="flag-outline"
                                    size={21}
                                    color={
                                        theme.colors
                                            .semantic
                                            .danger
                                            .text
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.reportHeaderContent
                                }
                            >
                                <Text
                                    style={
                                        styles.reportTitle
                                    }
                                >
                                    Denunciar publicação
                                </Text>

                                <Text
                                    style={
                                        styles.reportDescription
                                    }
                                >
                                    Selecione o motivo da denúncia.
                                </Text>
                            </View>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Fechar"
                                disabled={
                                    enviandoDenuncia
                                }
                                onPress={
                                    fecharDenuncia
                                }
                                hitSlop={8}
                                style={({
                                    pressed,
                                }) => [
                                        styles.reportCloseButton,

                                        pressed &&
                                        procuraSeButtonPressedStyle,
                                    ]}
                            >
                                <Ionicons
                                    name="close"
                                    size={21}
                                    color={
                                        theme.colors
                                            .textBody
                                    }
                                />
                            </Pressable>
                        </View>

                        {enviandoDenuncia ? (
                            <View
                                style={
                                    styles.reportLoading
                                }
                            >
                                <ActivityIndicator
                                    size="small"
                                    color={
                                        theme.colors
                                            .brand
                                    }
                                />

                                <Text
                                    style={
                                        styles.reportLoadingText
                                    }
                                >
                                    Enviando denúncia...
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={
                                    styles.reportReasons
                                }
                            >
                                {DENUNCIA_MOTIVOS.map(
                                    (
                                        motivo,
                                    ) => (
                                        <Pressable
                                            key={
                                                motivo.id
                                            }
                                            accessibilityRole="button"
                                            accessibilityLabel={
                                                motivo.label
                                            }
                                            onPress={() =>
                                                void enviarDenuncia(
                                                    motivo.label,
                                                )
                                            }
                                            style={({
                                                pressed,
                                            }) => [
                                                    styles.reportReasonButton,

                                                    pressed &&
                                                    styles.reportReasonButtonPressed,
                                                ]}
                                        >
                                            <View
                                                style={
                                                    styles.reportReasonIcon
                                                }
                                            >
                                                <Ionicons
                                                    name="flag-outline"
                                                    size={17}
                                                    color={
                                                        theme.colors
                                                            .textBody
                                                    }
                                                />
                                            </View>

                                            <Text
                                                style={
                                                    styles.reportReasonText
                                                }
                                            >
                                                {motivo.label}
                                            </Text>

                                            <Ionicons
                                                name="chevron-forward"
                                                size={17}
                                                color={
                                                    theme.colors
                                                        .textBody
                                                }
                                            />
                                        </Pressable>
                                    ),
                                )}
                            </View>
                        )}

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Cancelar denúncia"
                            disabled={
                                enviandoDenuncia
                            }
                            onPress={
                                fecharDenuncia
                            }
                            style={({
                                pressed,
                            }) => [
                                    styles.reportCancelButton,

                                    pressed &&
                                    procuraSeButtonPressedStyle,
                                ]}
                        >
                            <Text
                                style={
                                    styles.reportCancelText
                                }
                            >
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* ======================================================
          MENU PRINCIPAL
      ====================================================== */}

            <AppNavigationDrawer
                visible={
                    menuVisible
                }
                activeScreen="ProcuraSe"
                profilePhoto={
                    profilePhoto
                }
                userName={
                    user?.name ||
                    null
                }
                userEmail={
                    user?.email ||
                    null
                }
                onClose={
                    fecharMenu
                }
                onNavigateMap={() => {
                    navigation.navigate(
                        "Mapa",
                    );
                }}
                onNavigateFeed={() => {
                    navigation.navigate(
                        "Feed",
                    );
                }}
                onNavigateProcuraSe={() => {
                    navigation.navigate(
                        "ProcuraSe",
                    );
                }}
            />

            {/* ======================================================
          MENU RÁPIDO DO PERFIL
      ====================================================== */}

            <ProfileQuickMenu
                visible={
                    profileMenuVisible
                }
                profilePhoto={
                    profilePhoto
                }
                userName={
                    user?.name ||
                    null
                }
                userEmail={
                    user?.email ||
                    null
                }
                onClose={() => {
                    setProfileMenuVisible(
                        false,
                    );
                }}
                onOpenProfile={() => {
                    setProfileDetailVisible(
                        true,
                    );
                }}
            />

            {/* ======================================================
          PERFIL COMPLETO
      ====================================================== */}

            <ProfileDetailScreen
                visible={
                    profileDetailVisible
                }
                onClose={() => {
                    setProfileDetailVisible(
                        false,
                    );
                }}
                onProfileUpdated={
                    handleProfileUpdated
                }
                onOccurrencePress={
                    abrirDetalheOcorrencia
                }
            />

            {/* ======================================================
          DETALHES DA OCORRÊNCIA
      ====================================================== */}

            <OccurrenceDetailDrawer
                visible={
                    selectedOccurrenceId !==
                    null
                }
                occurrenceId={
                    selectedOccurrenceId
                }
                onClose={() =>
                    setSelectedOccurrenceId(
                        null,
                    )
                }
                onEdit={
                    handleOccurrenceEdit
                }
                onDeleted={
                    handleOccurrenceDeleted
                }
            />
        </SafeAreaView>
    );
}

// ============================================================
// ESTILOS
// ============================================================

const styles =
    StyleSheet.create({
        // ========================================================
        // BASE
        // ========================================================

        container: {
            flex: 1,

            backgroundColor:
                theme.colors
                    .background,
        },

        listContent: {
            paddingHorizontal:
                theme.spacing
                    .globalMargin,

            paddingBottom:
                125,
        },

        // ========================================================
        // HEADER
        // ========================================================

        header: {
            minHeight: 82,

            flexDirection:
                "row",

            alignItems:
                "center",

            paddingVertical:
                10,

            gap: 12,
        },

        headerMenuButton: {
            width: 46,
            height: 46,

            borderRadius:
                23,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                theme.colors
                    .surface,

            ...theme.shadows
                .elevation1,
        },

        headerContent: {
            flex: 1,

            justifyContent:
                "center",

            minWidth: 0,
        },

        headerTitle: {
            color:
                theme.colors
                    .textTitle,

            fontSize: 20,

            fontWeight:
                "900",

            letterSpacing:
                -0.3,

            textAlign:
                "center",
        },

        headerActions: {
            alignItems:
                "center",

            justifyContent:
                "center",

            gap: 5,
        },

        headerAvatarButton: {
            width: 46,
            height: 46,

            borderRadius:
                23,

            padding: 2,

            backgroundColor:
                theme.colors
                    .surface,

            ...theme.shadows
                .elevation1,
        },

        headerAvatarImage: {
            width: "100%",
            height: "100%",

            borderRadius:
                21,
        },

        headerOnlineIndicator: {
            position:
                "absolute",

            right: 1,
            bottom: 1,

            width: 11,
            height: 11,

            borderRadius:
                6,

            backgroundColor:
                theme.colors
                    .semantic
                    .success
                    .text,

            borderWidth:
                2,

            borderColor:
                theme.colors
                    .surface,
        },

        radiusBadge: {
            minHeight: 25,

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",

            gap: 3,

            paddingHorizontal:
                8,

            borderRadius:
                theme.radius
                    .button,

            backgroundColor:
                theme.colors
                    .semantic
                    .success
                    .bg,
        },

        radiusText: {
            color:
                theme.colors
                    .brand,

            fontSize: 10,

            fontWeight:
                "800",
        },

        // ========================================================
        // DENÚNCIA
        // ========================================================

        reportOverlay: {
            flex: 1,

            justifyContent:
                "flex-end",

            backgroundColor:
                "rgba(0, 0, 0, 0.38)",
        },

        reportSheet: {
            paddingHorizontal:
                theme.spacing
                    .globalMargin,

            paddingTop: 10,

            paddingBottom:
                26,

            borderTopLeftRadius:
                24,

            borderTopRightRadius:
                24,

            backgroundColor:
                theme.colors
                    .surface,

            ...theme.shadows
                .elevation1,
        },

        reportHandle: {
            width: 38,
            height: 4,

            alignSelf:
                "center",

            marginBottom:
                15,

            borderRadius:
                2,

            backgroundColor:
                theme.colors
                    .inputBg,
        },

        reportHeader: {
            flexDirection:
                "row",

            alignItems:
                "center",

            marginBottom:
                17,
        },

        reportHeaderIcon: {
            width: 42,
            height: 42,

            borderRadius:
                14,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                theme.colors
                    .semantic
                    .danger
                    .bg,
        },

        reportHeaderContent: {
            flex: 1,

            minWidth: 0,

            marginLeft:
                11,
        },

        reportTitle: {
            color:
                theme.colors
                    .textTitle,

            fontSize: 16,

            fontWeight:
                "900",
        },

        reportDescription: {
            marginTop: 3,

            color:
                theme.colors
                    .textBody,

            fontSize: 11,

            lineHeight: 16,
        },

        reportCloseButton: {
            width: 38,
            height: 38,

            marginLeft: 8,

            borderRadius:
                19,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        reportReasons: {
            gap: 8,
        },

        reportReasonButton: {
            minHeight: 54,

            flexDirection:
                "row",

            alignItems:
                "center",

            paddingHorizontal:
                11,

            borderRadius:
                15,

            backgroundColor:
                theme.colors
                    .background,
        },

        reportReasonButtonPressed: {
            opacity: 0.72,
        },

        reportReasonIcon: {
            width: 34,
            height: 34,

            borderRadius:
                11,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                theme.colors
                    .surface,
        },

        reportReasonText: {
            flex: 1,

            marginHorizontal:
                10,

            color:
                theme.colors
                    .textTitle,

            fontSize: 12,

            lineHeight: 17,

            fontWeight:
                "700",
        },

        reportLoading: {
            minHeight: 130,

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",

            gap: 9,
        },

        reportLoadingText: {
            color:
                theme.colors
                    .textBody,

            fontSize: 12,

            fontWeight:
                "600",
        },

        reportCancelButton: {
            minHeight: 46,

            alignItems:
                "center",

            justifyContent:
                "center",

            marginTop: 12,

            borderRadius:
                theme.radius
                    .button,

            backgroundColor:
                theme.colors
                    .inputBg,
        },

        reportCancelText: {
            color:
                theme.colors
                    .textBody,

            fontSize: 12,

            fontWeight:
                "800",
        },



        // ========================================================
        // EMPTY
        // ========================================================

        emptyContainer: {
            alignItems:
                "center",

            paddingHorizontal:
                25,

            paddingVertical:
                60,
        },

        emptyIcon: {
            width: 72,
            height: 72,

            borderRadius:
                36,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                theme.colors
                    .semantic
                    .success
                    .bg,
        },

        emptyTitle: {
            marginTop: 17,

            color:
                theme.colors
                    .textTitle,

            fontSize: 16,

            fontWeight:
                "900",

            textAlign:
                "center",
        },

        emptyText: {
            maxWidth: 290,

            marginTop: 7,

            color:
                theme.colors
                    .textBody,

            fontSize: 12,

            lineHeight: 18,

            textAlign:
                "center",
        },

        clearButton: {
            minHeight: 40,

            alignItems:
                "center",

            justifyContent:
                "center",

            marginTop: 18,

            paddingHorizontal:
                17,

            borderRadius:
                theme.radius
                    .button,

            backgroundColor:
                theme.colors
                    .inputBg,
        },

        clearButtonText: {
            color:
                theme.colors
                    .brand,

            fontSize: 11,

            fontWeight:
                "800",
        },

        // ========================================================
        // REGISTRAR OCORRÊNCIA
        // ========================================================

        registerButton: {
            position:
                "absolute",

            left:
                theme.spacing
                    .globalMargin,

            right:
                theme.spacing
                    .globalMargin,

            bottom: 18,

            minHeight: 66,

            flexDirection:
                "row",

            alignItems:
                "center",

            paddingHorizontal:
                12,

            borderRadius:
                21,

            backgroundColor:
                theme.colors
                    .brand,

            ...theme.shadows
                .buttonGlow,
        },

        registerButtonPressed: {
            transform: [
                {
                    scale:
                        0.985,
                },
            ],

            opacity:
                0.96,
        },

        registerButtonIcon: {
            width: 43,
            height: 43,

            borderRadius:
                14,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                theme.colors
                    .surface,
        },

        registerButtonContent: {
            flex: 1,

            marginLeft:
                11,
        },

        registerButtonTitle: {
            color:
                theme.colors
                    .surface,

            fontSize: 13,

            fontWeight:
                "900",
        },

        registerButtonSubtitle: {
            marginTop: 2,

            color:
                theme.colors
                    .surface,

            fontSize: 9,

            fontWeight:
                "500",
        },

        registerButtonArrow: {
            width: 38,
            height: 38,

            borderRadius:
                12,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                theme.colors
                    .action,
        },

        // ========================================================
        // LOADING / ERRO / LOCALIZAÇÃO
        // ========================================================

        stateContainer: {
            flex: 1,

            alignItems:
                "center",

            justifyContent:
                "center",

            paddingHorizontal:
                30,
        },

        stateIcon: {
            width: 76,
            height: 76,

            borderRadius:
                38,

            alignItems:
                "center",

            justifyContent:
                "center",

            marginBottom:
                16,

            backgroundColor:
                theme.colors
                    .semantic
                    .success
                    .bg,
        },

        errorIcon: {
            backgroundColor:
                theme.colors
                    .semantic
                    .danger
                    .bg,
        },

        stateTitle: {
            marginTop: 14,

            color:
                theme.colors
                    .textTitle,

            fontSize: 18,

            fontWeight:
                "900",

            textAlign:
                "center",
        },

        stateDescription: {
            maxWidth: 300,

            marginTop: 8,

            color:
                theme.colors
                    .textBody,

            fontSize: 12,

            lineHeight: 19,

            textAlign:
                "center",
        },

        stateButton: {
            minHeight: 48,

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",

            gap: 7,

            marginTop: 22,

            paddingHorizontal:
                20,

            borderRadius:
                theme.radius
                    .button,

            backgroundColor:
                theme.colors
                    .brand,

            ...theme.shadows
                .buttonGlow,
        },

        stateButtonText: {
            color:
                theme.colors
                    .surface,

            fontSize: 12,

            fontWeight:
                "800",
        },

    });
