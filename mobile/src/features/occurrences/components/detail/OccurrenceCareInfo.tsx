import { Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { occurrenceCareStyles as styles } from "../../styles/detail/occurrenceCare.styles";
import type {
  CuidadoOcorrencia,
  TipoCuidado,
} from "../../types/occurrenceDetail.types";
import { formatarDataHora } from "../../utils/occurrenceFormatters";

interface OccurrenceCareInfoProps {
  tipo: TipoCuidado;
  cuidado: CuidadoOcorrencia | null;
}

export default function OccurrenceCareInfo({
  tipo,
  cuidado,
}: OccurrenceCareInfoProps) {
  const agua = tipo === "AGUA";

  return (
    <View style={styles.careInfo}>
      <View style={styles.careInfoIcon}>
        <MaterialCommunityIcons
          name={agua ? "water" : "food"}
          size={20}
          color={theme.colors.brand}
        />
      </View>
      <View style={styles.careInfoContent}>
        <Text style={styles.careInfoLabel}>
          {agua ? "Última água" : "Última comida"}
        </Text>
        <Text style={styles.careInfoDate}>
          {cuidado ? formatarDataHora(cuidado.data_cuidado) : "Não registrada"}
        </Text>
        {cuidado ? (
          <View style={styles.authorRow}>
            <Ionicons
              name="person-outline"
              size={13}
              color={theme.colors.textBody}
            />
            <Text style={styles.careInfoAuthor} numberOfLines={1}>
              {cuidado.usuario.nome}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
