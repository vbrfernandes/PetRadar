import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../../../store";
import { theme } from "../../../../theme";
import { useOccurrenceComments } from "../../hooks/useOccurrenceComments";
import { occurrenceCommentsModalStyles as styles } from "../../styles/comments/occurrenceCommentsModal.styles";
import CommentAuthorModal from "./CommentAuthorModal";
import CommentComposer from "./CommentComposer";
import CommentList from "./CommentList";

interface OccurrenceCommentsModalProps {
  visible: boolean;
  occurrenceId: number | null;
  onClose: () => void;
}

export default function OccurrenceCommentsModal({
  visible,
  occurrenceId,
  onClose,
}: OccurrenceCommentsModalProps) {
  const user = useAuthStore((state) => state.user);
  const comments = useOccurrenceComments({ visible, occurrenceId });
  const meuId = Number(user?.id);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Fechar comentários"
          onPress={onClose}
        />

        <CommentAuthorModal
          visible={comments.autorSelecionado !== null}
          author={comments.autorSelecionado}
          onClose={() => comments.setAutorSelecionado(null)}
        />

        <View
          style={[
            styles.panel,
            comments.expandido ? styles.panelExpanded : styles.panelCollapsed,
          ]}
        >
          <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
            {!comments.expandido ? (
              <View style={styles.handleArea}>
                <View style={styles.handle} />
              </View>
            ) : null}

            <View style={styles.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar comentários"
                hitSlop={8}
                onPress={onClose}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="close" size={22} color={theme.colors.textTitle} />
              </Pressable>

              <View style={styles.headerContent}>
                <View style={styles.headerTitleRow}>
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={18}
                    color={theme.colors.brand}
                  />
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    Comentários
                  </Text>
                </View>
                <Text style={styles.headerSubtitle}>
                  {occurrenceId !== null
                    ? `Ocorrência #${occurrenceId}`
                    : "Ocorrência"}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  comments.expandido
                    ? "Reduzir comentários"
                    : "Abrir comentários em tela cheia"
                }
                accessibilityHint={
                  comments.expandido
                    ? "Volta ao painel de comentários"
                    : "Expande os comentários para ocupar toda a tela"
                }
                onPress={() => comments.setExpandido((atual) => !atual)}
                style={({ pressed }) => [
                  styles.headerButton,
                  styles.expandButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={comments.expandido ? "contract-outline" : "expand-outline"}
                  size={20}
                  color={theme.colors.brand}
                />
              </Pressable>
            </View>

            <View style={styles.contextBar}>
              <View style={styles.contextIcon}>
                <MaterialCommunityIcons
                  name="paw"
                  size={16}
                  color={theme.colors.brand}
                />
              </View>
              <View style={styles.contextContent}>
                <Text style={styles.contextTitle}>Comentários da comunidade</Text>
                <Text style={styles.contextText} numberOfLines={1}>
                  Compartilhe informações úteis sobre esta ocorrência.
                </Text>
              </View>
            </View>

            <View style={styles.messagesContainer}>
              {comments.carregando ? (
                <View style={styles.stateContainer}>
                  <View style={styles.stateIcon}>
                    <ActivityIndicator color={theme.colors.brand} />
                  </View>
                  <Text style={styles.stateTitle}>Carregando comentários</Text>
                  <Text style={styles.stateText}>
                    Buscando os comentários desta ocorrência.
                  </Text>
                </View>
              ) : comments.erro && comments.comentarios.length === 0 ? (
                <View style={styles.stateContainer}>
                  <View style={[styles.stateIcon, styles.errorStateIcon]}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={25}
                      color={theme.colors.semantic.danger.text}
                    />
                  </View>
                  <Text style={styles.stateTitle}>Não foi possível carregar</Text>
                  <Text style={styles.stateText}>{comments.erro}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tentar carregar comentários novamente"
                    onPress={() => void comments.carregarComentarios()}
                    style={({ pressed }) => [
                      styles.retryButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={17}
                      color={theme.colors.brand}
                    />
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </Pressable>
                </View>
              ) : (
                <CommentList
                  comentarios={comments.comentariosRaiz}
                  respostasPorPai={comments.respostasPorPai}
                  comentariosExpandidos={comments.comentariosExpandidos}
                  meuId={meuId}
                  onAuthorPress={comments.setAutorSelecionado}
                  onReply={comments.iniciarResposta}
                  onEdit={comments.iniciarEdicao}
                  onDelete={comments.solicitarExclusao}
                  onToggleReplies={comments.alternarRespostas}
                  onHideReplies={comments.ocultarRespostas}
                />
              )}
            </View>

            {comments.erro && comments.comentarios.length > 0 ? (
              <View style={styles.inlineError}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={theme.colors.semantic.danger.text}
                />
                <Text style={styles.inlineErrorText}>{comments.erro}</Text>
              </View>
            ) : null}

            <CommentComposer
              inputRef={comments.inputRef}
              texto={comments.texto}
              enviando={comments.enviando}
              comentarioEmAcaoId={comments.comentarioEmAcaoId}
              respondendoA={comments.respondendoA}
              editandoComentario={comments.editandoComentario}
              onChangeText={comments.setTexto}
              onCancelMode={comments.cancelarModoComposer}
              onSubmit={() => void comments.enviarComentario()}
            />
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
