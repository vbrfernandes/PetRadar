import { useCallback, useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

export const useMapLocation = () => {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const obterLocalizacaoInicial = useCallback(async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Localização desativada",
          "Precisamos da sua localização para centralizar o mapa e encontrar ocorrências próximas.",
        );

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation(currentLocation);
    } catch (error) {
      console.warn("Erro ao obter localização:", error);
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  return {
    userLocation,
    loadingLocation,
    obterLocalizacaoInicial,
  };
};
