import React from "react";
import { Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceDetailContentStyles as styles } from "../../styles/detail/occurrenceDetailContent.styles";
import type {
  DetailItem,
  OcorrenciaDetalhe,
} from "../../types/occurrenceDetail.types";
import { normalizarTexto } from "../../utils/occurrenceDetail.utils";

interface OccurrenceSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function OccurrenceSectionHeader({
  title,
  subtitle,
  action,
}: OccurrenceSectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

function DetailsRows({ items }: { items: DetailItem[] }) {
  const itensValidos = items
    .map((item) => ({ ...item, valueNormalized: normalizarTexto(item.value) }))
    .filter(
      (item): item is DetailItem & { valueNormalized: string } =>
        item.valueNormalized !== null,
    );

  if (itensValidos.length === 0) {
    return null;
  }

  return (
    <View style={styles.detailsCard}>
      {itensValidos.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name={item.icon} size={19} color={theme.colors.brand} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue} numberOfLines={3}>
                {item.valueNormalized}
              </Text>
            </View>
          </View>
          {index < itensValidos.length - 1 ? (
            <View style={styles.detailDivider} />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
}

interface OccurrenceDetailsCardProps {
  occurrence: OcorrenciaDetalhe;
  careSection: React.ReactNode;
  managementSection: React.ReactNode;
}

export default function OccurrenceDetailsCard({
  occurrence,
  careSection,
  managementSection,
}: OccurrenceDetailsCardProps) {
  return (
    <View style={styles.content}>
      <View style={styles.section}>
        <OccurrenceSectionHeader
          title="Sobre o animal"
          subtitle="Características informadas nesta ocorrência."
        />
        <DetailsRows
          items={[
            { icon: "paw-outline", label: "Animal", value: occurrence.tipo_animal },
            { icon: "ribbon-outline", label: "Raça", value: occurrence.raca },
            { icon: "male-female-outline", label: "Sexo", value: occurrence.sexo },
            { icon: "color-palette-outline", label: "Cor", value: occurrence.cor },
            { icon: "resize-outline", label: "Porte", value: occurrence.porte },
            { icon: "calendar-outline", label: "Idade", value: occurrence.idade },
          ]}
        />
      </View>

      {occurrence.saude_critica || normalizarTexto(occurrence.saude_detalhes) ? (
        <View style={styles.section}>
          <OccurrenceSectionHeader
            title="Estado de saúde"
            subtitle="Condição registrada para este animal."
          />
          <View
            style={[
              styles.alertCard,
              occurrence.saude_critica
                ? styles.alertCardDanger
                : styles.alertCardNeutral,
            ]}
          >
            <View
              style={[
                styles.alertIcon,
                occurrence.saude_critica
                  ? styles.alertIconDanger
                  : styles.alertIconNeutral,
              ]}
            >
              <Ionicons
                name={occurrence.saude_critica ? "warning-outline" : "medkit-outline"}
                size={22}
                color={
                  occurrence.saude_critica
                    ? theme.colors.semantic.danger.text
                    : theme.colors.brand
                }
              />
            </View>
            <View style={styles.alertContent}>
              <Text
                style={[
                  styles.alertTitle,
                  {
                    color: occurrence.saude_critica
                      ? theme.colors.semantic.danger.text
                      : theme.colors.textTitle,
                  },
                ]}
              >
                {occurrence.saude_critica
                  ? "Atenção necessária"
                  : "Informação de saúde"}
              </Text>
              <Text style={styles.alertText}>
                {normalizarTexto(occurrence.saude_detalhes) ||
                  "Existe uma informação de saúde registrada para este animal."}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {occurrence.deficiencia ||
      normalizarTexto(occurrence.deficiencia_detalhes) ? (
        <View style={styles.section}>
          <OccurrenceSectionHeader
            title="Necessidades especiais"
            subtitle="Cuidados específicos registrados."
          />
          <View style={styles.specialCareCard}>
            <View style={styles.specialCareIcon}>
              <Ionicons
                name="accessibility-outline"
                size={22}
                color={theme.colors.brand}
              />
            </View>
            <View style={styles.specialCareContent}>
              <Text style={styles.specialCareTitle}>Atenção especial</Text>
              <Text style={styles.specialCareText}>
                {normalizarTexto(occurrence.deficiencia_detalhes) ||
                  "Existe uma deficiência registrada para este animal."}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {careSection}

      {normalizarTexto(occurrence.observacao) ? (
        <View style={styles.section}>
          <OccurrenceSectionHeader
            title="Observações da ocorrência"
            subtitle="Informações adicionais fornecidas no registro."
          />
          <View style={styles.observationCard}>
            <View style={styles.observationIcon}>
              <Ionicons
                name="document-text-outline"
                size={21}
                color={theme.colors.brand}
              />
            </View>
            <Text style={styles.observationText}>{occurrence.observacao}</Text>
          </View>
        </View>
      ) : null}

      {managementSection}

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <View style={styles.footerContent}>
          <MaterialCommunityIcons
            name="paw-outline"
            size={16}
            color={theme.colors.muted}
          />
          <Text style={styles.footerText}>
            Ocorrência #{occurrence.id_ocorrencia}
          </Text>
        </View>
      </View>
    </View>
  );
}
