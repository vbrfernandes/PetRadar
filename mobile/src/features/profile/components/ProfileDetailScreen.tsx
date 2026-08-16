import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Easing,
  Alert,
  FlatList,
  RefreshControl,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

import * as ImagePicker from "expo-image-picker";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "../../../theme/colors";
import api from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";

import RegistrarPet from "../../../screens/RegistrarPet";

import { profileService } from "../services/profileService";

import type {
  ProfileUpdatePayload,
  ProfileUpdateResult,
  UserProfile,
} from "../types/profile.types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DRAWER_WIDTH = SCREEN_WIDTH * 0.88;

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

  warning: theme.colors.semantic.warning.text,
  warningBg: theme.colors.semantic.warning.bg,

  danger: theme.colors.semantic.danger.text,
  dangerBg: theme.colors.semantic.danger.bg,

  white: "#FFFFFF",
  muted: "#94A3B8",
  soft: "#F8FAFC",
};

const MAX_PROFILE_RADIUS = 100;
const MIN_PROFILE_RADIUS = 1;

// ============================================================
// TIPAGEM
// ============================================================

interface ProfileDetailProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: ProfileUpdateResult) => void;
  onOccurrencePress: (
    occurrenceId: number,
    onChanged: () => void | Promise<void>,
  ) => void;
}

interface Ocorrencia {
  id_ocorrencia: number;
  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;
  foto: string;
  nivel_urgencia: string;
  data_ocorrencia: string;
  endereco_localizacao?: string;
}

// ============================================================
// AVATAR
// ============================================================

interface AvatarProps {
  photoUri: string | null;
  loading: boolean;
  onPress: () => void;
}

const Avatar = React.memo(({ photoUri, loading, onPress }: AvatarProps) => {
  const hasPhoto = Boolean(photoUri);

  return (
    <Pressable
      style={styles.avatarWrapper}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={
        hasPhoto ? "Alterar foto de perfil" : "Adicionar foto de perfil"
      }
      accessibilityHint={
        hasPhoto
          ? "Toque para escolher uma nova foto"
          : "Toque para adicionar uma foto de perfil"
      }
    >
      <View style={styles.avatarRing}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.avatarImage}
            accessibilityLabel="Foto de perfil"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={46} color={COLORS.primary} />
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.white} />

          <Text style={styles.uploadingText}>Enviando...</Text>
        </View>
      )}

      {!loading && (
        <View
          style={[
            styles.photoActionBadge,
            hasPhoto ? styles.photoEditBadge : styles.photoAddBadge,
          ]}
        >
          <Ionicons
            name={hasPhoto ? "create-outline" : "add"}
            size={hasPhoto ? 17 : 23}
            color={COLORS.white}
          />
        </View>
      )}
    </Pressable>
  );
});

// ============================================================
// TAB BAR
// ============================================================
type ProfileTab = "perfil" | "ocorrencias" | "pets";

interface TabBarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  mostrarPets: boolean;
}

const TabBar = React.memo(({ activeTab, onTabChange, mostrarPets }: TabBarProps) => (
  <View style={styles.tabContainer}>
    <Pressable
      style={[
        styles.tabButton,
        activeTab === "perfil" && styles.tabButtonActive,
      ]}
      onPress={() => onTabChange("perfil")}
      accessibilityRole="tab"
      accessibilityState={{
        selected: activeTab === "perfil",
      }}
    >
      <View
        style={[
          styles.tabIconContainer,
          activeTab === "perfil" && styles.tabIconContainerActive,
        ]}
      >
        <Ionicons
          name="person-outline"
          size={18}
          color={activeTab === "perfil" ? COLORS.primary : COLORS.textBody}
        />
      </View>

      <Text
        style={[styles.tabText, activeTab === "perfil" && styles.tabTextActive]}
      >
        Perfil
      </Text>
    </Pressable>

    <Pressable
      style={[
        styles.tabButton,
        activeTab === "ocorrencias" && styles.tabButtonActive,
      ]}
      onPress={() => onTabChange("ocorrencias")}
      accessibilityRole="tab"
      accessibilityState={{
        selected: activeTab === "ocorrencias",
      }}
    >
      <View
        style={[
          styles.tabIconContainer,
          activeTab === "ocorrencias" && styles.tabIconContainerActive,
        ]}
      >
        <MaterialCommunityIcons
          name="paw-outline"
          size={19}
          color={activeTab === "ocorrencias" ? COLORS.primary : COLORS.textBody}
        />
      </View>

      <Text
        style={[
          styles.tabText,
          activeTab === "ocorrencias" && styles.tabTextActive,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        Ocorrências
      </Text>
    </Pressable>

    {/* ===================================================== */}
    {/* PETS */}
    {/* ===================================================== */}

    {mostrarPets && (
      <Pressable
        style={[
          styles.tabButton,
          activeTab === "pets" && styles.tabButtonActive,
        ]}
        onPress={() => onTabChange("pets")}
        accessibilityRole="tab"
        accessibilityState={{
          selected: activeTab === "pets",
        }}
        accessibilityLabel="Meus pets"
      >
        <View
          style={[
            styles.tabIconContainer,
            activeTab === "pets" && styles.tabIconContainerActive,
          ]}
        >
          <MaterialCommunityIcons
            name="dog-side"
            size={19}
            color={activeTab === "pets" ? COLORS.primary : COLORS.textBody}
          />
        </View>

        <Text
          style={[styles.tabText, activeTab === "pets" && styles.tabTextActive]}
        >
          Pets
        </Text>
      </Pressable>
    )}
  </View>
));

// ============================================================
// INFO ROW
// ============================================================

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconBackground?: string;
}

const InfoRow = React.memo(
  ({ icon, label, value, iconBackground = COLORS.successBg }: InfoRowProps) => (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue} numberOfLines={3}>
          {value || "Não informado"}
        </Text>
      </View>
    </View>
  ),
);

// ============================================================
// SWITCH
// ============================================================

interface PetSwitchProps {
  value: boolean;
  onChange: () => void;
}

const PetSwitch = React.memo(({ value, onChange }: PetSwitchProps) => {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Possui pet"
      style={[styles.switchTrack, value && styles.switchTrackActive]}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
});

// ============================================================
// OCORRÊNCIA
// ============================================================

interface OcorrenciaCardProps {
  item: Ocorrencia;
  onPress: (occurrenceId: number) => void;
}

const OcorrenciaCard = React.memo(({ item, onPress }: OcorrenciaCardProps) => {
  const isPerdido = item.status_badge?.toUpperCase() === "PERDIDO";

  const statusColor = isPerdido ? COLORS.danger : COLORS.warning;

  const statusBackground = isPerdido ? COLORS.dangerBg : COLORS.warningBg;

  return (
    <Pressable
      onPress={() => onPress(item.id_ocorrencia)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes da ocorrência de ${
        item.tipo_animal || "animal"
      }`}
      accessibilityHint="Mostra os detalhes completos desta ocorrência"
      style={({ pressed }) => [
        styles.occurrenceCard,
        pressed && styles.occurrenceCardPressed,
      ]}
    >
      <View style={styles.occurrenceImageWrapper}>
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.occurrenceImage} />
        ) : (
          <View style={styles.occurrenceImagePlaceholder}>
            <MaterialCommunityIcons name="paw" size={28} color={COLORS.muted} />
          </View>
        )}
      </View>

      <View style={styles.occurrenceInfo}>
        <View style={styles.occurrenceTopRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusBackground,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: statusColor,
                },
              ]}
            />

            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {item.status_badge}
            </Text>
          </View>

          <Text style={styles.urgencyText}>{item.nivel_urgencia}</Text>
        </View>

        <Text style={styles.animalName}>{item.tipo_animal || "Animal"}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.textBody} />

          <Text style={styles.locationText} numberOfLines={1}>
            {item.endereco_localizacao || "Localização não informada"}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </Pressable>
  );
});

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ProfileDetailScreen({
  visible,
  onClose,
  onProfileUpdated,
  onOccurrencePress,
}: ProfileDetailProps) {
  const { logout } = useAuthStore();

  const insets = useSafeAreaInsets();

  // ----------------------------------------------------------
  // ESTADOS
  // ----------------------------------------------------------

  const [activeTab, setActiveTab] = useState<ProfileTab>("perfil");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [raio, setRaio] = useState("10");
  const [endereco, setEndereco] = useState("");
  const [temPet, setTemPet] = useState(false);

  const [minhasOcorrencias, setMinhasOcorrencias] = useState<Ocorrencia[]>([]);

  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  const mostrarAbaPets =
    profile?.tipo_conta === "PESSOA_FISICA" && profile?.tem_pet === true;

  useEffect(() => {
    if (activeTab === "pets" && !mostrarAbaPets) {
      setActiveTab("perfil");
    }
  }, [activeTab, mostrarAbaPets]);

  // ----------------------------------------------------------
  // PREENCHER CAMPOS
  // ----------------------------------------------------------

  const preencherCampos = useCallback((data: UserProfile) => {
    setNome(data.nome_completo || data.nome_fantasia || "");

    setTelefone(data.telefone || "");

    setRaio(data.raio_pesquisa_km ? String(data.raio_pesquisa_km) : "10");

    setEndereco(data.endereco_completo || "");

    setTemPet(Boolean(data.tem_pet));
  }, []);

  // ----------------------------------------------------------
  // CARREGAR DADOS
  // ----------------------------------------------------------

  const carregarDados = useCallback(async () => {
    setLoading(true);

    try {
      // ========================================================
      // 1. CARREGAR PERFIL
      // ========================================================
      // O perfil é independente das ocorrências.
      // Se /ocorrencias/minhas falhar, o perfil continua carregando.

      try {
        const resPerfil = await profileService.getProfile();

        const data = resPerfil.data as UserProfile;

        setProfile(data);
        preencherCampos(data);
      } catch (error: any) {
        console.error(
          "[ProfileDetailScreen] Erro ao carregar perfil:",
          error?.response?.status,
          error?.response?.data || error?.message,
        );

        Alert.alert(
          "Não foi possível carregar seu perfil",
          error?.response?.data?.detail ||
            "Não foi possível obter seus dados. Verifique sua conexão e tente novamente.",
        );

        return;
      }

      // ========================================================
      // 2. CARREGAR OCORRÊNCIAS
      // ========================================================
      // Essa requisição não pode impedir o carregamento do perfil.

      try {
        const resOcorrencias = await api.get("/ocorrencias/minhas");

        setMinhasOcorrencias(
          Array.isArray(resOcorrencias.data) ? resOcorrencias.data : [],
        );
      } catch (error: any) {
        console.error(
          "[ProfileDetailScreen] Erro ao carregar ocorrências:",
          error?.response?.status,
          error?.response?.data || error?.message,
        );

        // O perfil já foi carregado.
        // Se as ocorrências falharem, mostramos uma lista vazia
        // em vez de derrubar a tela inteira.

        setMinhasOcorrencias([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [preencherCampos]);
  // ----------------------------------------------------------
  // SALVAR PERFIL
  // ----------------------------------------------------------

  const handleSalvarPerfil = useCallback(async () => {
    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado) {
      Alert.alert("Nome obrigatório", "Informe seu nome para continuar.");
      return;
    }

    const raioNumerico = Number(raio);

    if (
      profile?.tipo_conta === "PESSOA_FISICA" &&
      (!Number.isFinite(raioNumerico) ||
        raioNumerico < MIN_PROFILE_RADIUS ||
        raioNumerico > MAX_PROFILE_RADIUS)
    ) {
      Alert.alert(
        "Raio inválido",
        `Informe um raio entre ${MIN_PROFILE_RADIUS} e ${MAX_PROFILE_RADIUS} km.`,
      );
      return;
    }

    setSaving(true);

    try {
      const payload: ProfileUpdatePayload = {
        nome: nomeNormalizado,
        telefone: telefone.trim() || undefined,
      };

      if (profile?.tipo_conta === "PESSOA_FISICA") {
        payload.raio_pesquisa_km = Math.round(raioNumerico);

        payload.tem_pet = temPet;
      }

      if (profile?.tipo_conta === "ONG") {
        payload.endereco_completo = endereco.trim();
      }

      const response = await profileService.updateProfile(payload);

      const updatedProfile = response.data as UserProfile;

      setProfile(updatedProfile);
      preencherCampos(updatedProfile);
      onProfileUpdated?.(updatedProfile);

      setIsEditing(false);

      Alert.alert(
        "Perfil atualizado",
        "Suas informações foram salvas com sucesso.",
      );
    } catch (error: any) {
      Alert.alert(
        "Erro ao salvar",
        error.response?.data?.detail ||
          "Não foi possível atualizar seu perfil.",
      );
    } finally {
      setSaving(false);
    }
  }, [
    nome,
    telefone,
    raio,
    endereco,
    temPet,
    profile,
    preencherCampos,
    onProfileUpdated,
  ]);

  // ----------------------------------------------------------
  // ADICIONAR / ALTERAR FOTO
  // ----------------------------------------------------------

  const handleAlterarFoto = useCallback(async () => {
    if (uploadingImage) {
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "Conceda acesso à galeria para adicionar uma foto de perfil.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setUploadingImage(true);

      const asset = result.assets[0];

      const formData = new FormData();

      const filename =
        asset.fileName || asset.uri.split("/").pop() || "foto_perfil.jpg";

      const match = /\.(\w+)$/.exec(filename);

      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("foto", {
        uri: asset.uri,
        name: filename,
        type,
      } as any);

      const response = await profileService.uploadProfilePhoto(formData);

      const novaFoto = response.data?.foto_perfil;

      if (novaFoto) {
        setProfile((currentProfile) =>
          currentProfile
            ? {
                ...currentProfile,
                foto_perfil: novaFoto,
              }
            : currentProfile,
        );
      }

      Alert.alert(
        "Foto atualizada",
        profile?.foto_perfil
          ? "Sua foto de perfil foi alterada com sucesso."
          : "Sua foto de perfil foi adicionada com sucesso.",
      );
    } catch (error: any) {
      Alert.alert(
        "Erro ao atualizar foto",
        error.response?.data?.detail ||
          "Não foi possível enviar a imagem. Tente novamente.",
      );
    } finally {
      setUploadingImage(false);
    }
  }, [uploadingImage, profile?.foto_perfil]);

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------

  const handleLogout = useCallback(() => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair do PetRadar?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: logout,
      },
    ]);
  }, [logout]);

  // ----------------------------------------------------------
  // EXCLUIR CONTA
  // ----------------------------------------------------------

  const handleCloseDeleteModal = useCallback(() => {
    if (deletingAccount) {
      return;
    }

    setDeleteAccountVisible(false);
    setDeletePassword("");
    setShowDeletePassword(false);
  }, [deletingAccount]);

  const handleExcluirConta = useCallback(async () => {
    if (deletingAccount) {
      return;
    }

    if (!deletePassword.trim()) {
      Alert.alert(
        "Senha obrigatória",
        "Digite sua senha atual para confirmar a exclusão.",
      );
      return;
    }

    setDeletingAccount(true);

    try {
      await profileService.deleteProfile({
        senha: deletePassword,
      });

      setDeleteAccountVisible(false);
      setDeletePassword("");
      setShowDeletePassword(false);
      onClose();
      logout();

      Alert.alert(
        "Conta excluída",
        "Sua conta foi excluída permanentemente.",
      );
    } catch (error: unknown) {
      let detail: string | undefined;

      if (axios.isAxiosError<{ detail?: unknown }>(error)) {
        const responseDetail = error.response?.data?.detail;

        if (typeof responseDetail === "string") {
          detail = responseDetail;
        }
      }

      Alert.alert(
        "Erro ao excluir conta",
        detail || "Não foi possível excluir sua conta. Tente novamente.",
      );
    } finally {
      setDeletingAccount(false);
    }
  }, [deletePassword, deletingAccount, logout, onClose]);

  // ----------------------------------------------------------
  // CANCELAR
  // ----------------------------------------------------------

  const handleCancelarEdicao = useCallback(() => {
    if (profile) {
      preencherCampos(profile);
    }

    setIsEditing(false);
  }, [profile, preencherCampos]);

  // ----------------------------------------------------------
  // ANIMAÇÃO DO DRAWER
  // ----------------------------------------------------------

  useEffect(() => {
    if (visible) {
      carregarDados();

      Animated.timing(translateX, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      setIsEditing(false);
      setDeleteAccountVisible(false);
      setDeletePassword("");
      setShowDeletePassword(false);

      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, carregarDados, translateX]);

  // ----------------------------------------------------------
  // NOME DE EXIBIÇÃO
  // ----------------------------------------------------------

  const nomeExibicao = useMemo(() => {
    return (
      profile?.nome_completo || profile?.nome_fantasia || nome || "Usuário"
    );
  }, [profile, nome]);

  const tipoContaLabel = useMemo(() => {
    return profile?.tipo_conta === "ONG"
      ? "ONG / Instituição"
      : "Pessoa Física";
  }, [profile?.tipo_conta]);

  // ----------------------------------------------------------
  // CONTEÚDO DO PERFIL
  // ----------------------------------------------------------

  const perfilContent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>Carregando seu perfil...</Text>
        </View>
      );
    }

    if (isEditing) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.editScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Editar perfil</Text>

              <Text style={styles.sectionSubtitle}>
                Atualize suas informações pessoais.
              </Text>
            </View>

            <View style={styles.editingIndicator}>
              <View style={styles.editingDot} />

              <Text style={styles.editingText}>Editando</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {profile?.tipo_conta === "ONG"
                  ? "Nome fantasia"
                  : "Nome completo"}
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color={COLORS.primary}
                />

                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder={
                    profile?.tipo_conta === "ONG"
                      ? "Nome da ONG"
                      : "Seu nome completo"
                  }
                  placeholderTextColor={COLORS.muted}
                  autoCapitalize="words"
                  accessibilityLabel={
                    profile?.tipo_conta === "ONG"
                      ? "Nome fantasia"
                      : "Nome completo"
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone / WhatsApp</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={19}
                  color={COLORS.primary}
                />

                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="phone-pad"
                  accessibilityLabel="Telefone"
                />
              </View>
            </View>

            {profile?.tipo_conta === "PESSOA_FISICA" && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Raio de pesquisa</Text>

                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="location-outline"
                      size={19}
                      color={COLORS.primary}
                    />

                    <TextInput
                      style={styles.input}
                      value={raio}
                      onChangeText={setRaio}
                      placeholder="10"
                      placeholderTextColor={COLORS.muted}
                      keyboardType="number-pad"
                      maxLength={3}
                      accessibilityLabel="Raio de pesquisa em quilômetros"
                    />

                    <Text style={styles.inputSuffix}>km</Text>
                  </View>

                  <Text style={styles.helperText}>
                    Defina uma área entre 1 e 100 km para receber informações
                    relevantes.
                  </Text>
                </View>

                <View style={styles.preferenceRow}>
                  <View style={styles.preferenceIcon}>
                    <MaterialCommunityIcons
                      name="paw-outline"
                      size={21}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.preferenceContent}>
                    <Text style={styles.preferenceTitle}>Tenho um pet</Text>

                    <Text style={styles.preferenceDescription}>
                      Ajuda a personalizar sua experiência no PetRadar.
                    </Text>
                  </View>

                  <PetSwitch
                    value={temPet}
                    onChange={() => setTemPet((current) => !current)}
                  />
                </View>
              </>
            )}

            {profile?.tipo_conta === "ONG" && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Endereço completo</Text>

                <View
                  style={[styles.inputWrapper, styles.inputWrapperMultiline]}
                >
                  <Ionicons
                    name="location-outline"
                    size={19}
                    color={COLORS.primary}
                    style={styles.multilineIcon}
                  />

                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholder="Endereço da instituição"
                    placeholderTextColor={COLORS.muted}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    accessibilityLabel="Endereço completo"
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.editActions}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                saving && styles.primaryButtonDisabled,
              ]}
              onPress={handleSalvarPerfil}
              disabled={saving}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Salvar alterações"
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

                  <Text style={styles.primaryButtonText}>
                    Salvar alterações
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCancelarEdicao}
              disabled={saving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Cancelar edição"
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.profileScrollContent}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Informações</Text>

            <Text style={styles.sectionSubtitle}>
              Dados associados à sua conta.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />

            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon="person-outline"
            label={
              profile?.tipo_conta === "ONG" ? "Nome fantasia" : "Nome completo"
            }
            value={nomeExibicao}
          />

          <View style={styles.infoDivider} />

          <InfoRow
            icon="mail-outline"
            label="E-mail"
            value={profile?.email || "Não informado"}
          />

          <View style={styles.infoDivider} />

          <InfoRow
            icon="call-outline"
            label="Telefone"
            value={profile?.telefone || "Não informado"}
          />
        </View>

        {profile?.tipo_conta === "PESSOA_FISICA" && (
          <>
            <Text style={styles.cardSectionTitle}>Preferências</Text>

            <View style={styles.infoCard}>
              <InfoRow
                icon="location-outline"
                label="Raio de pesquisa"
                value={`${profile?.raio_pesquisa_km ?? 10} km`}
              />

              <View style={styles.infoDivider} />

              <InfoRow
                icon="heart-outline"
                label="Possui pet"
                value={profile?.tem_pet ? "Sim" : "Não"}
                iconBackground={
                  profile?.tem_pet ? COLORS.successBg : COLORS.warningBg
                }
              />
            </View>
          </>
        )}

        {profile?.tipo_conta === "ONG" && (
          <>
            <Text style={styles.cardSectionTitle}>Instituição</Text>

            <View style={styles.infoCard}>
              <InfoRow
                icon="business-outline"
                label="Razão social"
                value={profile?.razao_social || "Não informado"}
              />

              <View style={styles.infoDivider} />

              <InfoRow
                icon="document-text-outline"
                label="CNPJ"
                value={profile?.cnpj || "Não informado"}
              />

              <View style={styles.infoDivider} />

              <InfoRow
                icon="location-outline"
                label="Endereço"
                value={profile?.endereco_completo || "Não informado"}
              />

              <View style={styles.infoDivider} />

              <InfoRow
                icon="person-outline"
                label="Responsável"
                value={profile?.nome_gestor || "Não informado"}
              />
            </View>
          </>
        )}

        <View style={styles.accountCard}>
          <View style={styles.accountIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.accountContent}>
            <Text style={styles.accountTitle}>Conta PetRadar</Text>

            <Text style={styles.accountDescription}>
              Seus dados são utilizados para conectar pessoas e organizações às
              ações de proteção animal.
            </Text>
          </View>
        </View>

        <Text style={styles.manageAccountLabel}>GERENCIAR CONTA</Text>

        <View style={styles.deleteAccountCard}>
          <View style={styles.deleteAccountHeader}>
            <View style={styles.deleteAccountIcon}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={COLORS.danger}
              />
            </View>

            <View style={styles.deleteAccountContent}>
              <Text style={styles.deleteAccountTitle}>Excluir minha conta</Text>

              <Text style={styles.deleteAccountDescription}>
                Esta ação é permanente.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={() => setDeleteAccountVisible(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Excluir minha conta"
            accessibilityHint="Abre a confirmação de exclusão permanente da conta"
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            <Text style={styles.deleteAccountButtonText}>
              Excluir minha conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }, [
    loading,
    isEditing,
    nome,
    telefone,
    raio,
    endereco,
    temPet,
    profile,
    saving,
    nomeExibicao,
    handleSalvarPerfil,
    handleCancelarEdicao,
  ]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Fechar perfil"
        />

        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [
                {
                  translateX,
                },
              ],
            },
          ]}
        >
          {/* HEADER */}

          <View
            style={[
              styles.header,
              {
                paddingTop: insets.top + 8, // 
              },
            ]}
          >
            <TouchableOpacity
              style={styles.headerButton}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons
                name="chevron-back"
                size={23}
                color={COLORS.textTitle}
              />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Meu perfil</Text>

              <Text style={styles.headerSubtitle}>PetRadar</Text>
            </View>

            <TouchableOpacity
              style={[styles.headerButton, styles.logoutHeaderButton]}
              onPress={handleLogout}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
            >
              <Ionicons
                name="log-out-outline"
                size={21}
                color={COLORS.danger}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingIcon}>
                <MaterialCommunityIcons
                  name="paw"
                  size={30}
                  color={COLORS.primary}
                />
              </View>

              <ActivityIndicator size="small" color={COLORS.primary} />

              <Text style={styles.loadingText}>Carregando seu perfil...</Text>
            </View>
          ) : (
            <>
              {/* PROFILE HERO */}

              <View style={styles.profileHero}>
                <View style={styles.heroGlow} />

                <Avatar
                  photoUri={profile?.foto_perfil || null}
                  loading={uploadingImage}
                  onPress={handleAlterarFoto}
                />

                <Text style={styles.profileName} numberOfLines={1}>
                  {nomeExibicao}
                </Text>

                <Text style={styles.profileEmail} numberOfLines={1}>
                  {profile?.email}
                </Text>

                <View style={styles.profileMeta}>
                  <View style={styles.accountBadge}>
                    <View style={styles.accountBadgeDot} />

                    <Text style={styles.accountBadgeText}>
                      {tipoContaLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.photoActionHint}>
                  <Ionicons
                    name={
                      profile?.foto_perfil
                        ? "create-outline"
                        : "add-circle-outline"
                    }
                    size={13}
                    color={COLORS.textBody}
                  />

                  <Text style={styles.photoHint}>
                    {profile?.foto_perfil
                      ? "Toque no lápis para trocar sua foto"
                      : "Toque no + para adicionar sua foto"}
                  </Text>
                </View>
              </View>

              {/* TABS */}

              <TabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                mostrarPets={mostrarAbaPets}
              />

              {/* CONTENT */}

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.contentContainer}
                keyboardVerticalOffset={20}
              >
                {activeTab === "perfil" ? (
                  perfilContent
                ) : activeTab === "pets" && mostrarAbaPets ? (
                  <RegistrarPet /> //
                ) : (
                  <FlatList
                    data={minhasOcorrencias}
                    keyExtractor={(item) => String(item.id_ocorrencia)}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={carregarDados}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                      />
                    }
                    ListHeaderComponent={
                      <View style={styles.occurrencesHeader}>
                        <View>
                          <Text style={styles.sectionTitle}>
                            Minhas ocorrências
                          </Text>

                          <Text style={styles.sectionSubtitle}>
                            Registros relacionados à sua conta.
                          </Text>
                        </View>

                        <View style={styles.occurrenceCountBadge}>
                          <Text style={styles.occurrenceCountText}>
                            {minhasOcorrencias.length}
                          </Text>
                        </View>
                      </View>
                    }
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                          <MaterialCommunityIcons
                            name="paw-outline"
                            size={34}
                            color={COLORS.primary}
                          />
                        </View>

                        <Text style={styles.emptyTitle}>
                          Nenhuma ocorrência
                        </Text>

                        <Text style={styles.emptyText}>
                          Você ainda não registrou nenhuma ocorrência no
                          PetRadar.
                        </Text>
                      </View>
                    }
                    renderItem={({ item }) => (
                      <OcorrenciaCard
                        item={item}
                        onPress={(occurrenceId) =>
                          onOccurrencePress(occurrenceId, carregarDados)
                        }
                      />
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </KeyboardAvoidingView>
            </>
          )}
        </Animated.View>

        <Modal
          transparent
          visible={deleteAccountVisible}
          animationType="fade"
          onRequestClose={handleCloseDeleteModal}
        >
          <KeyboardAvoidingView
            style={styles.deleteModalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Pressable
              style={styles.deleteModalBackdrop}
              onPress={handleCloseDeleteModal}
              disabled={deletingAccount}
              accessibilityLabel="Cancelar exclusão da conta"
            />

            <View style={styles.deleteModalCard}>
              <View style={styles.deleteModalIcon}>
                <Ionicons
                  name="warning-outline"
                  size={26}
                  color={COLORS.danger}
                />
              </View>

              <Text style={styles.deleteModalTitle}>Excluir conta</Text>

              <Text style={styles.deleteModalDescription}>
                Esta ação é permanente. Seus dados e registros associados à sua
                conta serão removidos do PetRadar.
              </Text>

              <Text style={styles.deletePasswordLabel}>Senha atual</Text>

              <View style={styles.deletePasswordWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={COLORS.textBody}
                />

                <TextInput
                  style={styles.deletePasswordInput}
                  value={deletePassword}
                  onChangeText={setDeletePassword}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={COLORS.textBody}
                  secureTextEntry={!showDeletePassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!deletingAccount}
                  accessibilityLabel="Senha atual"
                />

                <Pressable
                  style={styles.deletePasswordToggle}
                  onPress={() => setShowDeletePassword((current) => !current)}
                  disabled={deletingAccount}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showDeletePassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <Ionicons
                    name={showDeletePassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.textBody}
                  />
                </Pressable>
              </View>

              <View style={styles.deleteModalActions}>
                <TouchableOpacity
                  style={styles.deleteModalCancelButton}
                  onPress={handleCloseDeleteModal}
                  disabled={deletingAccount}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar exclusão"
                >
                  <Text style={styles.deleteModalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteModalConfirmButton,
                    deletingAccount && styles.deleteModalButtonDisabled,
                  ]}
                  onPress={handleExcluirConta}
                  disabled={deletingAccount}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir conta definitivamente"
                >
                  {deletingAccount ? (
                    <ActivityIndicator size="small" color={COLORS.surface} />
                  ) : (
                    <>
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={COLORS.surface}
                      />
                      <Text style={styles.deleteModalConfirmText}>
                        Excluir definitivamente
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </Modal>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.52)",
  },

  backdrop: {
    flex: 1,
  },

  drawerContainer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: COLORS.background,

    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,

    overflow: "hidden",

    ...theme.shadows.elevation1,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
  minHeight: 74, // 

  paddingBottom: 10, // 
  paddingHorizontal: 16,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  backgroundColor: COLORS.surface,

  borderBottomWidth: 1,
  borderBottomColor:
    'rgba(15, 23, 42, 0.06)',
},

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.soft,
  },

  logoutHeaderButton: {
    backgroundColor: COLORS.dangerBg,
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textTitle,
    letterSpacing: -0.2,
  },

  headerSubtitle: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textBody,
  },

  // ==========================================================
  // HERO
  // ==========================================================

  profileHero: {
    alignItems: "center",

    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,

    backgroundColor: COLORS.surface,

    overflow: "hidden",

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroGlow: {
    position: "absolute",

    width: 180,
    height: 180,

    borderRadius: 90,

    top: -100,

    backgroundColor: COLORS.successBg,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  avatarRing: {
    width: 104,
    height: 104,

    borderRadius: 52,

    padding: 4,

    backgroundColor: COLORS.successBg,

    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.15)",

    ...theme.shadows.elevation1,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },

  avatarPlaceholder: {
    flex: 1,

    borderRadius: 48,

    backgroundColor: COLORS.soft,

    justifyContent: "center",
    alignItems: "center",
  },

  uploadingOverlay: {
    ...StyleSheet.absoluteFill,

    borderRadius: 52,

    backgroundColor: "rgba(15, 23, 42, 0.68)",

    justifyContent: "center",
    alignItems: "center",
  },

  uploadingText: {
    marginTop: 6,

    fontSize: 10,
    fontWeight: "700",

    color: COLORS.white,
  },

  photoActionBadge: {
    position: "absolute",

    right: 0,
    bottom: 0,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 3,
    borderColor: COLORS.surface,

    ...theme.shadows.buttonGlow,
  },

  photoAddBadge: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: COLORS.primary,
  },

  photoEditBadge: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: COLORS.primary,
  },

  profileName: {
    maxWidth: "90%",

    fontSize: 22,
    fontWeight: "800",

    color: COLORS.textTitle,

    letterSpacing: -0.5,
  },

  profileEmail: {
    maxWidth: "90%",

    marginTop: 4,

    fontSize: 13,
    fontWeight: "500",

    color: COLORS.textBody,
  },

  profileMeta: {
    marginTop: 12,
  },

  accountBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 100,

    backgroundColor: COLORS.successBg,
  },

  accountBadgeDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 7,

    backgroundColor: COLORS.primary,
  },

  accountBadgeText: {
    fontSize: 12,
    fontWeight: "700",

    color: COLORS.primary,
  },

  photoActionHint: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 9,
  },

  photoHint: {
    marginLeft: 4,

    fontSize: 10,
    fontWeight: "500",

    color: COLORS.textBody,
  },

  // ==========================================================
  // TABS
  // ==========================================================

  tabContainer: {
    flexDirection: "row",

    marginHorizontal: 12, //
    marginTop: 14,

    padding: 4,

    borderRadius: 16,

    backgroundColor: "rgba(15, 23, 42, 0.045)",
  },
  tabButton: {
    flex: 1,

    minHeight: 48,

    borderRadius: 13,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 3, // 

    minWidth: 0,

    position: "relative", // 
  },
  tabButtonActive: {
    backgroundColor: COLORS.surface,

    ...theme.shadows.elevation1,
  },

  tabIconContainer: {
    width: 26, //
    height: 26, //

    borderRadius: 9,

    alignItems: "center",
    justifyContent: "center",

    flexShrink: 0, //
  },

  tabIconContainerActive: {
    backgroundColor: COLORS.successBg,
  },

  tabText: {
    marginLeft: 4,

    fontSize: 11, // 
    fontWeight: "600",

    color: COLORS.textBody,

    flexShrink: 1,

    includeFontPadding: false, // 
  },

  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },

  // ==========================================================
  // CONTENT
  // ==========================================================

  contentContainer: {
    flex: 1,
  },

  profileScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  editScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // ==========================================================
  // SECTIONS
  // ==========================================================

  sectionHeader: {
    flexDirection: "row",

    alignItems: "flex-start",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",

    color: COLORS.textTitle,

    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    marginTop: 3,

    fontSize: 12,
    lineHeight: 17,

    color: COLORS.textBody,
  },

  cardSectionTitle: {
    marginTop: 24,
    marginBottom: 10,

    fontSize: 14,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  // ==========================================================
  // EDIT BUTTON
  // ==========================================================

  editButton: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 12,

    backgroundColor: COLORS.successBg,
  },

  editButtonText: {
    marginLeft: 5,

    fontSize: 12,
    fontWeight: "800",

    color: COLORS.primary,
  },

  // ==========================================================
  // INFO CARD
  // ==========================================================

  infoCard: {
    backgroundColor: COLORS.surface,

    borderRadius: 20,

    paddingHorizontal: 16,
    paddingVertical: 4,

    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.055)",

    ...theme.shadows.elevation1,
  },

  infoRow: {
    minHeight: 72,

    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: "600",

    color: COLORS.textBody,

    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    lineHeight: 19,

    fontWeight: "700",

    color: COLORS.textTitle,
  },

  infoDivider: {
    height: 1,

    marginLeft: 52,

    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },

  // ==========================================================
  // ACCOUNT CARD
  // ==========================================================

  accountCard: {
    flexDirection: "row",

    marginTop: 24,
    padding: 16,

    borderRadius: 18,

    backgroundColor: COLORS.successBg,

    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
  },

  accountIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.surface,
  },

  accountContent: {
    flex: 1,
    marginLeft: 12,
  },

  accountTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: COLORS.primary,
  },

  accountDescription: {
    marginTop: 3,

    fontSize: 11,
    lineHeight: 16,

    color: COLORS.textBody,
  },

  manageAccountLabel: {
    marginTop: 24,
    marginBottom: 10,

    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,

    color: COLORS.textBody,
  },

  deleteAccountCard: {
    padding: 16,

    borderRadius: 18,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.dangerBg,

    ...theme.shadows.elevation1,
  },

  deleteAccountHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteAccountIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.dangerBg,
  },

  deleteAccountContent: {
    flex: 1,
    marginLeft: 12,
  },

  deleteAccountTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  deleteAccountDescription: {
    marginTop: 3,

    fontSize: 11,
    lineHeight: 16,

    color: COLORS.textBody,
  },

  deleteAccountButton: {
    minHeight: 46,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 14,

    borderRadius: 14,

    backgroundColor: COLORS.dangerBg,

    borderWidth: 1,
    borderColor: COLORS.danger,
  },

  deleteAccountButtonText: {
    marginLeft: 7,

    fontSize: 13,
    fontWeight: "800",

    color: COLORS.danger,
  },

  // ==========================================================
  // DELETE ACCOUNT MODAL
  // ==========================================================

  deleteModalOverlay: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 20,

    backgroundColor: "rgba(15, 23, 42, 0.62)",
  },

  deleteModalBackdrop: {
    ...StyleSheet.absoluteFill,
  },

  deleteModalCard: {
    width: "100%",
    maxWidth: 420,

    padding: 22,

    borderRadius: 22,

    backgroundColor: COLORS.surface,

    ...theme.shadows.elevation1,
  },

  deleteModalIcon: {
    width: 52,
    height: 52,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.dangerBg,
  },

  deleteModalTitle: {
    marginTop: 16,

    fontSize: 20,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  deleteModalDescription: {
    marginTop: 8,

    fontSize: 13,
    lineHeight: 19,

    color: COLORS.textBody,
  },

  deletePasswordLabel: {
    marginTop: 20,
    marginBottom: 8,

    fontSize: 12,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  deletePasswordWrapper: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 14,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: COLORS.dangerBg,

    backgroundColor: COLORS.surface,
  },

  deletePasswordInput: {
    flex: 1,

    marginLeft: 10,
    paddingVertical: 0,

    fontSize: 14,

    color: COLORS.textTitle,
  },

  deletePasswordToggle: {
    width: 48,
    minHeight: 50,

    alignItems: "center",
    justifyContent: "center",
  },

  deleteModalActions: {
    marginTop: 20,
    gap: 10,
  },

  deleteModalCancelButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.dangerBg,
  },

  deleteModalCancelText: {
    fontSize: 13,
    fontWeight: "700",

    color: COLORS.textBody,
  },

  deleteModalConfirmButton: {
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: COLORS.danger,
  },

  deleteModalButtonDisabled: {
    opacity: 0.7,
  },

  deleteModalConfirmText: {
    marginLeft: 7,

    fontSize: 13,
    fontWeight: "800",

    color: COLORS.surface,
  },

  // ==========================================================
  // EDITING
  // ==========================================================

  editingIndicator: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 100,

    backgroundColor: COLORS.warningBg,
  },

  editingDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,

    backgroundColor: COLORS.warning,
  },

  editingText: {
    fontSize: 10,
    fontWeight: "800",

    color: COLORS.warning,
  },

  formCard: {
    padding: 16,

    borderRadius: 20,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.055)",

    ...theme.shadows.elevation1,
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    marginBottom: 8,

    fontSize: 12,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  inputWrapper: {
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",

    backgroundColor: COLORS.soft,
  },

  inputWrapperMultiline: {
    alignItems: "flex-start",
    paddingTop: 13,
  },

  multilineIcon: {
    marginTop: 2,
  },

  input: {
    flex: 1,

    marginLeft: 10,

    paddingVertical: 0,

    fontSize: 14,
    fontWeight: "600",

    color: COLORS.textTitle,
  },

  multilineInput: {
    minHeight: 76,

    paddingTop: 0,

    lineHeight: 20,
  },

  inputSuffix: {
    marginLeft: 6,

    fontSize: 13,
    fontWeight: "800",

    color: COLORS.primary,
  },

  helperText: {
    marginTop: 7,

    fontSize: 11,
    lineHeight: 16,

    color: COLORS.textBody,
  },

  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",

    paddingTop: 4,
  },

  preferenceIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.successBg,
  },

  preferenceContent: {
    flex: 1,

    marginHorizontal: 12,
  },

  preferenceTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  preferenceDescription: {
    marginTop: 2,

    fontSize: 11,
    lineHeight: 16,

    color: COLORS.textBody,
  },

  // ==========================================================
  // SWITCH
  // ==========================================================

  switchTrack: {
    width: 52,
    height: 30,

    padding: 2,

    borderRadius: 15,

    justifyContent: "center",

    backgroundColor: "#CBD5E1",
  },

  switchTrackActive: {
    backgroundColor: COLORS.primary,
  },

  switchThumb: {
    width: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: COLORS.white,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },

  // ==========================================================
  // ACTIONS
  // ==========================================================

  editActions: {
    marginTop: 16,
    gap: 10,
  },

  primaryButton: {
    minHeight: 52,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 15,

    backgroundColor: COLORS.primary,

    ...theme.shadows.buttonGlow,
  },

  primaryButtonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    marginLeft: 8,

    fontSize: 14,
    fontWeight: "800",

    color: COLORS.white,
  },

  secondaryButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 15,

    backgroundColor: COLORS.soft,

    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",

    color: COLORS.textBody,
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingBottom: 60,
  },

  loadingContent: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 50,
  },

  loadingIcon: {
    width: 62,
    height: 62,

    borderRadius: 31,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,

    backgroundColor: COLORS.successBg,
  },

  loadingText: {
    marginTop: 12,

    fontSize: 13,
    fontWeight: "600",

    color: COLORS.textBody,
  },

  // ==========================================================
  // OCORRÊNCIAS
  // ==========================================================

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  occurrencesHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  occurrenceCountBadge: {
    minWidth: 34,
    height: 34,

    paddingHorizontal: 9,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.successBg,
  },

  occurrenceCountText: {
    fontSize: 12,
    fontWeight: "800",

    color: COLORS.primary,
  },

  occurrenceCard: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
    padding: 12,

    borderRadius: 18,

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.055)",

    ...theme.shadows.elevation1,
  },

  occurrenceCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  occurrenceImageWrapper: {
    width: 76,
    height: 76,

    borderRadius: 15,

    overflow: "hidden",

    backgroundColor: COLORS.soft,
  },

  occurrenceImage: {
    width: "100%",
    height: "100%",
  },

  occurrenceImagePlaceholder: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  occurrenceInfo: {
    flex: 1,

    marginLeft: 12,
    marginRight: 7,
  },

  occurrenceTopRow: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,
  },

  statusDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: "900",
  },

  urgencyText: {
    maxWidth: 80,

    fontSize: 10,
    fontWeight: "600",

    color: COLORS.textBody,
  },

  animalName: {
    marginTop: 8,

    fontSize: 15,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  locationRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 4,
  },

  locationText: {
    flex: 1,

    marginLeft: 3,

    fontSize: 10,

    color: COLORS.textBody,
  },

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  emptyContainer: {
    alignItems: "center",

    paddingHorizontal: 30,
    paddingTop: 60,
  },

  emptyIcon: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.successBg,
  },

  emptyTitle: {
    marginTop: 18,

    fontSize: 16,
    fontWeight: "800",

    color: COLORS.textTitle,
  },

  emptyText: {
    maxWidth: 280,

    marginTop: 7,

    fontSize: 12,
    lineHeight: 18,

    textAlign: "center",

    color: COLORS.textBody,
  },
});
