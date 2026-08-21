import { useCallback, useState } from "react";

import { Alert } from "react-native";

import { profileService } from "../services/profileService";
import { getProfileErrorMessage } from "../utils/profileErrors";

interface UseProfileDeleteAccountParams {
  logout: () => void;
  onCloseProfile: () => void;
}

export function useProfileDeleteAccount({
  logout,
  onCloseProfile,
}: UseProfileDeleteAccountParams) {
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const abrirDeleteAccount = useCallback(() => {
    setDeleteAccountVisible(true);
  }, []);

  const fecharDeleteAccount = useCallback(() => {
    if (deletingAccount) {
      return;
    }

    setDeleteAccountVisible(false);
    setDeletePassword("");
    setShowDeletePassword(false);
  }, [deletingAccount]);

  const resetDeleteAccount = useCallback(() => {
    setDeleteAccountVisible(false);
    setDeletePassword("");
    setShowDeletePassword(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowDeletePassword((current) => !current);
  }, []);

  const excluirConta = useCallback(async () => {
    if (deletingAccount) {
      return;
    }

    if (!deletePassword.trim()) {
      Alert.alert(
        "Senha obrigatória",
        "Digite sua senha atual para confirmar a exclusão.",
      );
      return;
    }

    setDeletingAccount(true);

    try {
      await profileService.deleteProfile({
        senha: deletePassword,
      });

      setDeleteAccountVisible(false);
      setDeletePassword("");
      setShowDeletePassword(false);
      onCloseProfile();
      logout();

      Alert.alert(
        "Conta excluída",
        "Sua conta foi excluída permanentemente.",
      );
    } catch (error: unknown) {
      Alert.alert(
        "Erro ao excluir conta",
        getProfileErrorMessage(
          error,
          "Não foi possível excluir sua conta. Tente novamente.",
        ),
      );
    } finally {
      setDeletingAccount(false);
    }
  }, [deletePassword, deletingAccount, logout, onCloseProfile]);

  return {
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
  };
}
