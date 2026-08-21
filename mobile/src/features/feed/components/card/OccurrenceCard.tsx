import React from "react";
import { View } from "react-native";

import type { OcorrenciaFeed } from "../../types/feed.types";
import { ehUrgente } from "../../utils/feed.utils";
import {
  formatarDistancia,
  formatarQuantidadeComentarios,
  formatarTempoRelativo,
  obterDescricaoOcorrencia,
  obterIniciais,
  obterStatusVisual,
  obterTituloOcorrencia,
} from "../../utils/feedFormatters";
import { occurrenceCardStyles as styles } from "../../styles/occurrenceCard.styles";
import OccurrenceCardActions from "./OccurrenceCardActions";
import OccurrenceCardContent from "./OccurrenceCardContent";
import OccurrenceCardHeader from "./OccurrenceCardHeader";
import OccurrenceCardImage from "./OccurrenceCardImage";

interface OccurrenceCardProps {
  occurrence: OcorrenciaFeed;
  forcaLoading: boolean;
  onPress: (occurrenceId: number) => void;
  onToggleForca: (occurrenceId: number) => void;
  onOpenOptions: (occurrenceId: number) => void;
}

export default function OccurrenceCard({
  occurrence,
  forcaLoading,
  onPress,
  onToggleForca,
  onOpenOptions,
}: OccurrenceCardProps) {
  const occurrenceId = occurrence.id_ocorrencia;
  const title = obterTituloOcorrencia(occurrence);
  const autorNome = occurrence.autor_nome?.trim() || "Usuário PetRadar";
  const autorFoto = occurrence.autor_foto?.trim() || null;
  const foto =
    typeof occurrence.foto === "string" && occurrence.foto.trim().length > 0
      ? occurrence.foto
      : null;
  const usuarioDeuForca = Boolean(occurrence.usuario_deu_forca);
  const totalForca = Math.max(0, Number(occurrence.total_forca ?? 0));

  return (
    <View style={styles.card}>
      <OccurrenceCardHeader
        occurrenceId={occurrenceId}
        title={title}
        autorNome={autorNome}
        autorFoto={autorFoto}
        autorIniciais={obterIniciais(autorNome)}
        status={obterStatusVisual(occurrence)}
        urgente={ehUrgente(occurrence.nivel_urgencia)}
        onPress={onPress}
        onOpenOptions={onOpenOptions}
      />
      <OccurrenceCardImage
        occurrenceId={occurrenceId}
        title={title}
        foto={foto}
        onPress={onPress}
      />
      <OccurrenceCardActions
        occurrenceId={occurrenceId}
        forcaLoading={forcaLoading}
        usuarioDeuForca={usuarioDeuForca}
        totalForca={totalForca}
        comentarios={formatarQuantidadeComentarios(
          occurrence.total_comentarios,
        )}
        onToggleForca={onToggleForca}
      />
      <OccurrenceCardContent
        occurrenceId={occurrenceId}
        title={title}
        descricao={obterDescricaoOcorrencia(occurrence)}
        tempo={formatarTempoRelativo(occurrence.data_ocorrencia)}
        distancia={formatarDistancia(occurrence.distancia_km)}
        onPress={onPress}
      />
    </View>
  );
}
