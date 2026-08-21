import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import type { AutorComentario } from "../../types/occurrenceComment.types";

import {
  theme,
} from "../../../../theme";

import { commentAuthorModalStyles as styles } from "../../styles/comments/commentAuthor.styles";
import { obterIniciais } from "../../utils/occurrenceComment.utils";

interface CommentAuthorModalProps {
  visible: boolean;
  author: AutorComentario | null;
  onClose: () => void;
}




export default function CommentAuthorModal({
  visible,
  author,
  onClose,
}: CommentAuthorModalProps) {
  if (!author) {
    return null;
  }

  const foto =
    author.foto?.trim() ||
    null;

  const nome =
    author.nome?.trim() ||
    "Usuário PetRadar";

  const tipoConta =
    author.tipo_conta === "ONG"
      ? "ONG / Instituição"
      : "Pessoa Física";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Fechar identificação do perfil"
          onPress={onClose}
        />

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="person-outline"
                size={17}
                color={theme.colors.brand}
              />
            </View>

            <Text style={styles.headerTitle}>
              Identificação do perfil
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="close"
                size={21}
                color={theme.colors.textTitle}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.avatar}>
              {foto ? (
                <Image
                  source={{
                    uri: foto,
                  }}
                  style={styles.avatarImage}
                  accessibilityLabel={`Foto de ${nome}`}
                />
              ) : (
                <Text style={styles.avatarInitials}>
                  {obterIniciais(nome)}
                </Text>
              )}
            </View>

            <Text
              style={styles.name}
              numberOfLines={2}
            >
              {nome}
            </Text>

            <View style={styles.typeBadge}>
              <Ionicons
                name={
                  author.tipo_conta === "ONG"
                    ? "business-outline"
                    : "person-outline"
                }
                size={14}
                color={theme.colors.brand}
              />

              <Text style={styles.typeText}>
                {tipoConta}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={theme.colors.brand}
                  />
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    Perfil PetRadar
                  </Text>

                  <Text style={styles.infoValue}>
                    Identificação #{author.id_conta}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.helperText}>
              São exibidas apenas informações públicas de
              identificação deste perfil.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
