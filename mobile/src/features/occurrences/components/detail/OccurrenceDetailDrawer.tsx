import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../../../store/useAuthStore";
import { theme } from "../../../../theme/colors";
import { useOccurrenceCare } from "../../hooks/useOccurrenceCare";
import { useOccurrenceDetail } from "../../hooks/useOccurrenceDetail";
import { occurrenceDetailContentStyles as contentStyles } from "../../styles/detail/occurrenceDetailContent.styles";
import { occurrenceDetailDrawerStyles as styles } from "../../styles/detail/occurrenceDetailDrawer.styles";
import { formatarData } from "../../utils/occurrenceFormatters";
import { normalizarTexto } from "../../utils/occurrenceDetail.utils";
import OccurrenceCommentsModal from "../comments/OccurrenceCommentsModal";
import OccurrenceCareHistoryModal from "./OccurrenceCareHistoryModal";
import OccurrenceCareSection from "./OccurrenceCareSection";
import OccurrenceDetailHeader from "./OccurrenceDetailHeader";
import OccurrenceDetailsCard from "./OccurrenceDetailsCard";
import OccurrenceManagementSection from "./OccurrenceManagementSection";
import OccurrenceStatusBadges from "./OccurrenceStatusBadges";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 430);

interface OccurrenceDetailDrawerProps {
  visible: boolean;
  occurrenceId: number | null;
  onClose: () => void;
  onEdit: (occurrenceId: number) => void;
  onDeleted: (occurrenceId: number) => void | Promise<void>;
}

export default function OccurrenceDetailDrawer({
  visible,
  occurrenceId,
  onClose,
  onEdit,
  onDeleted,
}: OccurrenceDetailDrawerProps) {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [comentariosVisiveis, setComentariosVisiveis] = useState(false);
  const detail = useOccurrenceDetail({ visible, occurrenceId });
  const care = useOccurrenceCare({
    visible,
    occurrenceId,
    occurrence: detail.occurrence,
    setOccurrence: detail.setOccurrence,
  });

  useEffect(() => {
    if (!visible || occurrenceId === null) {
      return;
    }

    setMounted(true);
    setComentariosVisiveis(false);
    translateX.setValue(DRAWER_WIDTH);
    overlayOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, occurrenceId, translateX, overlayOpacity]);

  const limparEstado = () => {
    setMounted(false);
    setComentariosVisiveis(false);
    detail.limparDetalhe();
    care.limparCuidados();
  };

  const animarFechamento = (aposFechar?: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 230,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      limparEstado();
      onClose();
      aposFechar?.();
    });
  };

  const fechar = () => animarFechamento();

  const editarOcorrencia = () => {
    if (!detail.occurrence) {
      return;
    }
    const id = detail.occurrence.id_ocorrencia;
    animarFechamento(() => onEdit(id));
  };

  const excluirOcorrencia = async () => {
    const id = await detail.excluirOcorrencia();
    if (id === null) {
      return;
    }

    animarFechamento(() => {
      void (async () => {
        try {
          await onDeleted(id);
        } catch (err: unknown) {
          console.warn(
            "[OccurrenceDetailDrawer] Erro ao atualizar ocorrências após exclusão:",
            err,
          );
        } finally {
          Alert.alert(
            "Ocorrência excluída",
            "A ocorrência foi removida com sucesso.",
          );
        }
      })();
    });
  };

  const confirmarExclusao = () => {
    if (detail.excluindo) {
      return;
    }

    Alert.alert(
      "Excluir ocorrência?",
      "Esta ação removerá permanentemente esta ocorrência e os registros relacionados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void excluirOcorrencia(),
        },
      ],
    );
  };

  if (!mounted) {
    return null;
  }

  const occurrence = detail.occurrence;
  const tituloOcorrencia =
    normalizarTexto(occurrence?.tipo_ocorrencia) || "Ocorrência";
  const nomeAnimal =
    normalizarTexto(occurrence?.tipo_animal) || "Animal não informado";
  const ehProprietario = Boolean(
    occurrence && Number(user?.id) === occurrence.id_conta,
  );

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={fechar}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable
            style={styles.overlayPressable}
            accessibilityRole="button"
            accessibilityLabel="Fechar detalhes da ocorrência"
            onPress={fechar}
          />
        </Animated.View>

        <OccurrenceCareHistoryModal
          visible={care.historicoVisivel}
          historico={care.historico}
          loading={care.carregandoHistorico}
          error={care.erroHistorico}
          onClose={() => care.setHistoricoVisivel(false)}
          onRetry={() => void care.carregarHistorico()}
        />

        <OccurrenceCommentsModal
          visible={comentariosVisiveis}
          occurrenceId={occurrence?.id_ocorrencia ?? null}
          onClose={() => setComentariosVisiveis(false)}
        />

        <Animated.View
          style={[
            styles.drawer,
            { width: DRAWER_WIDTH, transform: [{ translateX }] },
          ]}
        >
          <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
            <OccurrenceDetailHeader
              occurrenceId={occurrence?.id_ocorrencia ?? null}
              onClose={fechar}
            />

            {detail.loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingIcon}>
                  <MaterialCommunityIcons
                    name="paw"
                    size={31}
                    color={theme.colors.brand}
                  />
                </View>
                <ActivityIndicator color={theme.colors.brand} />
                <Text style={styles.loadingTitle}>Carregando ocorrência</Text>
                <Text style={styles.loadingText}>
                  Buscando os dados registrados.
                </Text>
              </View>
            ) : detail.error ? (
              <View style={styles.errorContainer}>
                <View style={styles.errorIcon}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={32}
                    color={theme.colors.semantic.danger.text}
                  />
                </View>
                <Text style={styles.errorTitle}>Não foi possível carregar</Text>
                <Text style={styles.errorText}>{detail.error}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                  onPress={fechar}
                  style={({ pressed }) => [
                    styles.errorButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.errorButtonText}>Fechar</Text>
                </Pressable>
              </View>
            ) : occurrence ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={contentStyles.hero}>
                  <View style={contentStyles.photoContainer}>
                    {normalizarTexto(occurrence.foto) ? (
                      <Image
                        source={{ uri: occurrence.foto }}
                        style={contentStyles.photo}
                        resizeMode="cover"
                        accessibilityLabel="Foto da ocorrência"
                      />
                    ) : (
                      <View style={contentStyles.photoPlaceholder}>
                        <MaterialCommunityIcons
                          name="paw"
                          size={48}
                          color={theme.colors.brand}
                        />
                        <Text style={contentStyles.photoPlaceholderText}>
                          Foto não disponível
                        </Text>
                      </View>
                    )}

                    <View style={contentStyles.photoShade} />
                    <View style={contentStyles.photoOccurrenceTag}>
                      <Ionicons
                        name="alert-circle"
                        size={15}
                        color={theme.colors.surface}
                      />
                      <Text style={contentStyles.photoOccurrenceTagText}>
                        {tituloOcorrencia}
                      </Text>
                    </View>
                    <View style={contentStyles.photoActions}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Abrir comentários da ocorrência"
                        accessibilityHint="Abre a conversa da comunidade sobre esta ocorrência"
                        hitSlop={6}
                        onPress={() => setComentariosVisiveis(true)}
                        style={({ pressed }) => [
                          contentStyles.photoCommentButton,
                          pressed && contentStyles.photoCommentButtonPressed,
                        ]}
                      >
                        <Ionicons
                          name="chatbubble-outline"
                          size={20}
                          color={theme.colors.brand}
                        />
                      </Pressable>
                      <View style={contentStyles.photoIdTag}>
                        <Text style={contentStyles.photoIdTagText}>
                          #{occurrence.id_ocorrencia}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={contentStyles.heroContent}>
                    <View style={contentStyles.heroHeading}>
                      <View style={contentStyles.heroHeadingText}>
                        <Text style={contentStyles.animalName} numberOfLines={1}>
                          {nomeAnimal}
                        </Text>
                        {normalizarTexto(occurrence.raca) ? (
                          <Text style={contentStyles.animalBreed} numberOfLines={1}>
                            {occurrence.raca}
                          </Text>
                        ) : null}
                      </View>
                      <OccurrenceStatusBadges
                        variant="status"
                        value={occurrence.status_badge}
                      />
                    </View>

                    <View style={contentStyles.occurrenceSummary}>
                      <View style={contentStyles.summaryRow}>
                        <View style={contentStyles.summaryIcon}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color={theme.colors.brand}
                          />
                        </View>
                        <View style={contentStyles.summaryContent}>
                          <Text style={contentStyles.summaryLabel}>
                            Local da ocorrência
                          </Text>
                          <Text style={contentStyles.summaryValue}>
                            {normalizarTexto(occurrence.endereco_localizacao) ||
                              "Localização não informada"}
                          </Text>
                        </View>
                      </View>
                      <View style={contentStyles.summaryDivider} />
                      <View style={contentStyles.summaryRow}>
                        <View style={contentStyles.summaryIcon}>
                          <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={theme.colors.brand}
                          />
                        </View>
                        <View style={contentStyles.summaryContent}>
                          <Text style={contentStyles.summaryLabel}>
                            Data da ocorrência
                          </Text>
                          <Text style={contentStyles.summaryValue}>
                            {formatarData(occurrence.data_ocorrencia)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <OccurrenceStatusBadges
                      variant="urgency"
                      value={occurrence.nivel_urgencia}
                    />
                  </View>
                </View>

                <OccurrenceDetailsCard
                  occurrence={occurrence}
                  careSection={
                    <OccurrenceCareSection
                      occurrence={occurrence}
                      loadingType={care.tipoCuidadoCarregando}
                      error={care.erroCuidado}
                      onRegister={care.registrarCuidadoAgora}
                      onOpenHistory={care.abrirHistorico}
                    />
                  }
                  managementSection={
                    <OccurrenceManagementSection
                      visible={ehProprietario}
                      excluding={detail.excluindo}
                      onEdit={editarOcorrencia}
                      onDelete={confirmarExclusao}
                    />
                  }
                />
              </ScrollView>
            ) : null}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
