import { FlatList, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { commentItemStyles } from "../../styles/comments/commentItem.styles";
import { occurrenceCommentsModalStyles as styles } from "../../styles/comments/occurrenceCommentsModal.styles";
import type {
  AutorComentario,
  ComentarioOcorrencia,
  RespostasPorComentario,
} from "../../types/occurrenceComment.types";
import CommentItem from "./CommentItem";
import CommentReplies from "./CommentReplies";

interface CommentListProps {
  comentarios: ComentarioOcorrencia[];
  respostasPorPai: RespostasPorComentario;
  comentariosExpandidos: Set<number>;
  meuId: number;
  onAuthorPress: (author: AutorComentario) => void;
  onReply: (comentario: ComentarioOcorrencia) => void;
  onEdit: (comentario: ComentarioOcorrencia) => void;
  onDelete: (comentario: ComentarioOcorrencia) => void;
  onToggleReplies: (commentId: number) => void;
  onHideReplies: (commentId: number) => void;
}

export default function CommentList({
  comentarios,
  respostasPorPai,
  comentariosExpandidos,
  meuId,
  onAuthorPress,
  onReply,
  onEdit,
  onDelete,
  onToggleReplies,
  onHideReplies,
}: CommentListProps) {
  return (
    <FlatList
      data={comentarios}
      keyExtractor={(item) => String(item.id_comentario)}
      renderItem={({ item }) => (
        <View style={commentItemStyles.commentThread}>
          <CommentItem
            comentario={item}
            meu={Number(item.id_conta) === meuId}
            podeResponder
            onAuthorPress={onAuthorPress}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <CommentReplies
            comentario={item}
            respostasPorPai={respostasPorPai}
            respostasVisiveis={comentariosExpandidos.has(item.id_comentario)}
            meuId={meuId}
            onToggle={() => onToggleReplies(item.id_comentario)}
            onHide={() => onHideReplies(item.id_comentario)}
            onAuthorPress={onAuthorPress}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </View>
      )}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.messagesList,
        comentarios.length === 0 && styles.messagesListEmpty,
      ]}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={30}
              color={theme.colors.brand}
            />
          </View>
          <Text style={styles.emptyTitle}>Nenhum comentário ainda</Text>
          <Text style={styles.emptyText}>
            Compartilhe uma informação útil sobre esta ocorrência e ajude outras
            pessoas da comunidade.
          </Text>
        </View>
      }
      ItemSeparatorComponent={() => (
        <View style={commentItemStyles.commentSeparator} />
      )}
    />
  );
}
