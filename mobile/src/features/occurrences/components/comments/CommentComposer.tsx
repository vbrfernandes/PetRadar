import type { RefObject } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";
import { occurrenceCommentsModalStyles as styles } from "../../styles/comments/occurrenceCommentsModal.styles";
import type { ComentarioOcorrencia } from "../../types/occurrenceComment.types";

interface CommentComposerProps {
  inputRef: RefObject<TextInput | null>;
  texto: string;
  enviando: boolean;
  comentarioEmAcaoId: number | null;
  respondendoA: ComentarioOcorrencia | null;
  editandoComentario: ComentarioOcorrencia | null;
  onChangeText: (value: string) => void;
  onCancelMode: () => void;
  onSubmit: () => void;
}

export default function CommentComposer({
  inputRef,
  texto,
  enviando,
  comentarioEmAcaoId,
  respondendoA,
  editandoComentario,
  onChangeText,
  onCancelMode,
  onSubmit,
}: CommentComposerProps) {
  return (
    <>
      {respondendoA || editandoComentario ? (
        <View style={styles.composerMode}>
          <View style={styles.composerModeIcon}>
            <Ionicons
              name={editandoComentario ? "create-outline" : "chatbubble-outline"}
              size={16}
              color={theme.colors.brand}
            />
          </View>

          <View style={styles.composerModeContent}>
            <Text style={styles.composerModeTitle} numberOfLines={1}>
              {editandoComentario
                ? "Editando seu comentário"
                : `Respondendo a ${
                    respondendoA?.autor.nome?.trim() || "Usuário PetRadar"
                  }`}
            </Text>
            <Text style={styles.composerModeText} numberOfLines={1}>
              {editandoComentario
                ? "Altere o texto e toque em salvar."
                : respondendoA?.texto || ""}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              editandoComentario ? "Cancelar edição" : "Cancelar resposta"
            }
            onPress={onCancelMode}
            hitSlop={8}
            style={({ pressed }) => [
              styles.composerModeClose,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="close" size={18} color={theme.colors.textBody} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.composer}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            value={texto}
            onChangeText={onChangeText}
            placeholder={
              editandoComentario
                ? "Edite seu comentário..."
                : respondendoA
                  ? "Escreva uma resposta..."
                  : "Escreva um comentário..."
            }
            placeholderTextColor={theme.colors.textBody}
            multiline
            maxLength={1000}
            editable={!enviando && comentarioEmAcaoId === null}
            textAlignVertical="center"
            style={styles.input}
            accessibilityLabel={
              editandoComentario
                ? "Editar comentário"
                : respondendoA
                  ? "Resposta do comentário"
                  : "Mensagem do comentário"
            }
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            editandoComentario
              ? "Salvar edição"
              : respondendoA
                ? "Enviar resposta"
                : "Enviar comentário"
          }
          accessibilityState={{
            disabled: enviando || texto.trim().length === 0,
          }}
          disabled={enviando || texto.trim().length === 0}
          onPress={onSubmit}
          style={({ pressed }) => [
            styles.sendButton,
            (enviando || texto.trim().length === 0) && styles.sendButtonDisabled,
            pressed &&
              !enviando &&
              texto.trim().length > 0 &&
              styles.sendButtonPressed,
          ]}
        >
          {enviando ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            <Ionicons
              name={editandoComentario ? "checkmark" : "send"}
              size={editandoComentario ? 22 : 19}
              color={theme.colors.surface}
            />
          )}
        </Pressable>
      </View>
    </>
  );
}
