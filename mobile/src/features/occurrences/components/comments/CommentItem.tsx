import { Alert, Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { commentItemStyles as styles } from "../../styles/comments/commentItem.styles";
import type {
  AutorComentario,
  ComentarioOcorrencia,
} from "../../types/occurrenceComment.types";
import { obterIniciais } from "../../utils/occurrenceComment.utils";
import { formatarHorarioComentario } from "../../utils/occurrenceFormatters";

interface CommentItemProps {
  comentario: ComentarioOcorrencia;
  meu: boolean;
  podeResponder?: boolean;
  onAuthorPress: (author: AutorComentario) => void;
  onReply: (comentario: ComentarioOcorrencia) => void;
  onEdit: (comentario: ComentarioOcorrencia) => void;
  onDelete: (comentario: ComentarioOcorrencia) => void;
}

export default function CommentItem({
  comentario,
  meu,
  podeResponder = true,
  onAuthorPress,
  onReply,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const nome = comentario.autor.nome?.trim() || "Usuário PetRadar";
  const foto = comentario.autor.foto?.trim() || null;
  const excluido = comentario.excluido_em !== null;
  const editado = comentario.editado_em !== null;
  const abrirAutor = () => onAuthorPress(comentario.autor);

  const abrirOpcoes = () => {
    if (!meu || excluido) {
      return;
    }

    Alert.alert("Comentário", "Escolha uma ação para o seu comentário.", [
      { text: "Editar", onPress: () => onEdit(comentario) },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => onDelete(comentario),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.commentRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver identificação de ${nome}`}
        onPress={abrirAutor}
        style={({ pressed }) => [
          styles.commentAvatar,
          pressed && styles.authorPressed,
        ]}
      >
        {foto ? (
          <Image
            source={{ uri: foto }}
            style={styles.commentAvatarImage}
            accessibilityLabel={`Foto de ${nome}`}
          />
        ) : (
          <Text style={styles.commentAvatarInitials}>{obterIniciais(nome)}</Text>
        )}
      </Pressable>

      <View style={styles.commentBody}>
        <View style={styles.commentHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver identificação de ${nome}`}
            onPress={abrirAutor}
            style={({ pressed }) => [
              styles.commentAuthorButton,
              pressed && styles.authorPressed,
            ]}
          >
            <Text style={styles.commentAuthorName} numberOfLines={1}>
              {nome}
            </Text>

            {meu ? (
              <View style={styles.youBadge}>
                <Text style={styles.youBadgeText}>Você</Text>
              </View>
            ) : null}
          </Pressable>

          <View style={styles.commentHeaderRight}>
            <View style={styles.commentMeta}>
              <Text style={styles.commentTime}>
                {formatarHorarioComentario(comentario.data_hora)}
              </Text>
              {editado && !excluido ? (
                <Text style={styles.commentEdited}>• editado</Text>
              ) : null}
            </View>

            {meu && !excluido ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Opções do comentário"
                accessibilityHint="Permite editar ou excluir seu comentário"
                hitSlop={6}
                onPress={abrirOpcoes}
                style={({ pressed }) => [
                  styles.commentOptionsButton,
                  pressed && styles.authorPressed,
                ]}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={17}
                  color={theme.colors.textBody}
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        {excluido ? (
          <Text style={styles.deletedCommentText}>Comentário excluído</Text>
        ) : (
          <>
            <Text style={styles.commentText}>{comentario.texto}</Text>
            {podeResponder ? (
              <View style={styles.commentActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Responder comentário de ${nome}`}
                  onPress={() => onReply(comentario)}
                  style={({ pressed }) => [
                    styles.replyButton,
                    pressed && styles.replyButtonPressed,
                  ]}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={13}
                    color={theme.colors.brand}
                  />
                  <Text style={styles.replyButtonText}>Responder</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
}
