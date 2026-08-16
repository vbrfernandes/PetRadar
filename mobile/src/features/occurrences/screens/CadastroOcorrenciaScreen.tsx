import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

import { theme } from "../../../theme/colors";
import { useAuthStore } from "../../../store/useAuthStore";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import type { AppTabParamList } from "../../../navigation/navigation.types";
import AnimalTypeSelector, {
  type AnimalTypeOption,
} from "../components/form/AnimalTypeSelector";
import ChoiceButton from "../components/form/ChoiceButton";
import OccurrenceFormSection from "../components/form/OccurrenceFormSection";
import OccurrenceTypeSection, {
  type OccurrenceTypeOption,
} from "../components/form/OccurrenceTypeSection";
import SelectionChipGroup from "../components/form/SelectionChipGroup";
import { occurrenceFormSharedStyles } from "../components/form/occurrenceForm.styles";
import { occurrenceService } from "../services/occurrenceService";
import type {
  TipoAnimal,
  TipoOcorrencia,
} from "../types/occurrence.types";

type CadastroOcorrenciaScreenProps = BottomTabScreenProps<
  AppTabParamList,
  "CadastroOcorrencia"
>;

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

const tiposOcorrencia: OccurrenceTypeOption[] = [
  {
    valor: "PET_PERDIDO",
    titulo: "Pet perdido",
    descricao: "Animal com tutor que não foi localizado",
    icone: "paw",
  },
  {
    valor: "PET_AVISTADO",
    titulo: "Pet avistado",
    descricao: "Pet visto e que pode estar perdido",
    icone: "eye-outline",
  },
  {
    valor: "ANIMAL_DE_RUA",
    titulo: "Animal de rua",
    descricao: "Animal encontrado sem tutor identificado",
    icone: "paw-outline",
  },
];

const tiposAnimais: AnimalTypeOption[] = [
  {
    valor: "CACHORRO",
    titulo: "Cachorro",
    descricao: "Cão",
    icone: "dog-side",
  },
  {
    valor: "GATO",
    titulo: "Gato",
    descricao: "Felino",
    icone: "cat",
  },
  {
    valor: "OUTRO",
    titulo: "Outro",
    descricao: "Outra espécie",
    icone: "paw-outline",
  },
];

const sexos = ["Masculino", "Feminino", "Não sei"];
const portes = ["Pequeno", "Médio", "Grande"];
const idades = ["Filhote", "Adulto", "Idoso"];
const urgencias = ["Crítico", "Moderado", "Baixo"];

const problemasSaude = [
  "Ferido / machucado",
  "Desnutrido",
  "Desidratado",
  "Ingestão de corpo estranho",
  "Atropelado",
  "Problemas dermatológicos",
];

const deficiencias = [
  "Paralisia de membros",
  "Amputado",
  "Cegueira",
  "Surdez",
  "Incontinência urinária",
  "Incontinência fecal",
];

const formatarHora = (data: Date) =>
  data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatarDataCurta = (data: Date) =>
  data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

const criarNomeArquivo = (uri: string) => {
  const nome = uri.split("/").pop() || `ocorrencia-${Date.now()}.jpg`;
  return nome.includes(".") ? nome : `${nome}.jpg`;
};

interface SugestaoEndereco {
  id: string;

  geometry: {
    type: "Point";
    coordinates: [number, number];
  };

  properties: {
    mapbox_id: string;
    feature_type: string;
    name: string;
    name_preferred?: string;
    place_formatted?: string;
    full_address?: string;
  };
}

interface RespostaGeocodingMapbox {
  type: "FeatureCollection";
  features: SugestaoEndereco[];
}

interface OcorrenciaEdicao {
  id_ocorrencia: number;
  tipo_ocorrencia: string;
  status_badge: string;
  tipo_animal: string;
  raca: string | null;
  sexo: string | null;
  cor: string | null;
  porte: string | null;
  idade: string | null;
  saude_critica: boolean;
  saude_detalhes: string | null;
  cuidados_iniciais: string | null;
  deficiencia: boolean;
  deficiencia_detalhes: string | null;
  nivel_urgencia: string;
  data_ocorrencia: string;
  endereco_localizacao: string | null;
  latitude: number;
  longitude: number;
  foto: string;
  observacao: string | null;
}

const ehTipoOcorrencia = (valor: string): valor is TipoOcorrencia =>
  tiposOcorrencia.some((tipo) => tipo.valor === valor);

const separarValores = (valor: string | null) =>
  valor
    ? valor
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export default function CadastroOcorrenciaScreen({
  navigation,
  route,
}: CadastroOcorrenciaScreenProps) {
  const [tipoOcorrencia, setTipoOcorrencia] = useState<TipoOcorrencia | null>(
    null,
  );

  const [tipoAnimal, setTipoAnimal] = useState<TipoAnimal | null>(null);
  const [tipoAnimalOutro, setTipoAnimalOutro] = useState("");

  const [endereco, setEndereco] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);

  const [longitude, setLongitude] = useState<number | null>(null);

  const [sugestoesEndereco, setSugestoesEndereco] = useState<
    SugestaoEndereco[]
  >([]);

  const [buscandoEndereco, setBuscandoEndereco] = useState(false);

  const [enderecoSelecionado, setEnderecoSelecionado] = useState(false);

  const [sexo, setSexo] = useState("");
  const [cor, setCor] = useState("");
  const [porte, setPorte] = useState("");
  const [idade, setIdade] = useState("");

  const [racaConhecida, setRacaConhecida] = useState<boolean | null>(null);
  const [raca, setRaca] = useState("");

  const [saudeCritica, setSaudeCritica] = useState(false);
  const [problemasSelecionados, setProblemasSelecionados] = useState<string[]>(
    [],
  );

  const [deficiencia, setDeficiencia] = useState(false);
  const [deficienciasSelecionadas, setDeficienciasSelecionadas] = useState<
    string[]
  >([]);

  const [aguaRegistrada, setAguaRegistrada] = useState<Date | null>(null);

  const [comidaRegistrada, setComidaRegistrada] = useState<Date | null>(null);

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoOriginal, setFotoOriginal] = useState<string | null>(null);

  const [cuidadosIniciaisOriginais, setCuidadosIniciaisOriginais] = useState<
    string | null
  >(null);
  const [cuidadosIniciaisAlterados, setCuidadosIniciaisAlterados] =
    useState(false);

  const [nivelUrgencia, setNivelUrgencia] = useState("Moderado");

  const [dataOcorrencia, setDataOcorrencia] = useState<Date>(new Date());
  const [dataOcorrenciaTexto, setDataOcorrenciaTexto] = useState("");
  const [mostrarSeletorData, setMostrarSeletorData] = useState(false);

  const [observacao, setObservacao] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [carregandoOcorrencia, setCarregandoOcorrencia] = useState(false);

  const limparFormulario = useCallback(() => {
    setTipoOcorrencia(null);

    setTipoAnimal(null);
    setTipoAnimalOutro("");

    setEndereco("");
    setLatitude(null);
    setLongitude(null);
    setSugestoesEndereco([]);
    setBuscandoEndereco(false);
    setEnderecoSelecionado(false);

    setSexo("");
    setCor("");
    setPorte("");
    setIdade("");

    setRacaConhecida(null);
    setRaca("");

    setSaudeCritica(false);
    setProblemasSelecionados([]);

    setDeficiencia(false);
    setDeficienciasSelecionadas([]);

    setAguaRegistrada(null);
    setComidaRegistrada(null);

    setFotoUri(null);
    setFotoOriginal(null);
    setCuidadosIniciaisOriginais(null);
    setCuidadosIniciaisAlterados(false);

    setNivelUrgencia("Moderado");

    setDataOcorrencia(new Date());
    setDataOcorrenciaTexto("");
    setMostrarSeletorData(false);

    setObservacao("");
    setCarregandoOcorrencia(false);
  }, []);

  const petOrigem =
    route.params?.pet ?? null;
  const ocorrenciaId = route.params?.ocorrenciaId ?? null;
  const modoEdicao = ocorrenciaId !== null;

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      limparFormulario();

      if (modoEdicao) {
        setCarregandoOcorrencia(true);

        const carregarOcorrencia = async () => {
          try {
            const response = await occurrenceService.getById<OcorrenciaEdicao>(
              ocorrenciaId,
            );

            if (!ativo) {
              return;
            }

            const occurrence = response.data;

            setTipoOcorrencia(
              ehTipoOcorrencia(occurrence.tipo_ocorrencia)
                ? occurrence.tipo_ocorrencia
                : null,
            );

            const tipoAnimalNormalizado = occurrence.tipo_animal
              .trim()
              .toUpperCase();
            if (tipoAnimalNormalizado === "CACHORRO") {
              setTipoAnimal("CACHORRO");
              setTipoAnimalOutro("");
            } else if (tipoAnimalNormalizado === "GATO") {
              setTipoAnimal("GATO");
              setTipoAnimalOutro("");
            } else {
              setTipoAnimal("OUTRO");
              setTipoAnimalOutro(occurrence.tipo_animal);
            }

            setEndereco(occurrence.endereco_localizacao ?? "");
            setEnderecoSelecionado(true);
            setLatitude(Number(occurrence.latitude));
            setLongitude(Number(occurrence.longitude));

            setSexo(occurrence.sexo ?? "");
            setCor(occurrence.cor ?? "");
            setPorte(occurrence.porte ?? "");
            setIdade(occurrence.idade ?? "");

            const racaExistente = occurrence.raca?.trim() ?? "";
            setRaca(racaExistente);
            setRacaConhecida(Boolean(racaExistente));

            setSaudeCritica(Boolean(occurrence.saude_critica));
            setProblemasSelecionados(
              separarValores(occurrence.saude_detalhes),
            );

            setDeficiencia(Boolean(occurrence.deficiencia));
            setDeficienciasSelecionadas(
              separarValores(occurrence.deficiencia_detalhes),
            );

            setNivelUrgencia(occurrence.nivel_urgencia || "Moderado");

            const data = new Date(occurrence.data_ocorrencia);
            if (!Number.isNaN(data.getTime())) {
              setDataOcorrencia(data);
              setDataOcorrenciaTexto(
                data.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
              );
            }

            setFotoUri(occurrence.foto);
            setFotoOriginal(occurrence.foto);
            setObservacao(occurrence.observacao ?? "");
            setCuidadosIniciaisOriginais(occurrence.cuidados_iniciais);
          } catch (error: unknown) {
            if (!ativo) {
              return;
            }

            const mensagem = axios.isAxiosError(error)
              ? error.response?.data?.detail
              : null;
            Alert.alert(
              "Não foi possível carregar",
              typeof mensagem === "string"
                ? mensagem
                : "Não foi possível carregar a ocorrência para edição.",
              [{ text: "Voltar", onPress: () => navigation.goBack() }],
            );
          } finally {
            if (ativo) {
              setCarregandoOcorrencia(false);
            }
          }
        };

        void carregarOcorrencia();
      } else if (petOrigem) {
        // É um animal pertencente ao usuário.
        setTipoOcorrencia("PET_PERDIDO");

        const especieNormalizada = petOrigem.especie.trim().toUpperCase();

        if (especieNormalizada === "CACHORRO") {
          setTipoAnimal("CACHORRO");
          setTipoAnimalOutro("");
        } else if (especieNormalizada === "GATO") {
          setTipoAnimal("GATO");
          setTipoAnimalOutro("");
        } else {
          setTipoAnimal("OUTRO");
          setTipoAnimalOutro(petOrigem.especie);
        }

        setRaca(petOrigem.raca || "");
        setRacaConhecida(Boolean(petOrigem.raca));
        setSexo(petOrigem.sexo || "");
        setCor(petOrigem.cor || "");
        setPorte(petOrigem.porte || "");
        setIdade(petOrigem.idade || "");
        setFotoUri(petOrigem.foto ?? null);
      }

      return () => {
        ativo = false;
        limparFormulario();
      };
    }, [
      limparFormulario,
      modoEdicao,
      navigation,
      ocorrenciaId,
      petOrigem,
    ]),
  );

  const voltarParaMapa = () => {
    limparFormulario();
    navigation.goBack();
  };

  const ehPet = useMemo(
    () => tipoOcorrencia === "PET_PERDIDO" || tipoOcorrencia === "PET_AVISTADO",
    [tipoOcorrencia],
  );

  const nomeTipoAnimal = useMemo(() => {
    switch (tipoAnimal) {
      case "CACHORRO":
        return "Cachorro";
      case "GATO":
        return "Gato";
      case "OUTRO":
        return tipoAnimalOutro.trim() || "Outro";
      default:
        return "Não informado";
    }
  }, [tipoAnimal, tipoAnimalOutro]);

  const nomeTipoOcorrencia = useMemo(() => {
    switch (tipoOcorrencia) {
      case "PET_PERDIDO":
        return "Pet perdido";
      case "PET_AVISTADO":
        return "Pet avistado";
      case "ANIMAL_DE_RUA":
        return "Animal de rua";
      default:
        return "Não informado";
    }
  }, [tipoOcorrencia]);

  const statusBadge =
    tipoOcorrencia === "PET_PERDIDO"
      ? "PERDIDO"
      : tipoOcorrencia === "PET_AVISTADO"
        ? "AVISTADO"
        : "ANIMAL_DE_RUA";

  const alternarItem = (
    item: string,
    setSelecionados: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelecionados((atual) =>
      atual.includes(item)
        ? atual.filter((valor) => valor !== item)
        : [...atual, item],
    );
  };

  const selecionarTipoOcorrencia = (tipo: TipoOcorrencia) => {
    setTipoOcorrencia(tipo);

    if (tipo !== "PET_PERDIDO" && tipo !== "PET_AVISTADO") {
      setRacaConhecida(null);
      setRaca("");
    }
  };

  const alterarEnderecoManual = (texto: string) => {
    setEndereco(texto);

    setEnderecoSelecionado(false);

    if (texto.trim().length < 3) {
      setSugestoesEndereco([]);
    }
  };

  const selecionarSugestaoEndereco = (sugestao: SugestaoEndereco) => {
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
  };

  const buscarSugestoesEndereco = async (texto: string) => {
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

      const parametros = new URLSearchParams({
        q: busca,
        access_token: MAPBOX_ACCESS_TOKEN,
        autocomplete: "true",
        country: "br",
        language: "pt",
        limit: "5",
        types: "address,street,place,locality,neighborhood",
      });

      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?${parametros.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Mapbox retornou HTTP ${response.status}`);
      }

      const data = (await response.json()) as RespostaGeocodingMapbox;

      setSugestoesEndereco(Array.isArray(data.features) ? data.features : []);
    } catch (error) {
      console.warn("[CadastroOcorrencia] Erro ao buscar endereço:", error);

      setSugestoesEndereco([]);
    } finally {
      setBuscandoEndereco(false);
    }
  };

  useEffect(() => {
    if (enderecoSelecionado || endereco.trim().length < 3) {
      return;
    }

    const timeout = setTimeout(() => {
      void buscarSugestoesEndereco(endereco);
    }, 450);

    return () => {
      clearTimeout(timeout);
    };
  }, [endereco, enderecoSelecionado]);

  const obterLocalizacaoAtual = async () => {
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
        // A localização foi obtida mesmo que o endereço
        // não consiga ser convertido automaticamente.
      }
    } catch {
      Alert.alert(
        "Não foi possível localizar",
        "Tente novamente ou informe o endereço manualmente.",
      );
    } finally {
      setLocalizando(false);
    }
  };

  const selecionarFoto = async () => {
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
  };

  const registrarCuidado = (tipo: "agua" | "comida") => {
    const agora = new Date();
    setCuidadosIniciaisAlterados(true);

    if (tipo === "agua") {
      setAguaRegistrada(aguaRegistrada ? null : agora);
      return;
    }

    setComidaRegistrada(comidaRegistrada ? null : agora);
  };

  const validarFormulario = () => {
    if (!tipoOcorrencia) {
      Alert.alert(
        "Tipo de ocorrência",
        "Selecione o tipo de ocorrência para continuar.",
      );
      return false;
    }

    if (!tipoAnimal) {
      Alert.alert(
        "Tipo de animal",
        "Informe se o animal é cachorro, gato ou outro.",
      );
      return false;
    }

    if (tipoAnimal === "OUTRO" && !tipoAnimalOutro.trim()) {
      Alert.alert("Qual animal?", "Digite o tipo do animal para continuar.");
      return false;
    }

    if (!endereco.trim()) {
      Alert.alert(
        "Endereço",
        "Informe o endereço onde o animal foi visto pela última vez.",
      );
      return false;
    }

    if (latitude === null || longitude === null) {
      Alert.alert(
        "Localização",
        "Marque a localização da ocorrência usando o botão de localização.",
      );
      return false;
    }

    if (!fotoUri) {
      Alert.alert(
        "Foto do animal",
        "Adicione pelo menos uma foto do animal para registrar a ocorrência.",
      );
      return false;
    }

    if (ehPet && racaConhecida === true && !raca.trim()) {
      Alert.alert("Raça", "Informe a raça ou selecione que não sabe a raça.");
      return false;
    }

    return true;
  };

  const cuidadosFormatados = useMemo(() => {
    const cuidados = [
      aguaRegistrada
        ? `Água: ${formatarDataCurta(
          aguaRegistrada,
        )} ${formatarHora(aguaRegistrada)}`
        : null,

      comidaRegistrada
        ? `Comida: ${formatarDataCurta(
          comidaRegistrada,
        )} ${formatarHora(comidaRegistrada)}`
        : null,
    ];

    return cuidados.filter(Boolean).join(" | ");
  }, [aguaRegistrada, comidaRegistrada]);

  const handleSalvar = async () => {
    if (!validarFormulario()) {
      return;
    }

    if (
      !fotoUri ||
      latitude === null ||
      longitude === null ||
      !tipoOcorrencia ||
      !tipoAnimal
    ) {
      return;
    }

    try {
      setSalvando(true);

      const formData = new FormData();

      formData.append("tipo_ocorrencia", tipoOcorrencia);

      formData.append("status_badge", statusBadge);

      formData.append(
        "tipo_animal",
        tipoAnimal === "OUTRO" ? tipoAnimalOutro.trim() : tipoAnimal,
      );

      formData.append("latitude", String(latitude));

      formData.append("longitude", String(longitude));

      formData.append("endereco_localizacao", endereco.trim());

      const ano = dataOcorrencia.getFullYear();
      const mes = String(dataOcorrencia.getMonth() + 1).padStart(2, "0");
      const dia = String(dataOcorrencia.getDate()).padStart(2, "0");

      const dataOcorrenciaApi = `${ano}-${mes}-${dia}T00:00:00`;

      formData.append("data_ocorrencia", dataOcorrenciaApi);

      formData.append("sexo", sexo || "");

      formData.append("cor", cor.trim() || "");

      formData.append("porte", porte || "");

      formData.append("idade", idade || "");

      formData.append("saude_critica", String(saudeCritica));

      formData.append(
        "saude_detalhes",
        problemasSelecionados.length > 0
          ? problemasSelecionados.join(", ")
          : "",
      );

      /*
       * Neste momento o backend ainda recebe cuidados_iniciais
       * como texto. Posteriormente vamos normalizar esses dados
       * no backend em campos próprios.
       */
      const cuidadosIniciaisParaEnviar =
        modoEdicao && !cuidadosIniciaisAlterados
          ? cuidadosIniciaisOriginais
          : cuidadosFormatados;
      if (cuidadosIniciaisParaEnviar !== null) {
        formData.append("cuidados_iniciais", cuidadosIniciaisParaEnviar);
      }

      formData.append("deficiencia", String(deficiencia));

      formData.append(
        "deficiencia_detalhes",
        deficienciasSelecionadas.length > 0
          ? deficienciasSelecionadas.join(", ")
          : "",
      );

      formData.append("nivel_urgencia", nivelUrgencia);

      formData.append("observacao", observacao.trim());

      if (ehPet && racaConhecida === true) {
        formData.append("raca", raca.trim());
      } else {
        formData.append("raca", "");
      }

      const fotoEhDoPet =
        Boolean(
          petOrigem?.foto &&
          fotoUri === petOrigem.foto
        );
      const fotoRemotaMantida = Boolean(
        modoEdicao &&
          fotoOriginal &&
          fotoUri === fotoOriginal &&
          /^https?:\/\//i.test(fotoUri.trim()),
      );

      if (fotoRemotaMantida) {
        // O backend conserva a foto atual quando nenhum novo arquivo é enviado.
      } else if (
        fotoEhDoPet &&
        petOrigem
      ) {
        // A foto já está no servidor.
        // O backend valida o dono e reutiliza a URL.
        formData.append(
          'id_pet',
          String(petOrigem.id_pet)
        );
      } else {
        const fotoEhRemota = /^https?:\/\//i.test(fotoUri.trim());

        if (fotoEhRemota) {
          Alert.alert(
            "Foto inválida",
            "Selecione novamente a foto do animal para continuar.",
          );
          return;
        }

        const nomeArquivo =
          criarNomeArquivo(fotoUri);

        formData.append(
          'foto',
          {
            uri: fotoUri,
            name: nomeArquivo,
            type: 'image/jpeg',
          } as any
        );
      }

      if (modoEdicao) {
        await occurrenceService.update(ocorrenciaId, formData);
      } else {
        await occurrenceService.create(formData);
      }

      Alert.alert(
        modoEdicao ? "Ocorrência atualizada" : "Ocorrência registrada",
        modoEdicao
          ? "As alterações foram salvas com sucesso."
          : "Obrigado por ajudar a comunidade a localizar e proteger animais.",
        [
          {
            text: "Voltar ao mapa",
            onPress: voltarParaMapa,
          },
        ],
      );
    } catch (error: unknown) {
      const erroApi = axios.isAxiosError(error) ? error : null;
      console.error(
        `[CadastroOcorrencia] Erro ao ${
          modoEdicao ? "atualizar" : "registrar"
        } ocorrência:`,
        erroApi?.response?.status,
        erroApi?.response?.data || erroApi?.message,
      );

      const mensagem =
        erroApi?.response?.data?.detail ||
        `Não foi possível ${
          modoEdicao ? "atualizar" : "registrar"
        } a ocorrência. Verifique sua conexão e tente novamente.`;

      Alert.alert(
        modoEdicao
          ? "Não foi possível atualizar"
          : "Não foi possível registrar",
        mensagem,
      );
    } finally {
      setSalvando(false);
    }
  };

  const renderResumo = (label: string, value: string) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue} numberOfLines={3}>
        {value || "Não informado"}
      </Text>
    </View>
  );

  if (modoEdicao && carregandoOcorrencia) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.editLoadingContainer}>
          <ActivityIndicator color={theme.colors.brand} size="large" />
          <Text style={styles.editLoadingTitle}>Carregando ocorrência</Text>
          <Text style={styles.editLoadingText}>
            Preparando os dados para edição.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={voltarParaMapa}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={theme.colors.textTitle}
              />
            </Pressable>

            <View style={styles.topBarTitle}>
              <Text style={styles.eyebrow}>PETRADAR</Text>

              <Text style={styles.screenTitle}>
                {modoEdicao ? "Editar ocorrência" : "Registrar ocorrência"}
              </Text>
            </View>

            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="paw"
                size={28}
                color={theme.colors.surface}
              />
            </View>

            <Text style={styles.heroTitle}>
              Ajude um animal a ser encontrado
            </Text>

            <Text style={styles.heroDescription}>
              Registre as informações que você conseguiu observar. Quanto mais
              detalhes, mais útil será a ocorrência para a comunidade.
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          {/* ===================================================== */}
          {/* 1. SOBRE A OCORRÊNCIA */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="1"
            title="Sobre a ocorrência"
            subtitle="O que aconteceu?"
          >

            <OccurrenceTypeSection
              options={tiposOcorrencia}
              selectedType={tipoOcorrencia}
              onSelect={selecionarTipoOcorrencia}
            />
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 2. SOBRE O ANIMAL */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="2"
            title="Sobre o animal"
            subtitle="Informe apenas o que você conseguiu observar."
          >

            <Text style={styles.fieldLabel}>Tipo de animal</Text>

            <AnimalTypeSelector
              options={tiposAnimais}
              selectedType={tipoAnimal}
              onSelect={setTipoAnimal}
            />

            {tipoAnimal === "OUTRO" && (
              <View style={styles.otherAnimalField}>
                <Text style={styles.fieldLabel}>Qual animal?</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="paw-outline"
                    size={20}
                    color={theme.colors.brand}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={tipoAnimalOutro}
                    onChangeText={setTipoAnimalOutro}
                    placeholder="Digite o tipo do animal..."
                    placeholderTextColor={theme.colors.textBody}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                </View>
              </View>
            )}

            {ehPet && (
              <>
                <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>
                  Você sabe a raça?
                </Text>

                <View style={styles.binaryRow}>
                  <ChoiceButton
                    label="Sim"
                    active={racaConhecida === true}
                    onPress={() => setRacaConhecida(true)}
                  />

                  <ChoiceButton
                    label="Não"
                    active={racaConhecida === false}
                    onPress={() => {
                      setRacaConhecida(false);
                      setRaca("");
                    }}
                  />
                </View>

                {racaConhecida === true && (
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="dog"
                      size={20}
                      color={theme.colors.brand}
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.input}
                      value={raca}
                      onChangeText={setRaca}
                      placeholder="Ex.: Border Collie"
                      placeholderTextColor={theme.colors.textBody}
                    />
                  </View>
                )}
              </>
            )}

            <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>
              Sexo
            </Text>

            <SelectionChipGroup
              options={sexos}
              mode="single"
              selectedValue={sexo}
              onSelect={setSexo}
            />

            <Text style={styles.fieldLabel}>Cor</Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="palette-outline"
                size={20}
                color={theme.colors.brand}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                value={cor}
                onChangeText={setCor}
                placeholder="Ex.: preto e branco"
                placeholderTextColor={theme.colors.textBody}
              />

              <Text style={styles.optionalText}>Opcional</Text>
            </View>

            <Text style={styles.fieldLabel}>Porte</Text>

            <SelectionChipGroup
              options={portes}
              mode="single"
              selectedValue={porte}
              onSelect={setPorte}
            />

            <Text style={styles.fieldLabel}>Idade</Text>

            <SelectionChipGroup
              options={idades}
              mode="single"
              selectedValue={idade}
              onSelect={setIdade}
            />
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 3. LOCALIZAÇÃO E TEMPO */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="3"
            title="Localização e tempo"
            subtitle="Onde e quando o animal foi visto?"
          >

            <Text style={styles.fieldLabel}>
              Endereço visto pela última vez *
            </Text>

            <View style={[styles.inputContainer, styles.addressInput]}>
              <Ionicons
                name="location-outline"
                size={20}
                color={theme.colors.brand}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                value={endereco}
                onChangeText={alterarEnderecoManual}
                placeholder="Rua, número, bairro e cidade"
                placeholderTextColor={theme.colors.textBody}
                multiline
              />

              {buscandoEndereco && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.brand}
                  style={styles.addressLoading}
                />
              )}
            </View>

            {sugestoesEndereco.length > 0 && (
              <View style={styles.addressSuggestions}>
                {sugestoesEndereco.map((sugestao, index) => {
                  const titulo =
                    sugestao.properties.name_preferred ||
                    sugestao.properties.name;

                  const subtitulo =
                    sugestao.properties.place_formatted ||
                    sugestao.properties.full_address;

                  return (
                    <React.Fragment key={sugestao.id}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Selecionar endereço ${titulo}`}
                        onPress={() => selecionarSugestaoEndereco(sugestao)}
                        style={({ pressed }) => [
                          styles.addressSuggestionItem,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={styles.addressSuggestionIcon}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color={theme.colors.brand}
                          />
                        </View>

                        <View style={styles.addressSuggestionContent}>
                          <Text
                            style={styles.addressSuggestionTitle}
                            numberOfLines={1}
                          >
                            {titulo}
                          </Text>

                          {subtitulo ? (
                            <Text
                              style={styles.addressSuggestionSubtitle}
                              numberOfLines={2}
                            >
                              {subtitulo}
                            </Text>
                          ) : null}
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={17}
                          color={theme.colors.textBody}
                        />
                      </Pressable>

                      {index < sugestoesEndereco.length - 1 && (
                        <View style={styles.addressSuggestionDivider} />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={obterLocalizacaoAtual}
              disabled={localizando}
              style={({ pressed }) => [
                styles.locationButton,
                pressed && styles.pressed,
              ]}
            >
              {localizando ? (
                <ActivityIndicator color={theme.colors.brand} />
              ) : (
                <Ionicons
                  name="navigate-outline"
                  size={19}
                  color={theme.colors.brand}
                />
              )}

              <Text style={styles.locationButtonText}>
                {localizando
                  ? "Obtendo localização..."
                  : latitude !== null
                    ? "Localização marcada"
                    : "Usar minha localização"}
              </Text>

              {latitude !== null && (
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={theme.colors.semantic.success.text}
                />
              )}
            </Pressable>

            <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>
              Data da ocorrência
            </Text>

            <View style={styles.dateChoiceRow}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{
                  selected: dataOcorrenciaTexto === "",
                }}
                onPress={() => {
                  setDataOcorrencia(new Date());
                  setDataOcorrenciaTexto("");
                  setMostrarSeletorData(false);
                }}
                style={({ pressed }) => [
                  styles.dateChoiceCard,
                  dataOcorrenciaTexto === "" && styles.dateChoiceCardActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.dateChoiceContent}>
                  <Text
                    style={[
                      styles.dateChoiceTitle,
                      dataOcorrenciaTexto === "" &&
                      styles.dateChoiceTitleActive,
                    ]}
                  >
                    Hoje
                  </Text>
                  <Text style={styles.dateChoiceSubtitle}>Aconteceu hoje</Text>
                </View>
                {dataOcorrenciaTexto === "" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={theme.colors.brand}
                  />
                )}
              </Pressable>

              <Pressable
                accessibilityRole="radio"
                accessibilityState={{
                  selected: dataOcorrenciaTexto !== "",
                }}
                onPress={() => setMostrarSeletorData(true)}
                style={({ pressed }) => [
                  styles.dateChoiceCard,
                  dataOcorrenciaTexto !== "" && styles.dateChoiceCardActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.dateChoiceContent}>
                  <Text
                    style={[
                      styles.dateChoiceTitle,
                      dataOcorrenciaTexto !== "" &&
                      styles.dateChoiceTitleActive,
                    ]}
                  >
                    Outra data
                  </Text>
                  <Text style={styles.dateChoiceSubtitle}>
                    {dataOcorrenciaTexto || "Escolher data"}
                  </Text>
                </View>
                {dataOcorrenciaTexto !== "" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={theme.colors.brand}
                  />
                )}
              </Pressable>
            </View>
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 4. CONDIÇÕES DE SAÚDE */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="4"
            title="Condições de saúde"
            subtitle="Informe sinais de saúde crítica ou deficiência aparente."
          >

            <Text style={styles.fieldLabel}>Saúde crítica?</Text>

            <View style={styles.binaryRow}>
              <ChoiceButton
                label="Sim"
                active={saudeCritica}
                danger={saudeCritica}
                onPress={() => setSaudeCritica(true)}
              />

              <ChoiceButton
                label="Não"
                active={!saudeCritica}
                onPress={() => {
                  setSaudeCritica(false);
                  setProblemasSelecionados([]);
                }}
              />
            </View>

            {saudeCritica && (
              <View style={styles.conditionalBox}>
                <Text style={styles.conditionalTitle}>
                  O que você identificou?
                </Text>

                <SelectionChipGroup
                  options={problemasSaude}
                  mode="multiple"
                  selectedValues={problemasSelecionados}
                  onSelect={(opcao) =>
                    alternarItem(opcao, setProblemasSelecionados)
                  }
                />
              </View>
            )}

            <View style={styles.sectionDivider} />

            <Text style={styles.fieldLabel}>Deficiência?</Text>

            <View style={styles.binaryRow}>
              <ChoiceButton
                label="Sim"
                active={deficiencia}
                onPress={() => setDeficiencia(true)}
              />

              <ChoiceButton
                label="Não"
                active={!deficiencia}
                onPress={() => {
                  setDeficiencia(false);
                  setDeficienciasSelecionadas([]);
                }}
              />
            </View>

            {deficiencia && (
              <View style={styles.conditionalBox}>
                <Text style={styles.conditionalTitle}>Quais?</Text>

                <SelectionChipGroup
                  options={deficiencias}
                  mode="multiple"
                  selectedValues={deficienciasSelecionadas}
                  onSelect={(opcao) =>
                    alternarItem(opcao, setDeficienciasSelecionadas)
                  }
                />
              </View>
            )}
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 5. NÍVEL DE URGÊNCIA */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="5"
            title="Nível de urgência"
            subtitle="Qual a prioridade que essa ocorrência precisa?"
          >

            <View style={styles.urgencyList}>
              {urgencias.map((urgencia) => {
                const ativo = nivelUrgencia === urgencia;

                const danger = urgencia === "Crítico";

                const warning = urgencia === "Moderado";

                return (
                  <Pressable
                    key={urgencia}
                    onPress={() => setNivelUrgencia(urgencia)}
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: ativo,
                    }}
                    style={({ pressed }) => [
                      styles.urgencyItem,
                      ativo && styles.urgencyItemActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.urgencyDot,
                        danger && styles.urgencyDotDanger,
                        warning && styles.urgencyDotWarning,
                        !danger && !warning && styles.urgencyDotSuccess,
                      ]}
                    />

                    <Text
                      style={[
                        styles.urgencyText,
                        ativo && styles.urgencyTextActive,
                      ]}
                    >
                      {urgencia}
                    </Text>

                    {ativo && (
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color={
                          danger
                            ? theme.colors.semantic.danger.text
                            : warning
                              ? theme.colors.semantic.warning.text
                              : theme.colors.semantic.success.text
                        }
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 6. CUIDADOS INICIAIS */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="6"
            title="Cuidados iniciais"
            subtitle="Registre se você ofereceu água ou comida ao animal."
          >

            <View style={styles.careRow}>
              <CareButton
                icon="water"
                label="Água"
                active={!!aguaRegistrada}
                onPress={() => registrarCuidado("agua")}
              />

              <CareButton
                icon="food"
                label="Comida"
                active={!!comidaRegistrada}
                onPress={() => registrarCuidado("comida")}
              />
            </View>

            <View style={styles.caregiverCard}>
              <View style={styles.careInfoRow}>
                <CareInfo
                  icon="water"
                  label="Última água"
                  value={
                    aguaRegistrada
                      ? `${formatarDataCurta(aguaRegistrada)} ${formatarHora(
                        aguaRegistrada,
                      )}`
                      : "Não registrada"
                  }
                />

                <CareInfo
                  icon="food"
                  label="Última comida"
                  value={
                    comidaRegistrada
                      ? `${formatarDataCurta(comidaRegistrada)} ${formatarHora(
                        comidaRegistrada,
                      )}`
                      : "Não registrada"
                  }
                />
              </View>
            </View>

            <View style={styles.careHint}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={theme.colors.brand}
              />

              <Text style={styles.careHintText}>
                Toque novamente para desmarcar um cuidado.
              </Text>
            </View>
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 7. FOTO */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="7"
            title="Foto obrigatória"
            subtitle="Visualização da foto • toque para trocar/adicionar."
          >

            <Pressable
              accessibilityRole="button"
              onPress={selecionarFoto}
              style={({ pressed }) => [
                styles.photoArea,
                fotoUri && styles.photoAreaFilled,
                pressed && styles.pressed,
              ]}
            >
              {fotoUri ? (
                <>
                  <Image
                    source={{
                      uri: fotoUri,
                    }}
                    style={styles.photoPreview}
                  />

                  <View style={styles.photoOverlay}>
                    <View style={styles.photoOverlayButton}>
                      <Ionicons
                        name="camera-outline"
                        size={19}
                        color={theme.colors.surface}
                      />

                      <Text style={styles.photoOverlayText}>
                        Trocar / adicionar foto
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.photoIcon}>
                    <Ionicons
                      name="camera-outline"
                      size={28}
                      color={theme.colors.brand}
                    />
                  </View>

                  <Text style={styles.photoTitle}>Adicionar foto</Text>

                  <Text style={styles.photoDescription}>
                    Toque para escolher uma imagem da galeria
                  </Text>
                </>
              )}
            </Pressable>
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 8. OBSERVAÇÃO */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="8"
            title="Observação"
            subtitle="Existe algo importante que não foi informado acima?"
          >

            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={observacao}
                onChangeText={setObservacao}
                placeholder="Conte brevemente o que você observou..."
                placeholderTextColor={theme.colors.textBody}
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>

            <Text style={styles.characterCount}>{observacao.length}/1000</Text>
          </OccurrenceFormSection>

          {/* ===================================================== */}
          {/* 9. REVISÃO */}
          {/* ===================================================== */}

          <OccurrenceFormSection
            number="9"
            title="Revisão"
            subtitle="Confira as informações antes de registrar a ocorrência."
          >

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewHeaderIcon}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color={theme.colors.brand}
                  />
                </View>

                <View style={styles.reviewHeaderContent}>
                  <Text style={styles.reviewHeaderTitle}>Tudo pronto?</Text>

                  <Text style={styles.reviewHeaderText}>
                    Revise os dados abaixo antes de enviar.
                  </Text>
                </View>
              </View>

              <View style={styles.reviewDivider} />

              {renderResumo("Tipo de ocorrência", nomeTipoOcorrencia)}

              {renderResumo("Animal", nomeTipoAnimal)}

              {ehPet &&
                renderResumo(
                  "Raça",
                  racaConhecida === true
                    ? raca
                    : racaConhecida === false
                      ? "Não sei"
                      : "Não informada",
                )}

              {renderResumo("Sexo", sexo)}

              {renderResumo("Cor", cor || "Não informada")}

              {renderResumo("Porte", porte)}

              {renderResumo("Idade", idade)}

              {renderResumo("Endereço", endereco)}

              {renderResumo(
                "Data da ocorrência",
                dataOcorrenciaTexto || "Hoje",
              )}

              {renderResumo(
                "Saúde crítica",
                saudeCritica
                  ? problemasSelecionados.length > 0
                    ? `Sim — ${problemasSelecionados.join(", ")}`
                    : "Sim"
                  : "Não",
              )}

              {renderResumo(
                "Deficiência",
                deficiencia
                  ? deficienciasSelecionadas.length > 0
                    ? `Sim — ${deficienciasSelecionadas.join(", ")}`
                    : "Sim"
                  : "Não",
              )}

              {renderResumo("Urgência", nivelUrgencia)}

              {renderResumo(
                "Cuidados",
                cuidadosFormatados || "Nenhum cuidado registrado",
              )}

              {renderResumo(
                "Foto",
                fotoUri ? "Foto adicionada" : "Foto não adicionada",
              )}

              {observacao.trim() &&
                renderResumo("Observação", observacao.trim())}
            </View>
          </OccurrenceFormSection>

          <View style={styles.footerNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.semantic.success.text}
            />

            <Text style={styles.footerNoteText}>
              Suas informações ajudam a comunidade a agir mais rápido e aumentam
              as chances de um animal ser encontrado.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              modoEdicao
                ? "Salvar alterações da ocorrência"
                : "Registrar ocorrência"
            }
            onPress={handleSalvar}
            disabled={salvando}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              salvando && styles.submitButtonDisabled,
            ]}
          >
            {salvando ? (
              <ActivityIndicator color={theme.colors.surface} size="small" />
            ) : (
              <>
                <View style={styles.submitIcon}>
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.brand}
                  />
                </View>

                <View style={styles.submitContent}>
                  <Text style={styles.submitTitle}>
                    {modoEdicao ? "Salvar alterações" : "Registrar ocorrência"}
                  </Text>

                  <Text style={styles.submitSubtitle}>
                    {modoEdicao ? "Atualizar ocorrência" : "Enviar para o mapa"}
                  </Text>
                </View>

                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color={theme.colors.surface}
                />
              </>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={voltarParaMapa}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={mostrarSeletorData}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarSeletorData(false)}
      >
        <View style={styles.dateModalBackdrop}>
          <View style={styles.dateModalCard}>
            <View style={styles.dateModalHeader}>
              <View>
                <Text style={styles.dateModalTitle}>Escolher data</Text>
                <Text style={styles.dateModalSubtitle}>
                  Informe a data da ocorrência.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar seletor de data"
                onPress={() => setMostrarSeletorData(false)}
                style={styles.dateModalClose}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.colors.textTitle}
                />
              </Pressable>
            </View>

            <Text style={styles.dateModalLabel}>Data</Text>
            <View style={styles.dateModalInputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.brand}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={dataOcorrenciaTexto}
                onChangeText={(texto) => {
                  // Mantém somente números
                  const numeros = texto.replace(/\D/g, "").slice(0, 8);

                  // Formata automaticamente:
                  // DD → DD/
                  // DDMM → DD/MM/
                  // DDMMYYYY → DD/MM/YYYY
                  let formatado = numeros;

                  if (numeros.length >= 3) {
                    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
                  }

                  if (numeros.length >= 5) {
                    formatado = `${numeros.slice(0, 2)}/${numeros.slice(
                      2,
                      4,
                    )}/${numeros.slice(4)}`;
                  }

                  setDataOcorrenciaTexto(formatado);
                }}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={theme.colors.textBody}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={10}
                autoCorrect={false}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const numeros = dataOcorrenciaTexto.replace(/\D/g, "");

                if (numeros.length !== 8) {
                  Alert.alert(
                    "Data incompleta",
                    "Digite a data completa no formato DD/MM/AAAA.",
                  );
                  return;
                }

                const dia = Number(numeros.slice(0, 2));
                const mes = Number(numeros.slice(2, 4));
                const ano = Number(numeros.slice(4, 8));

                const data = new Date(ano, mes - 1, dia);

                const valida =
                  dia >= 1 &&
                  dia <= 31 &&
                  mes >= 1 &&
                  mes <= 12 &&
                  ano >= 1900 &&
                  ano <= 2100 &&
                  data.getFullYear() === ano &&
                  data.getMonth() === mes - 1 &&
                  data.getDate() === dia;

                if (!valida) {
                  Alert.alert(
                    "Data inválida",
                    "Informe uma data válida no formato DD/MM/AAAA.",
                  );
                  return;
                }

                const dataFormatada =
                  `${String(dia).padStart(2, "0")}/` +
                  `${String(mes).padStart(2, "0")}/` +
                  `${ano}`;

                setDataOcorrencia(data);
                setDataOcorrenciaTexto(dataFormatada);
                setMostrarSeletorData(false);
              }}
              style={({ pressed }) => [
                styles.dateModalConfirm,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.dateModalConfirmText}>Confirmar data</Text>
              <Ionicons
                name="checkmark"
                size={19}
                color={theme.colors.surface}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function CareButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: "water" | "food";
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.careButton,
        active && styles.careButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.careIcon, active && styles.careIconActive]}>
        <MaterialCommunityIcons
          name={icon === "water" ? "water" : "food"}
          size={25}
          color={active ? theme.colors.surface : theme.colors.brand}
        />
      </View>

      <Text
        style={[styles.careButtonText, active && styles.careButtonTextActive]}
      >
        {label}
      </Text>

      {active && (
        <View style={styles.careCheck}>
          <Ionicons name="checkmark" size={12} color={theme.colors.surface} />
        </View>
      )}
    </Pressable>
  );
}

function CareInfo({
  icon,
  label,
  value,
}: {
  icon: "water" | "food";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.careInfo}>
      <View style={styles.careInfoHeader}>
        <MaterialCommunityIcons
          name={icon === "water" ? "water" : "food"}
          size={15}
          color={theme.colors.brand}
        />

        <Text style={styles.careInfoLabel}>{label}</Text>
      </View>

      <Text style={styles.careInfoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  flex: {
    flex: 1,
  },

  editLoadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  editLoadingTitle: {
    marginTop: 16,
    color: theme.colors.textTitle,
    fontSize: 17,
    fontWeight: "800",
  },

  editLoadingText: {
    marginTop: 6,
    color: theme.colors.textBody,
    fontSize: 13,
    textAlign: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  topBar: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  topBarTitle: {
    flex: 1,
    alignItems: "center",
  },

  topBarSpacer: {
    width: 42,
  },

  eyebrow: {
    color: theme.colors.brand,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 2,
  },

  screenTitle: {
    color: theme.colors.textTitle,
    fontSize: 17,
    fontWeight: "800",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    ...theme.shadows.elevation1,
  },

  hero: {
    backgroundColor: theme.colors.brand,
    borderRadius: 24,
    padding: 22,
    marginBottom: 14,
    overflow: "hidden",
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  heroTitle: {
    color: theme.colors.surface,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  heroDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(31, 92, 77, 0.10)",
    marginBottom: 24,
    overflow: "hidden",
  },

  progressFill: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: theme.colors.action,
  },

  ...occurrenceFormSharedStyles,

  otherAnimalField: {
    marginTop: 14,
  },

  addressInput: {
    alignItems: "flex-start",
    paddingTop: 3,
    paddingBottom: 3,
  },

  addressLoading: {
    marginTop: 14,
    marginLeft: 8,
  },

  addressSuggestions: {
    marginTop: -4,
    marginBottom: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadows.elevation1,
  },

  addressSuggestionItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  addressSuggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  addressSuggestionContent: {
    flex: 1,
    paddingRight: 8,
  },

  addressSuggestionTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },

  addressSuggestionSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 17,
  },

  addressSuggestionDivider: {
    height: 1,
    marginLeft: 58,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
  },

  optionalText: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
  },

  conditionalBox: {
    marginTop: 14,
    padding: 13,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.07)",
  },

  conditionalTitle: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
    marginVertical: 20,
  },

  locationButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.14)",
    backgroundColor: "rgba(31, 92, 77, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },

  locationButtonText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: "700",
  },

  careRow: {
    flexDirection: "row",
    gap: 12,
  },

  careButton: {
    flex: 1,
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
  },

  careButtonActive: {
    backgroundColor: "rgba(31, 92, 77, 0.07)",
    borderColor: theme.colors.brand,
  },

  careIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  careIconActive: {
    backgroundColor: theme.colors.brand,
  },

  careButtonText: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  careButtonTextActive: {
    color: theme.colors.brand,
  },

  careCheck: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },

  caregiverCard: {
    marginTop: 13,
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.06)",
  },

  careInfoRow: {
    flexDirection: "row",
    gap: 9,
  },

  careInfo: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 10,
    minHeight: 65,
  },

  careInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },

  careInfoLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
  },

  careInfoValue: {
    color: theme.colors.textTitle,
    fontSize: 12,
    fontWeight: "700",
  },

  careHint: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  careHintText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
  },

  photoArea: {
    height: 210,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(31, 92, 77, 0.22)",
    backgroundColor: "rgba(31, 92, 77, 0.035)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  photoAreaFilled: {
    borderStyle: "solid",
    borderColor: "rgba(31, 92, 77, 0.12)",
  },

  photoIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(31, 92, 77, 0.09)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  photoTitle: {
    color: theme.colors.textTitle,
    fontSize: 15,
    fontWeight: "800",
  },

  photoDescription: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 4,
  },

  photoPreview: {
    width: "100%",
    height: "100%",
  },

  photoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.32)",
    alignItems: "center",
  },

  photoOverlayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  photoOverlayText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },

  urgencyList: {
    gap: 8,
  },

  urgencyItem: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    backgroundColor: theme.colors.background,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  urgencyItemActive: {
    backgroundColor: theme.colors.surface,
  },

  urgencyDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: theme.colors.semantic.success.text,
  },

  urgencyDotDanger: {
    backgroundColor: theme.colors.semantic.danger.text,
  },

  urgencyDotWarning: {
    backgroundColor: theme.colors.semantic.warning.text,
  },

  urgencyDotSuccess: {
    backgroundColor: theme.colors.semantic.success.text,
  },

  urgencyText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 14,
    fontWeight: "700",
  },

  urgencyTextActive: {
    color: theme.colors.textTitle,
  },

  dateChoiceRow: {
    gap: 10,
  },

  dateChoiceCard: {
    minHeight: 70,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.10)",
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  dateChoiceCardActive: {
    borderColor: theme.colors.brand,
    backgroundColor: "rgba(31, 92, 77, 0.07)",
  },

  dateChoiceContent: {
    flex: 1,
  },

  dateChoiceTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  dateChoiceTitleActive: {
    color: theme.colors.brand,
  },

  dateChoiceSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 3,
  },

  dateModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  dateModalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 20,
    ...theme.shadows.elevation1,
  },

  dateModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  dateModalTitle: {
    color: theme.colors.textTitle,
    fontSize: 19,
    fontWeight: "800",
  },

  dateModalSubtitle: {
    color: theme.colors.textBody,
    fontSize: 12,
    marginTop: 4,
  },

  dateModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },

  dateModalLabel: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  dateModalInputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  dateModalConfirm: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: theme.colors.brand,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  dateModalConfirmText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },

  infoNote: {
    marginTop: 13,
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 13,
    backgroundColor: "rgba(31, 92, 77, 0.06)",
  },

  infoNoteText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 16,
  },

  textAreaContainer: {
    minHeight: 125,
    alignItems: "flex-start",
    paddingVertical: 4,
  },

  textArea: {
    minHeight: 115,
  },

  characterCount: {
    color: theme.colors.textBody,
    fontSize: 10,
    textAlign: "right",
    marginTop: -5,
  },

  reviewCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.08)",
    overflow: "hidden",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  reviewHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  reviewHeaderContent: {
    flex: 1,
  },

  reviewHeaderTitle: {
    color: theme.colors.textTitle,
    fontSize: 14,
    fontWeight: "800",
  },

  reviewHeaderText: {
    color: theme.colors.textBody,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },

  reviewDivider: {
    height: 1,
    backgroundColor: "rgba(31, 92, 77, 0.08)",
  },

  reviewItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31, 92, 77, 0.06)",
  },

  reviewLabel: {
    color: theme.colors.textBody,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 3,
  },

  reviewValue: {
    color: theme.colors.textTitle,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    paddingHorizontal: 4,
    marginBottom: 16,
  },

  footerNoteText: {
    flex: 1,
    color: theme.colors.textBody,
    fontSize: 12,
    lineHeight: 17,
  },

  submitButton: {
    minHeight: 66,
    borderRadius: 22,
    backgroundColor: theme.colors.brand,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    ...theme.shadows.buttonGlow,
  },

  submitButtonPressed: {
    transform: [{ scale: 0.985 }],
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  submitContent: {
    flex: 1,
  },

  submitTitle: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },

  submitSubtitle: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 11,
    marginTop: 2,
  },

  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    marginTop: 8,
  },

  cancelButtonText: {
    color: theme.colors.textBody,
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },
});
