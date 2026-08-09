import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../theme/colors";
import api from "../services/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DRAWER_WIDTH = Math.min(
  SCREEN_WIDTH * 0.88,
  430
);

interface OccurrenceDetailDrawerProps {
  visible: boolean;
  occurrenceId: number | null;
  onClose: () => void;
}

interface Avistamento {
  id_avistamento: number;
  raca: string | null;
  data_hora: string;
  foto: string | null;
  observacao: string | null;
}

interface OcorrenciaDetalhe {
  id_ocorrencia: number;
  id_conta: number;

  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;

  raca: string | null;
  sexo: string | null;
  cor: string | null;
  porte: string | null;
  idade: string | null;

  saude_critica: boolean;
  saude_detalhes: string | null;

  cuidados_iniciais: string | null;

  deficiencia: boolean;
  deficiencia_detalhes: string | null;

  nivel_urgencia: string;

  data_ocorrencia: string;
  endereco_localizacao: string | null;

  foto: string;
  observacao: string | null;

  avistamentos: Avistamento[];
}

const COLORS = {
  background: theme.colors.background,
  surface: theme.colors.surface,
  title: theme.colors.textTitle,
  body: theme.colors.textBody,
  brand: theme.colors.brand,

  danger: theme.colors.semantic.danger.text,
  dangerBg: theme.colors.semantic.danger.bg,

  warning: theme.colors.semantic.warning.text,
  warningBg: theme.colors.semantic.warning.bg,

  success: theme.colors.semantic.success.text,
  successBg: theme.colors.semantic.success.bg,

  border: theme.colors.inputBg,

  white: "#FFFFFF",
  muted: "#94A3B8",
  soft: "#F8FAFC",
};

function formatarData(data: string) {
  if (!data) {
    return "Data não informada";
  }

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarDataHora(data: string) {
  if (!data) {
    return "Data não informada";
  }

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return `${date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} • ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function normalizarTexto(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const texto = String(value).trim();

  return texto.length > 0 ? texto : null;
}

function getStatusColors(status: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "PERDIDO") {
    return {
      text: COLORS.danger,
      background: COLORS.dangerBg,
    };
  }

  if (normalized === "AVISTADO") {
    return {
      text: COLORS.warning,
      background: COLORS.warningBg,
    };
  }

  return {
    text: COLORS.brand,
    background: COLORS.successBg,
  };
}

function getUrgencyColors(urgencia: string) {
  const normalized = urgencia?.toUpperCase();

  if (
    normalized.includes("CRÍT") ||
    normalized.includes("CRIT")
  ) {
    return {
      text: COLORS.danger,
      background: COLORS.dangerBg,
    };
  }

  if (
    normalized.includes("ALTA") ||
    normalized.includes("ALTO")
  ) {
    return {
      text: COLORS.warning,
      background: COLORS.warningBg,
    };
  }

  return {
    text: COLORS.success,
    background: COLORS.successBg,
  };
}

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | null | undefined;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  const normalizedValue = normalizarTexto(value);

  if (!normalizedValue) {
    return null;
  }

  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={17}
          color={COLORS.brand}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {normalizedValue}
        </Text>
      </View>
    </View>
  );
}

interface SectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}

function Section({
  icon,
  title,
  children,
}: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons
            name={icon}
            size={18}
            color={COLORS.brand}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>
      </View>

      {children}
    </View>
  );
}

export default function OccurrenceDetailDrawer({
  visible,
  occurrenceId,
  onClose,
}: OccurrenceDetailDrawerProps) {
  const translateX = useRef(
    new Animated.Value(DRAWER_WIDTH)
  ).current;

  const overlayOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const [occurrence, setOccurrence] =
    useState<OcorrenciaDetalhe | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    if (!visible || occurrenceId === null) {
      return;
    }

    setMounted(true);
    setLoading(true);
    setError(null);
    setOccurrence(null);

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

    const carregarDetalhes = async () => {
      try {
        const response = await api.get(
          `/ocorrencias/${occurrenceId}`
        );

        setOccurrence(response.data);
      } catch (err: any) {
        console.warn(
          "[OccurrenceDetailDrawer] Erro ao carregar ocorrência:",
          err
        );

        const mensagem =
          err?.response?.data?.detail ||
          "Não foi possível carregar os detalhes da ocorrência.";

        setError(mensagem);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [
    visible,
    occurrenceId,
    translateX,
    overlayOpacity,
  ]);

  const fechar = () => {
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
      setMounted(false);
      setOccurrence(null);
      setError(null);
      onClose();
    });
  };

  if (!mounted) {
    return null;
  }

  const statusColors = occurrence
    ? getStatusColors(
        occurrence.status_badge
      )
    : getStatusColors("");

  const urgencyColors = occurrence
    ? getUrgencyColors(
        occurrence.nivel_urgencia
      )
    : getUrgencyColors("");

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={fechar}
    >
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFillObject}
            accessibilityRole="button"
            accessibilityLabel="Fechar detalhes da ocorrência"
            onPress={fechar}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              transform: [
                {
                  translateX,
                },
              ],
            },
          ]}
        >
          <SafeAreaView
            edges={["top", "bottom"]}
            style={styles.safeArea}
          >
            <View style={styles.header}>
              <View style={styles.headerTitleArea}>
                <Text style={styles.headerEyebrow}>
                  DETALHES DA OCORRÊNCIA
                </Text>

                {occurrence && (
                  <Text
                    style={styles.headerTitle}
                    numberOfLines={1}
                  >
                    #{occurrence.id_ocorrencia}
                  </Text>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar detalhes"
                onPress={fechar}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <Ionicons
                  name="close"
                  size={23}
                  color={COLORS.title}
                />
              </Pressable>
            </View>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={COLORS.brand}
                />

                <Text style={styles.loadingTitle}>
                  Carregando ocorrência
                </Text>

                <Text style={styles.loadingText}>
                  Buscando todos os detalhes...
                </Text>
              </View>
            )}

            {!loading && error && (
              <View style={styles.errorContainer}>
                <View style={styles.errorIcon}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={34}
                    color={COLORS.danger}
                  />
                </View>

                <Text style={styles.errorTitle}>
                  Não foi possível carregar
                </Text>

                <Text style={styles.errorText}>
                  {error}
                </Text>

                <Pressable
                  onPress={fechar}
                  style={styles.errorButton}
                >
                  <Text style={styles.errorButtonText}>
                    Fechar
                  </Text>
                </Pressable>
              </View>
            )}

            {!loading &&
              !error &&
              occurrence && (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={
                    styles.scrollContent
                  }
                >
                  <View style={styles.hero}>
                    <Image
                      source={{
                        uri: occurrence.foto,
                      }}
                      style={styles.heroImage}
                    />

                    <View
                      style={styles.heroGradient}
                    />

                    <View
                      style={styles.heroBadges}
                    >
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              statusColors.background,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor:
                                statusColors.text,
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                statusColors.text,
                            },
                          ]}
                        >
                          {occurrence.status_badge}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              urgencyColors.background,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="alert-circle-outline"
                          size={14}
                          color={
                            urgencyColors.text
                          }
                        />

                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                urgencyColors.text,
                            },
                          ]}
                        >
                          {occurrence.nivel_urgencia}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={styles.identityBlock}
                  >
                    <Text style={styles.animalType}>
                      {occurrence.tipo_animal ||
                        "Animal"}
                    </Text>

                    {normalizarTexto(
                      occurrence.raca
                    ) && (
                      <Text style={styles.breed}>
                        {occurrence.raca}
                      </Text>
                    )}

                    <View
                      style={styles.locationRow}
                    >
                      <Ionicons
                        name="location-outline"
                        size={17}
                        color={COLORS.brand}
                      />

                      <Text
                        style={styles.locationText}
                      >
                        {occurrence.endereco_localizacao ||
                          "Localização não informada"}
                      </Text>
                    </View>

                    <View
                      style={styles.dateRow}
                    >
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={COLORS.body}
                      />

                      <Text
                        style={styles.dateText}
                      >
                        Registrado em{" "}
                        {formatarData(
                          occurrence.data_ocorrencia
                        )}
                      </Text>
                    </View>
                  </View>

                  <Section
                    icon="paw-outline"
                    title="Sobre o animal"
                  >
                    <View
                      style={styles.infoGrid}
                    >
                      <InfoItem
                        icon="paw-outline"
                        label="Tipo"
                        value={
                          occurrence.tipo_animal
                        }
                      />

                      <InfoItem
                        icon="ribbon-outline"
                        label="Raça"
                        value={occurrence.raca}
                      />

                      <InfoItem
                        icon="male-female-outline"
                        label="Sexo"
                        value={occurrence.sexo}
                      />

                      <InfoItem
                        icon="color-palette-outline"
                        label="Cor"
                        value={occurrence.cor}
                      />

                      <InfoItem
                        icon="resize-outline"
                        label="Porte"
                        value={occurrence.porte}
                      />

                      <InfoItem
                        icon="calendar-outline"
                        label="Idade"
                        value={occurrence.idade}
                      />
                    </View>
                  </Section>

                  {(occurrence.saude_critica ||
                    normalizarTexto(
                      occurrence.saude_detalhes
                    )) && (
                    <Section
                      icon="medkit-outline"
                      title="Estado de saúde"
                    >
                      <View
                        style={[
                          styles.alertCard,
                          {
                            backgroundColor:
                              occurrence.saude_critica
                                ? COLORS.dangerBg
                                : COLORS.soft,
                            borderColor:
                              occurrence.saude_critica
                                ? COLORS.danger
                                : COLORS.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            occurrence.saude_critica
                              ? "warning-outline"
                              : "information-circle-outline"
                          }
                          size={21}
                          color={
                            occurrence.saude_critica
                              ? COLORS.danger
                              : COLORS.brand
                          }
                        />

                        <View
                          style={
                            styles.alertContent
                          }
                        >
                          <Text
                            style={[
                              styles.alertTitle,
                              {
                                color:
                                  occurrence.saude_critica
                                    ? COLORS.danger
                                    : COLORS.title,
                              },
                            ]}
                          >
                            {occurrence.saude_critica
                              ? "Atenção necessária"
                              : "Informação de saúde"}
                          </Text>

                          {normalizarTexto(
                            occurrence.saude_detalhes
                          ) && (
                            <Text
                              style={
                                styles.alertText
                              }
                            >
                              {
                                occurrence.saude_detalhes
                              }
                            </Text>
                          )}
                        </View>
                      </View>
                    </Section>
                  )}

                  {(occurrence.deficiencia ||
                    normalizarTexto(
                      occurrence.deficiencia_detalhes
                    )) && (
                    <Section
                      icon="accessibility-outline"
                      title="Deficiência"
                    >
                      <View
                        style={styles.textCard}
                      >
                        <Text
                          style={
                            styles.textCardText
                          }
                        >
                          {occurrence.deficiencia_detalhes ||
                            "Há uma deficiência registrada para este animal."}
                        </Text>
                      </View>
                    </Section>
                  )}

                  {normalizarTexto(
                    occurrence.cuidados_iniciais
                  ) && (
                    <Section
                      icon="heart-outline"
                      title="Cuidados iniciais"
                    >
                      <View
                        style={styles.textCard}
                      >
                        <Text
                          style={
                            styles.textCardText
                          }
                        >
                          {
                            occurrence.cuidados_iniciais
                          }
                        </Text>
                      </View>
                    </Section>
                  )}

                  {normalizarTexto(
                    occurrence.observacao
                  ) && (
                    <Section
                      icon="document-text-outline"
                      title="Observação"
                    >
                      <View
                        style={styles.observationCard}
                      >
                        <Text
                          style={
                            styles.observationText
                          }
                        >
                          {occurrence.observacao}
                        </Text>
                      </View>
                    </Section>
                  )}

                  <Section
                    icon="eye-outline"
                    title="Avistamentos"
                  >
                    {occurrence.avistamentos &&
                    occurrence.avistamentos.length >
                      0 ? (
                      <View
                        style={
                          styles.sightingsList
                        }
                      >
                        {occurrence.avistamentos.map(
                          (avistamento) => (
                            <View
                              key={
                                avistamento.id_avistamento
                              }
                              style={
                                styles.sightingCard
                              }
                            >
                              {avistamento.foto ? (
                                <Image
                                  source={{
                                    uri:
                                      avistamento.foto,
                                  }}
                                  style={
                                    styles.sightingImage
                                  }
                                />
                              ) : (
                                <View
                                  style={
                                    styles.sightingImagePlaceholder
                                  }
                                >
                                  <Ionicons
                                    name="eye-outline"
                                    size={22}
                                    color={
                                      COLORS.muted
                                    }
                                  />
                                </View>
                              )}

                              <View
                                style={
                                  styles.sightingContent
                                }
                              >
                                <Text
                                  style={
                                    styles.sightingDate
                                  }
                                >
                                  {formatarDataHora(
                                    avistamento.data_hora
                                  )}
                                </Text>

                                {normalizarTexto(
                                  avistamento.raca
                                ) && (
                                  <Text
                                    style={
                                      styles.sightingBreed
                                    }
                                  >
                                    Raça informada:{" "}
                                    {
                                      avistamento.raca
                                    }
                                  </Text>
                                )}

                                {normalizarTexto(
                                  avistamento.observacao
                                ) && (
                                  <Text
                                    style={
                                      styles.sightingObservation
                                    }
                                    numberOfLines={3}
                                  >
                                    {
                                      avistamento.observacao
                                    }
                                  </Text>
                                )}
                              </View>
                            </View>
                          )
                        )}
                      </View>
                    ) : (
                      <View
                        style={
                          styles.emptySightings
                        }
                      >
                        <View
                          style={
                            styles.emptySightingsIcon
                          }
                        >
                          <Ionicons
                            name="eye-outline"
                            size={24}
                            color={COLORS.muted}
                          />
                        </View>

                        <Text
                          style={
                            styles.emptySightingsTitle
                          }
                        >
                          Nenhum avistamento
                        </Text>

                        <Text
                          style={
                            styles.emptySightingsText
                          }
                        >
                          Ainda não há avistamentos
                          registrados para esta
                          ocorrência.
                        </Text>
                      </View>
                    )}
                  </Section>

                  <View
                    style={styles.footerInfo}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={17}
                      color={COLORS.muted}
                    />

                    <Text
                      style={styles.footerInfoText}
                    >
                      Ocorrência #{occurrence.id_ocorrencia}
                    </Text>
                  </View>
                </ScrollView>
              )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(15, 23, 42, 0.50)",
  },

  drawer: {
    height: "100%",
    marginLeft: "auto",
    backgroundColor: COLORS.background,

    shadowColor: "#000",
    shadowOffset: {
      width: -6,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,

    elevation: 24,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    minHeight: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  headerTitleArea: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: COLORS.brand,
    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.title,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.soft,
  },

  closeButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },

  scrollContent: {
    paddingBottom: 34,
  },

  hero: {
    width: "100%",
    height: 265,
    backgroundColor: COLORS.soft,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
    backgroundColor:
      "rgba(0,0,0,0.30)",
  },

  heroBadges: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  identityBlock: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
    backgroundColor: COLORS.surface,
  },

  animalType: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    color: COLORS.title,
  },

  breed: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.body,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    gap: 7,
  },

  locationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: COLORS.title,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 7,
  },

  dateText: {
    fontSize: 12,
    color: COLORS.body,
    fontWeight: "500",
  },

  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.successBg,
    marginRight: 9,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.title,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },

  infoItem: {
    width: "50%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },

  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.soft,
    marginBottom: 6,
  },

  infoContent: {
    paddingLeft: 1,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  infoValue: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: COLORS.title,
  },

  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },

  alertContent: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },

  alertText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.body,
  },

  textCard: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  textCardText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.body,
  },

  observationCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.soft,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand,
  },

  observationText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.title,
    fontWeight: "500",
  },

  sightingsList: {
    gap: 10,
  },

  sightingCard: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sightingImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
  },

  sightingImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.soft,
  },

  sightingContent: {
    flex: 1,
    marginLeft: 11,
    justifyContent: "center",
  },

  sightingDate: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.title,
  },

  sightingBreed: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.body,
  },

  sightingObservation: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.body,
  },

  emptySightings: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  emptySightingsIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.soft,
    marginBottom: 9,
  },

  emptySightingsTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.title,
  },

  emptySightingsText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: COLORS.body,
  },

  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 28,
    marginBottom: 8,
  },

  footerInfoText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  loadingTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.title,
  },

  loadingText: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.body,
    textAlign: "center",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.dangerBg,
    marginBottom: 16,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.title,
  },

  errorText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: COLORS.body,
  },

  errorButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.brand,
  },

  errorButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
});