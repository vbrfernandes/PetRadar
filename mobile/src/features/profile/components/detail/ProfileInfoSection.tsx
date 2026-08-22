import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { profileDetailStyles as styles } from "../../styles/detail/profileDetail.styles";
import { profileCommonStyles as commonStyles } from "../../styles/profileCommon.styles";
import type { UserProfile } from "../../types/profile.types";
import ProfileInfoRow from "./ProfileInfoRow";

interface ProfileInfoSectionProps {
  profile: UserProfile | null;
  displayName: string;
  onEdit: () => void;
}

export default function ProfileInfoSection({
  profile,
  displayName,
  onEdit,
}: ProfileInfoSectionProps) {
  return (
    <>
      <View style={commonStyles.sectionHeader}>
        <View>
          <Text style={commonStyles.sectionTitle}>Informações</Text>
          <Text style={commonStyles.sectionSubtitle}>
            Dados associados à sua conta.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={theme.colors.brand}
          />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <ProfileInfoRow
          icon="person-outline"
          label={
            profile?.tipo_conta === "ONG" ? "Nome fantasia" : "Nome completo"
          }
          value={displayName}
        />
        <View style={styles.infoDivider} />
        <ProfileInfoRow
          icon="mail-outline"
          label="E-mail"
          value={profile?.email || "Não informado"}
        />
        <View style={styles.infoDivider} />
        <ProfileInfoRow
          icon="call-outline"
          label="Telefone"
          value={profile?.telefone || "Não informado"}
        />
      </View>

      {profile?.tipo_conta === "PESSOA_FISICA" && (
        <>
          <Text style={styles.cardSectionTitle}>Preferências</Text>
          <View style={styles.infoCard}>
            <ProfileInfoRow
              icon="location-outline"
              label="Raio de pesquisa"
              value={`${profile?.raio_pesquisa_km ?? 10} km`}
            />
            <View style={styles.infoDivider} />
            <ProfileInfoRow
              icon="heart-outline"
              label="Possui pet"
              value={profile?.tem_pet ? "Sim" : "Não"}
              iconBackground={
                profile?.tem_pet
                  ? theme.colors.semantic.success.bg
                  : theme.colors.semantic.warning.bg
              }
            />
          </View>
        </>
      )}

      {profile?.tipo_conta === "ONG" && (
        <>
          <Text style={styles.cardSectionTitle}>Instituição</Text>
          <View style={styles.infoCard}>
            <ProfileInfoRow
              icon="business-outline"
              label="Razão social"
              value={profile?.razao_social || "Não informado"}
            />
            <View style={styles.infoDivider} />
            <ProfileInfoRow
              icon="document-text-outline"
              label="CNPJ"
              value={profile?.cnpj || "Não informado"}
            />
            <View style={styles.infoDivider} />
            <ProfileInfoRow
              icon="location-outline"
              label="Endereço"
              value={profile?.endereco_completo || "Não informado"}
            />
            <View style={styles.infoDivider} />
            <ProfileInfoRow
              icon="person-outline"
              label="Responsável"
              value={profile?.nome_gestor || "Não informado"}
            />
          </View>
        </>
      )}
    </>
  );
}
