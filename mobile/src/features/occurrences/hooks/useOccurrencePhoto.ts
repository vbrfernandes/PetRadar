import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function useOccurrencePhoto() {
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoOriginal, setFotoOriginal] = useState<string | null>(null);

  const limparFoto = useCallback(() => {
    setFotoUri(null);
    setFotoOriginal(null);
  }, []);

  const selecionarFoto = useCallback(async () => {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets[0]?.uri) {
        setFotoUri(resultado.assets[0].uri);
      }
    } catch {
      Alert.alert(
        "Erro ao selecionar foto",
        "Não foi possível acessar suas imagens.",
      );
    }
  }, []);

  return {
    fotoUri,
    setFotoUri,
    fotoOriginal,
    setFotoOriginal,
    limparFoto,
    selecionarFoto,
  };
}
