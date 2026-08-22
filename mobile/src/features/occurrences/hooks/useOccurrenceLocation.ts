import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

import { MAPBOX_ACCESS_TOKEN } from "../constants/occurrence.constants";
import { occurrenceGeocodingService } from "../services/occurrenceGeocodingService";
import type { SugestaoEndereco } from "../types/occurrenceForm.types";

export function useOccurrenceLocation() {
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [sugestoesEndereco, setSugestoesEndereco] =
    useState<SugestaoEndereco[]>([]);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(false);
  const [localizando, setLocalizando] = useState(false);

  const limparLocalizacao = useCallback(() => {
    setEndereco("");
    setLatitude(null);
    setLongitude(null);
    setSugestoesEndereco([]);
    setBuscandoEndereco(false);
    setEnderecoSelecionado(false);
  }, []);

  const alterarEnderecoManual = useCallback((texto: string) => {
    setEndereco(texto);
    setEnderecoSelecionado(false);
    if (texto.trim().length < 3) {
      setSugestoesEndereco([]);
    }
  }, []);

  const selecionarSugestaoEndereco = useCallback(
    (sugestao: SugestaoEndereco) => {
      const [longitudeSelecionada, latitudeSelecionada] =
        sugestao.geometry.coordinates;
      const enderecoFormatado =
        sugestao.properties.full_address ||
        [sugestao.properties.name, sugestao.properties.place_formatted]
          .filter(Boolean)
          .join(", ");

      setEndereco(enderecoFormatado);
      setLatitude(latitudeSelecionada);
      setLongitude(longitudeSelecionada);
      setEnderecoSelecionado(true);
      setSugestoesEndereco([]);
    },
    [],
  );

  const buscarSugestoesEndereco = useCallback(async (texto: string) => {
    const busca = texto.trim();
    if (busca.length < 3) {
      setSugestoesEndereco([]);
      setBuscandoEndereco(false);
      return;
    }

    if (!MAPBOX_ACCESS_TOKEN) {
      console.warn("[CadastroOcorrencia] Token do Mapbox não configurado.");
      setSugestoesEndereco([]);
      setBuscandoEndereco(false);
      return;
    }

    try {
      setBuscandoEndereco(true);
      const data = await occurrenceGeocodingService.search(busca);
      setSugestoesEndereco(Array.isArray(data.features) ? data.features : []);
    } catch (error) {
      console.warn("[CadastroOcorrencia] Erro ao buscar endereço:", error);
      setSugestoesEndereco([]);
    } finally {
      setBuscandoEndereco(false);
    }
  }, []);

  useEffect(() => {
    if (enderecoSelecionado || endereco.trim().length < 3) {
      return;
    }
    const timeout = setTimeout(() => {
      void buscarSugestoesEndereco(endereco);
    }, 450);
    return () => clearTimeout(timeout);
  }, [buscarSugestoesEndereco, endereco, enderecoSelecionado]);

  const obterLocalizacaoAtual = useCallback(async () => {
    try {
      setLocalizando(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Localização necessária",
          "Permita o acesso à localização para marcar o ponto da ocorrência.",
        );
        return;
      }

      const localizacao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude: lat, longitude: lng } = localizacao.coords;
      setLatitude(lat);
      setLongitude(lng);
      setEnderecoSelecionado(true);
      setSugestoesEndereco([]);

      try {
        const enderecos = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });
        const local = enderecos[0];
        if (local) {
          const partes = [
            local.street || local.name,
            local.streetNumber,
            local.district,
            local.city,
            local.region,
          ].filter(Boolean);
          if (partes.length > 0) {
            setEndereco(partes.join(", "));
          }
        }
      } catch {
        // A localização continua válida mesmo sem conversão do endereço.
      }
    } catch {
      Alert.alert(
        "Não foi possível localizar",
        "Tente novamente ou informe o endereço manualmente.",
      );
    } finally {
      setLocalizando(false);
    }
  }, []);

  return {
    endereco, setEndereco, latitude, setLatitude, longitude, setLongitude,
    sugestoesEndereco, setSugestoesEndereco, buscandoEndereco,
    setBuscandoEndereco, enderecoSelecionado, setEnderecoSelecionado,
    localizando, limparLocalizacao, alterarEnderecoManual,
    selecionarSugestaoEndereco, obterLocalizacaoAtual,
  };
}
