import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceCareStyles as styles } from "../../styles/detail/occurrenceCare.styles";
import { occurrenceDetailContentStyles as contentStyles } from "../../styles/detail/occurrenceDetailContent.styles";
import { occurrenceDetailDrawerStyles as drawerStyles } from "../../styles/detail/occurrenceDetailDrawer.styles";
import type {
  OcorrenciaDetalhe,
  TipoCuidado,
} from "../../types/occurrenceDetail.types";
import { normalizarTexto } from "../../utils/occurrenceDetail.utils";
import OccurrenceCareButton from "./OccurrenceCareButton";
import OccurrenceCareInfo from "./OccurrenceCareInfo";
import { OccurrenceSectionHeader } from "./OccurrenceDetailsCard";

interface OccurrenceCareSectionProps {
  occurrence: OcorrenciaDetalhe;
  loadingType: TipoCuidado | null;
  error: string | null;
  onRegister: (tipo: TipoCuidado) => void;
  onOpenHistory: () => void;
}

export default function OccurrenceCareSection({
  occurrence,
  loadingType,
  error,
  onRegister,
  onOpenHistory,
}: OccurrenceCareSectionProps) {
  return (
    <View style={contentStyles.section}>
      <OccurrenceSectionHeader
        title="Cuidados iniciais"
        subtitle="Registre o cuidado no momento em que ele for realizado."
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir histórico de cuidados"
            onPress={onOpenHistory}
            style={({ pressed }) => [
              styles.historyButton,
              pressed && drawerStyles.pressed,
            ]}
          >
            <Ionicons name="time-outline" size={16} color={theme.colors.brand} />
            <Text style={styles.historyButtonText}>Histórico</Text>
          </Pressable>
        }
      />

      <View style={styles.careActionsCard}>
        <View style={styles.careButtonRow}>
          <OccurrenceCareButton
            tipo="AGUA"
            disabled={loadingType !== null}
            loading={loadingType === "AGUA"}
            onPress={onRegister}
          />
          <OccurrenceCareButton
            tipo="COMIDA"
            disabled={loadingType !== null}
            loading={loadingType === "COMIDA"}
            onPress={onRegister}
          />
        </View>
        {error ? (
          <View style={styles.careError}>
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={theme.colors.semantic.danger.text}
            />
            <Text style={styles.careErrorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.subsectionTitle}>Últimos cuidados</Text>
      <View style={styles.careInfoCard}>
        <OccurrenceCareInfo
          tipo="AGUA"
          cuidado={occurrence.cuidados_atuais?.agua || null}
        />
        <View style={styles.careInfoDivider} />
        <OccurrenceCareInfo
          tipo="COMIDA"
          cuidado={occurrence.cuidados_atuais?.comida || null}
        />
      </View>

      {normalizarTexto(occurrence.cuidados_iniciais) ? (
        <View style={styles.legacyCareCard}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={theme.colors.brand}
          />
          <Text style={styles.legacyCareText}>
            Registro inicial: {occurrence.cuidados_iniciais}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
