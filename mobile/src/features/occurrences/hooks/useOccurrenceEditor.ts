import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import type {
  AppTabParamList,
  PetOcorrenciaPrefill,
} from "../../../navigation/navigation.types";
import { occurrenceService } from "../services/occurrenceService";
import type { OcorrenciaEdicao } from "../types/occurrenceForm.types";
import { mensagemErroApi } from "../utils/occurrenceErrors";
import { ehTipoOcorrencia, separarValores } from "../utils/occurrenceForm.utils";
import { useOccurrenceForm } from "./useOccurrenceForm";
import { useOccurrenceLocation } from "./useOccurrenceLocation";
import { useOccurrencePhoto } from "./useOccurrencePhoto";

interface UseOccurrenceEditorParams {
  occurrenceId: number | null;
  petOrigem: PetOcorrenciaPrefill | null;
  navigation: BottomTabNavigationProp<AppTabParamList>;
  form: ReturnType<typeof useOccurrenceForm>;
  location: ReturnType<typeof useOccurrenceLocation>;
  photo: ReturnType<typeof useOccurrencePhoto>;
}

export function useOccurrenceEditor({
  occurrenceId,
  petOrigem,
  navigation,
  form,
  location,
  photo,
}: UseOccurrenceEditorParams) {
  const [carregandoOcorrencia, setCarregandoOcorrencia] = useState(false);
  const modoEdicao = occurrenceId !== null;

  const limparFormulario = useCallback(() => {
    form.limparFormulario();
    location.limparLocalizacao();
    photo.limparFoto();
    setCarregandoOcorrencia(false);
  }, [form.limparFormulario, location.limparLocalizacao, photo.limparFoto]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      limparFormulario();

      if (modoEdicao) {
        setCarregandoOcorrencia(true);

        const carregarOcorrencia = async () => {
          try {
            const response =
              await occurrenceService.getById<OcorrenciaEdicao>(occurrenceId);
            if (!ativo) {
              return;
            }

            const occurrence = response.data;
            form.setTipoOcorrencia(
              ehTipoOcorrencia(occurrence.tipo_ocorrencia)
                ? occurrence.tipo_ocorrencia
                : null,
            );

            const tipoAnimalNormalizado = occurrence.tipo_animal
              .trim()
              .toUpperCase();
            if (tipoAnimalNormalizado === "CACHORRO") {
              form.setTipoAnimal("CACHORRO");
              form.setTipoAnimalOutro("");
            } else if (tipoAnimalNormalizado === "GATO") {
              form.setTipoAnimal("GATO");
              form.setTipoAnimalOutro("");
            } else {
              form.setTipoAnimal("OUTRO");
              form.setTipoAnimalOutro(occurrence.tipo_animal);
            }

            location.setEndereco(occurrence.endereco_localizacao ?? "");
            location.setEnderecoSelecionado(true);
            location.setLatitude(Number(occurrence.latitude));
            location.setLongitude(Number(occurrence.longitude));
            form.setSexo(occurrence.sexo ?? "");
            form.setCor(occurrence.cor ?? "");
            form.setPorte(occurrence.porte ?? "");
            form.setIdade(occurrence.idade ?? "");

            const racaExistente = occurrence.raca?.trim() ?? "";
            form.setRaca(racaExistente);
            form.setRacaConhecida(Boolean(racaExistente));
            form.setSaudeCritica(Boolean(occurrence.saude_critica));
            form.setProblemasSelecionados(
              separarValores(occurrence.saude_detalhes),
            );
            form.setDeficiencia(Boolean(occurrence.deficiencia));
            form.setDeficienciasSelecionadas(
              separarValores(occurrence.deficiencia_detalhes),
            );
            form.setNivelUrgencia(occurrence.nivel_urgencia || "Moderado");

            const data = new Date(occurrence.data_ocorrencia);
            if (!Number.isNaN(data.getTime())) {
              form.setDataOcorrencia(data);
              form.setDataOcorrenciaTexto(
                data.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
              );
            }

            photo.setFotoUri(occurrence.foto);
            photo.setFotoOriginal(occurrence.foto);
            form.setObservacao(occurrence.observacao ?? "");
            form.setCuidadosIniciaisOriginais(occurrence.cuidados_iniciais);
          } catch (error: unknown) {
            if (!ativo) {
              return;
            }
            Alert.alert(
              "Não foi possível carregar",
              mensagemErroApi(
                error,
                "Não foi possível carregar a ocorrência para edição.",
              ),
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
        form.setTipoOcorrencia("PET_PERDIDO");
        const especieNormalizada = petOrigem.especie.trim().toUpperCase();
        if (especieNormalizada === "CACHORRO") {
          form.setTipoAnimal("CACHORRO");
          form.setTipoAnimalOutro("");
        } else if (especieNormalizada === "GATO") {
          form.setTipoAnimal("GATO");
          form.setTipoAnimalOutro("");
        } else {
          form.setTipoAnimal("OUTRO");
          form.setTipoAnimalOutro(petOrigem.especie);
        }

        form.setRaca(petOrigem.raca || "");
        form.setRacaConhecida(Boolean(petOrigem.raca));
        form.setSexo(petOrigem.sexo || "");
        form.setCor(petOrigem.cor || "");
        form.setPorte(petOrigem.porte || "");
        form.setIdade(petOrigem.idade || "");
        photo.setFotoUri(petOrigem.foto ?? null);
      }

      return () => {
        ativo = false;
        limparFormulario();
      };
    }, [
      limparFormulario,
      modoEdicao,
      navigation,
      occurrenceId,
      petOrigem,
      form.setTipoOcorrencia,
      form.setTipoAnimal,
      form.setTipoAnimalOutro,
      form.setSexo,
      form.setCor,
      form.setPorte,
      form.setIdade,
      form.setRaca,
      form.setRacaConhecida,
      form.setSaudeCritica,
      form.setProblemasSelecionados,
      form.setDeficiencia,
      form.setDeficienciasSelecionadas,
      form.setNivelUrgencia,
      form.setDataOcorrencia,
      form.setDataOcorrenciaTexto,
      form.setObservacao,
      form.setCuidadosIniciaisOriginais,
      location.setEndereco,
      location.setEnderecoSelecionado,
      location.setLatitude,
      location.setLongitude,
      photo.setFotoUri,
      photo.setFotoOriginal,
    ]),
  );

  return { modoEdicao, carregandoOcorrencia, limparFormulario };
}
