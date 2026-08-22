import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import type {
  ReviewItem,
} from "../types/occurrenceForm.types";
import type { TipoAnimal, TipoOcorrencia } from "../types/occurrence.types";
import { formatarDataCurta, formatarHora } from "../utils/occurrenceFormatters";

interface ValidationContext {
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  fotoUri: string | null;
}

interface ReviewContext {
  endereco: string;
  fotoUri: string | null;
}

export function useOccurrenceForm() {
  const [tipoOcorrencia, setTipoOcorrencia] =
    useState<TipoOcorrencia | null>(null);
  const [tipoAnimal, setTipoAnimal] = useState<TipoAnimal | null>(null);
  const [tipoAnimalOutro, setTipoAnimalOutro] = useState("");
  const [sexo, setSexo] = useState("");
  const [cor, setCor] = useState("");
  const [porte, setPorte] = useState("");
  const [idade, setIdade] = useState("");
  const [racaConhecida, setRacaConhecida] = useState<boolean | null>(null);
  const [raca, setRaca] = useState("");
  const [saudeCritica, setSaudeCritica] = useState(false);
  const [problemasSelecionados, setProblemasSelecionados] =
    useState<string[]>([]);
  const [deficiencia, setDeficiencia] = useState(false);
  const [deficienciasSelecionadas, setDeficienciasSelecionadas] =
    useState<string[]>([]);
  const [aguaRegistrada, setAguaRegistrada] = useState<Date | null>(null);
  const [comidaRegistrada, setComidaRegistrada] = useState<Date | null>(null);
  const [cuidadosIniciaisOriginais, setCuidadosIniciaisOriginais] =
    useState<string | null>(null);
  const [cuidadosIniciaisAlterados, setCuidadosIniciaisAlterados] =
    useState(false);
  const [nivelUrgencia, setNivelUrgencia] = useState("Moderado");
  const [dataOcorrencia, setDataOcorrencia] = useState<Date>(new Date());
  const [dataOcorrenciaTexto, setDataOcorrenciaTexto] = useState("");
  const [mostrarSeletorData, setMostrarSeletorData] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [salvando, setSalvando] = useState(false);

  const limparFormulario = useCallback(() => {
    setTipoOcorrencia(null);
    setTipoAnimal(null);
    setTipoAnimalOutro("");
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
    setCuidadosIniciaisOriginais(null);
    setCuidadosIniciaisAlterados(false);
    setNivelUrgencia("Moderado");
    setDataOcorrencia(new Date());
    setDataOcorrenciaTexto("");
    setMostrarSeletorData(false);
    setObservacao("");
  }, []);

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

  const alternarItem = useCallback(
    (
      item: string,
      setSelecionados: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
      setSelecionados((atual) =>
        atual.includes(item)
          ? atual.filter((valor) => valor !== item)
          : [...atual, item],
      );
    },
    [],
  );

  const selecionarTipoOcorrencia = useCallback((tipo: TipoOcorrencia) => {
    setTipoOcorrencia(tipo);
    if (tipo !== "PET_PERDIDO" && tipo !== "PET_AVISTADO") {
      setRacaConhecida(null);
      setRaca("");
    }
  }, []);

  const selecionarRacaConhecida = useCallback((conhecida: boolean) => {
    setRacaConhecida(conhecida);
    if (!conhecida) {
      setRaca("");
    }
  }, []);

  const selecionarSaudeCritica = useCallback((critica: boolean) => {
    setSaudeCritica(critica);
    if (!critica) {
      setProblemasSelecionados([]);
    }
  }, []);

  const selecionarDeficiencia = useCallback((possuiDeficiencia: boolean) => {
    setDeficiencia(possuiDeficiencia);
    if (!possuiDeficiencia) {
      setDeficienciasSelecionadas([]);
    }
  }, []);

  const registrarCuidado = useCallback(
    (tipo: "agua" | "comida") => {
      const agora = new Date();
      setCuidadosIniciaisAlterados(true);
      if (tipo === "agua") {
        setAguaRegistrada(aguaRegistrada ? null : agora);
        return;
      }
      setComidaRegistrada(comidaRegistrada ? null : agora);
    },
    [aguaRegistrada, comidaRegistrada],
  );

  const cuidadosFormatados = useMemo(() => {
    const cuidados = [
      aguaRegistrada
        ? `Água: ${formatarDataCurta(aguaRegistrada)} ${formatarHora(aguaRegistrada)}`
        : null,
      comidaRegistrada
        ? `Comida: ${formatarDataCurta(comidaRegistrada)} ${formatarHora(comidaRegistrada)}`
        : null,
    ];
    return cuidados.filter(Boolean).join(" | ");
  }, [aguaRegistrada, comidaRegistrada]);

  const aguaRegistradaTexto = aguaRegistrada
    ? `${formatarDataCurta(aguaRegistrada)} ${formatarHora(aguaRegistrada)}`
    : "Não registrada";
  const comidaRegistradaTexto = comidaRegistrada
    ? `${formatarDataCurta(comidaRegistrada)} ${formatarHora(comidaRegistrada)}`
    : "Não registrada";

  const validarFormulario = useCallback(
    ({ endereco, latitude, longitude, fotoUri }: ValidationContext) => {
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
    },
    [ehPet, raca, racaConhecida, tipoAnimal, tipoAnimalOutro, tipoOcorrencia],
  );

  const criarItensRevisao = useCallback(
    ({ endereco, fotoUri }: ReviewContext): ReviewItem[] => [
      { label: "Tipo de ocorrência", value: nomeTipoOcorrencia },
      { label: "Animal", value: nomeTipoAnimal },
      ...(ehPet
        ? [
            {
              label: "Raça",
              value:
                racaConhecida === true
                  ? raca
                  : racaConhecida === false
                    ? "Não sei"
                    : "Não informada",
            },
          ]
        : []),
      { label: "Sexo", value: sexo },
      { label: "Cor", value: cor || "Não informada" },
      { label: "Porte", value: porte },
      { label: "Idade", value: idade },
      { label: "Endereço", value: endereco },
      { label: "Data da ocorrência", value: dataOcorrenciaTexto || "Hoje" },
      {
        label: "Saúde crítica",
        value: saudeCritica
          ? problemasSelecionados.length > 0
            ? `Sim — ${problemasSelecionados.join(", ")}`
            : "Sim"
          : "Não",
      },
      {
        label: "Deficiência",
        value: deficiencia
          ? deficienciasSelecionadas.length > 0
            ? `Sim — ${deficienciasSelecionadas.join(", ")}`
            : "Sim"
          : "Não",
      },
      { label: "Urgência", value: nivelUrgencia },
      {
        label: "Cuidados",
        value: cuidadosFormatados || "Nenhum cuidado registrado",
      },
      { label: "Foto", value: fotoUri ? "Foto adicionada" : "Foto não adicionada" },
      ...(observacao.trim()
        ? [{ label: "Observação", value: observacao.trim() }]
        : []),
    ],
    [
      nomeTipoOcorrencia,
      nomeTipoAnimal,
      ehPet,
      racaConhecida,
      raca,
      sexo,
      cor,
      porte,
      idade,
      dataOcorrenciaTexto,
      saudeCritica,
      problemasSelecionados,
      deficiencia,
      deficienciasSelecionadas,
      nivelUrgencia,
      cuidadosFormatados,
      observacao,
    ],
  );

  return {
    tipoOcorrencia, setTipoOcorrencia, tipoAnimal, setTipoAnimal,
    tipoAnimalOutro, setTipoAnimalOutro, sexo, setSexo, cor, setCor,
    porte, setPorte, idade, setIdade, racaConhecida, setRacaConhecida,
    raca, setRaca, saudeCritica, setSaudeCritica, problemasSelecionados,
    setProblemasSelecionados, deficiencia, setDeficiencia,
    deficienciasSelecionadas, setDeficienciasSelecionadas, aguaRegistrada,
    setAguaRegistrada, comidaRegistrada, setComidaRegistrada,
    cuidadosIniciaisOriginais, setCuidadosIniciaisOriginais,
    cuidadosIniciaisAlterados, setCuidadosIniciaisAlterados, nivelUrgencia,
    setNivelUrgencia, dataOcorrencia, setDataOcorrencia,
    dataOcorrenciaTexto, setDataOcorrenciaTexto, mostrarSeletorData,
    setMostrarSeletorData, observacao, setObservacao, salvando, setSalvando,
    limparFormulario, ehPet, statusBadge, alternarItem,
    selecionarTipoOcorrencia, selecionarRacaConhecida,
    selecionarSaudeCritica, selecionarDeficiencia, registrarCuidado,
    cuidadosFormatados, aguaRegistradaTexto, comidaRegistradaTexto,
    validarFormulario, criarItensRevisao,
  };
}
