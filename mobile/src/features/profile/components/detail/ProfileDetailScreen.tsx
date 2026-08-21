import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "../../../../store/useAuthStore";
import PetsTab from "../../../pets/components/PetsTab";
import { useProfile } from "../../hooks/useProfile";
import { useProfileDeleteAccount } from "../../hooks/useProfileDeleteAccount";
import { useProfileForm } from "../../hooks/useProfileForm";
import { useProfileOccurrences } from "../../hooks/useProfileOccurrences";
import { useProfilePhoto } from "../../hooks/useProfilePhoto";
import {
  PROFILE_DRAWER_WIDTH,
  profileDetailStyles as styles,
} from "../../styles/detail/profileDetail.styles";
import type {
  ProfileOccurrencePressHandler,
  ProfileTab,
  ProfileUpdateResult,
} from "../../types/profile.types";
import {
  getProfileAccountTypeLabel,
  getProfileDisplayName,
} from "../../utils/profileMappers";
import ProfileAccountSection from "../account/ProfileAccountSection";
import ProfileDeleteAccountModal from "../account/ProfileDeleteAccountModal";
import ProfileDeleteAccountSection from "../account/ProfileDeleteAccountSection";
import ProfileEditForm from "../edit/ProfileEditForm";
import ProfileOccurrencesTab from "../occurrences/ProfileOccurrencesTab";
import ProfileLoadingState from "../states/ProfileLoadingState";
import ProfileHeader from "./ProfileHeader";
import ProfileHero from "./ProfileHero";
import ProfileInfoSection from "./ProfileInfoSection";
import ProfileTabBar from "./ProfileTabBar";

interface ProfileDetailProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: ProfileUpdateResult) => void;
  onOccurrencePress: ProfileOccurrencePressHandler;
}

export default function ProfileDetailScreen({
  visible,
  onClose,
  onProfileUpdated,
  onOccurrencePress,
}: ProfileDetailProps) {
  const { logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>("perfil");
  const translateX = useRef(
    new Animated.Value(PROFILE_DRAWER_WIDTH),
  ).current;

  const {
    profile,
    loading,
    carregarPerfil,
    atualizarProfile,
    atualizarFoto,
  } = useProfile();
  const {
    minhasOcorrencias,
    refreshing,
    carregarOcorrencias,
  } = useProfileOccurrences();
  const {
    values,
    isEditing,
    saving,
    setField,
    preencherCampos,
    iniciarEdicao,
    cancelarEdicao,
    fecharEdicao,
    salvarPerfil,
  } = useProfileForm({
    profile,
    onProfileChanged: atualizarProfile,
    onProfileUpdated,
  });
  const { uploadingImage, alterarFoto } = useProfilePhoto({
    profile,
    onPhotoUpdated: atualizarFoto,
  });
  const {
    deleteAccountVisible,
    deletePassword,
    deletingAccount,
    showDeletePassword,
    setDeletePassword,
    abrirDeleteAccount,
    fecharDeleteAccount,
    resetDeleteAccount,
    togglePasswordVisibility,
    excluirConta,
  } = useProfileDeleteAccount({
    logout,
    onCloseProfile: onClose,
  });

  const carregarDados = useCallback(
    () =>
      carregarPerfil(async (loadedProfile) => {
        preencherCampos(loadedProfile);
        await carregarOcorrencias();
      }),
    [carregarOcorrencias, carregarPerfil, preencherCampos],
  );

  const mostrarAbaPets =
    profile?.tipo_conta === "PESSOA_FISICA" && profile?.tem_pet === true;

  useEffect(() => {
    if (activeTab === "pets" && !mostrarAbaPets) {
      setActiveTab("perfil");
    }
  }, [activeTab, mostrarAbaPets]);

  useEffect(() => {
    if (visible) {
      void carregarDados();

      Animated.timing(translateX, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      fecharEdicao();
      resetDeleteAccount();

      Animated.timing(translateX, {
        toValue: PROFILE_DRAWER_WIDTH,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [
    visible,
    carregarDados,
    fecharEdicao,
    resetDeleteAccount,
    translateX,
  ]);

  const handleLogout = useCallback(() => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair do PetRadar?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: logout,
      },
    ]);
  }, [logout]);

  const displayName = getProfileDisplayName(profile, values.nome);
  const accountTypeLabel = getProfileAccountTypeLabel(profile);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Fechar perfil"
        />

        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <ProfileHeader
            topInset={insets.top}
            onClose={onClose}
            onLogout={handleLogout}
          />

          {loading ? (
            <ProfileLoadingState />
          ) : (
            <>
              <ProfileHero
                photoUri={profile?.foto_perfil || null}
                uploadingImage={uploadingImage}
                name={displayName}
                email={profile?.email}
                accountTypeLabel={accountTypeLabel}
                onPhotoPress={alterarFoto}
              />

              <ProfileTabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                mostrarPets={mostrarAbaPets}
              />

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.contentContainer}
                keyboardVerticalOffset={20}
              >
                {activeTab === "perfil" ? (
                  isEditing ? (
                    <ProfileEditForm
                      accountType={profile?.tipo_conta}
                      values={values}
                      setField={setField}
                      saving={saving}
                      onSave={salvarPerfil}
                      onCancel={cancelarEdicao}
                    />
                  ) : (
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.profileScrollContent}
                    >
                      <ProfileInfoSection
                        profile={profile}
                        displayName={displayName}
                        onEdit={iniciarEdicao}
                      />
                      <ProfileAccountSection />
                      <ProfileDeleteAccountSection
                        onOpenDeleteAccount={abrirDeleteAccount}
                      />
                    </ScrollView>
                  )
                ) : activeTab === "pets" && mostrarAbaPets ? (
                  <PetsTab />
                ) : (
                  <ProfileOccurrencesTab
                    occurrences={minhasOcorrencias}
                    refreshing={refreshing}
                    onRefresh={carregarDados}
                    onOccurrencePress={(occurrenceId) =>
                      onOccurrencePress(occurrenceId, carregarDados)
                    }
                  />
                )}
              </KeyboardAvoidingView>
            </>
          )}
        </Animated.View>

        <ProfileDeleteAccountModal
          visible={deleteAccountVisible}
          password={deletePassword}
          deleting={deletingAccount}
          showPassword={showDeletePassword}
          onPasswordChange={setDeletePassword}
          onTogglePasswordVisibility={togglePasswordVisibility}
          onClose={fecharDeleteAccount}
          onConfirm={excluirConta}
        />
      </View>
    </Modal>
  );
}
