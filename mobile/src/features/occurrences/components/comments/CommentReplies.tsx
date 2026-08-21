import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { commentItemStyles as styles } from "../../styles/comments/commentItem.styles";
import type {
  AutorComentario,
  ComentarioOcorrencia,
  RespostasPorComentario,
} from "../../types/occurrenceComment.types";
import { contarRespostas } from "../../utils/occurrenceComment.utils";
import CommentItem from "./CommentItem";

interface CommentRepliesProps {
  comentario: ComentarioOcorrencia;
  respostasPorPai: RespostasPorComentario;
  respostasVisiveis: boolean;
  meuId: number;
  onToggle: () => void;
  onHide: () => void;
  onAuthorPress: (author: AutorComentario) => void;
  onReply: (comentario: ComentarioOcorrencia) => void;
  onEdit: (comentario: ComentarioOcorrencia) => void;
  onDelete: (comentario: ComentarioOcorrencia) => void;
}

export default function CommentReplies({
  comentario,
  respostasPorPai,
  respostasVisiveis,
  meuId,
  onToggle,
  onHide,
  onAuthorPress,
  onReply,
  onEdit,
  onDelete,
}: CommentRepliesProps) {
  const respostas = respostasPorPai.get(comentario.id_comentario) ?? [];
  const quantidadeRespostas = contarRespostas(
    comentario.id_comentario,
    respostasPorPai,
  );

  if (quantidadeRespostas === 0) {
    return null;
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          respostasVisiveis
            ? "Ocultar respostas"
            : `Mostrar ${quantidadeRespostas} ${
                quantidadeRespostas === 1 ? "resposta" : "respostas"
              }`
        }
        onPress={onToggle}
        style={({ pressed }) => [
          styles.repliesToggleButton,
          pressed && styles.repliesToggleButtonPressed,
        ]}
      >
        <View style={styles.repliesToggleLine} />
        <Ionicons
          name={respostasVisiveis ? "chevron-up" : "chevron-down"}
          size={14}
          color={theme.colors.brand}
        />
        <Text style={styles.repliesToggleText}>
          {respostasVisiveis
            ? `${quantidadeRespostas} ${
                quantidadeRespostas === 1 ? "resposta" : "respostas"
              }`
            : `Ver ${quantidadeRespostas} ${
                quantidadeRespostas === 1 ? "resposta" : "respostas"
              }`}
        </Text>
      </Pressable>

      {respostasVisiveis ? (
        <View style={styles.repliesContainer}>
          {respostas.map((resposta, index) => {
            const respostasDaResposta =
              respostasPorPai.get(resposta.id_comentario) ?? [];

            return (
              <View
                key={resposta.id_comentario}
                style={[
                  styles.replyItem,
                  index > 0 && styles.replyItemWithSpacing,
                ]}
              >
                <CommentItem
                  comentario={resposta}
                  meu={Number(resposta.id_conta) === meuId}
                  podeResponder
                  onAuthorPress={onAuthorPress}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />

                {respostasDaResposta.length > 0 ? (
                  <View style={styles.nestedRepliesContainer}>
                    {respostasDaResposta.map((respostaFinal, finalIndex) => (
                      <View
                        key={respostaFinal.id_comentario}
                        style={[
                          styles.nestedReplyItem,
                          finalIndex > 0 && styles.nestedReplyItemWithSpacing,
                        ]}
                      >
                        <CommentItem
                          comentario={respostaFinal}
                          meu={Number(respostaFinal.id_conta) === meuId}
                          podeResponder={false}
                          onAuthorPress={onAuthorPress}
                          onReply={onReply}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ocultar respostas"
            onPress={onHide}
            style={({ pressed }) => [
              styles.hideRepliesButton,
              pressed && styles.repliesToggleButtonPressed,
            ]}
          >
            <Ionicons name="chevron-up" size={14} color={theme.colors.brand} />
            <Text style={styles.hideRepliesText}>Ocultar respostas</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}
