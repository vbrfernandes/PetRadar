import React from "react";

import { ScrollView, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme/colors";

import { profileEditStyles as styles } from "../../styles/edit/profileEdit.styles";
import { profileCommonStyles as commonStyles } from "../../styles/profileCommon.styles";
import type {
  ProfileFormFieldSetter,
  ProfileFormValues,
  UserProfile,
} from "../../types/profile.types";
import ProfileEditActions from "./ProfileEditActions";
import ProfileEditField from "./ProfileEditField";
import ProfilePetSwitch from "./ProfilePetSwitch";

interface ProfileEditFormProps {
  accountType: UserProfile["tipo_conta"] | undefined;
  values: ProfileFormValues;
  setField: ProfileFormFieldSetter;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  accountType,
  values,
  setField,
  saving,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.editScrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={commonStyles.sectionHeader}>
        <View>
          <Text style={commonStyles.sectionTitle}>Editar perfil</Text>
          <Text style={commonStyles.sectionSubtitle}>
            Atualize suas informações pessoais.
          </Text>
        </View>

        <View style={styles.editingIndicator}>
          <View style={styles.editingDot} />
          <Text style={styles.editingText}>Editando</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <ProfileEditField
          label={accountType === "ONG" ? "Nome fantasia" : "Nome completo"}
          icon="person-outline"
          value={values.nome}
          onChangeText={(value) => setField("nome", value)}
          placeholder={accountType === "ONG" ? "Nome da ONG" : "Seu nome completo"}
          autoCapitalize="words"
          accessibilityLabel={
            accountType === "ONG" ? "Nome fantasia" : "Nome completo"
          }
        />

        <ProfileEditField
          label="Telefone / WhatsApp"
          icon="call-outline"
          value={values.telefone}
          onChangeText={(value) => setField("telefone", value)}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          accessibilityLabel="Telefone"
        />

        {accountType === "PESSOA_FISICA" && (
          <>
            <ProfileEditField
              label="Raio de pesquisa"
              icon="location-outline"
              value={values.raio}
              onChangeText={(value) => setField("raio", value)}
              placeholder="10"
              keyboardType="number-pad"
              maxLength={3}
              accessibilityLabel="Raio de pesquisa em quilômetros"
              suffix="km"
              helper="Defina uma área entre 1 e 100 km para receber informações relevantes."
            />

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceIcon}>
                <MaterialCommunityIcons
                  name="paw-outline"
                  size={21}
                  color={theme.colors.brand}
                />
              </View>
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceTitle}>Tenho um pet</Text>
                <Text style={styles.preferenceDescription}>
                  Ajuda a personalizar sua experiência no PetRadar.
                </Text>
              </View>
              <ProfilePetSwitch
                value={values.temPet}
                onChange={() => setField("temPet", !values.temPet)}
              />
            </View>
          </>
        )}

        {accountType === "ONG" && (
          <ProfileEditField
            label="Endereço completo"
            icon="location-outline"
            value={values.endereco}
            onChangeText={(value) => setField("endereco", value)}
            placeholder="Endereço da instituição"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            accessibilityLabel="Endereço completo"
          />
        )}
      </View>

      <ProfileEditActions
        saving={saving}
        onSave={onSave}
        onCancel={onCancel}
      />
    </ScrollView>
  );
}
