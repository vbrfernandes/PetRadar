import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import type { AppTabParamList } from "../../../navigation/navigation.types";
import { theme } from "../../../theme/colors";
import OccurrenceDateModal from "../components/form/modals/OccurrenceDateModal";
import AnimalSection from "../components/form/sections/AnimalSection";
import DisabilitySection from "../components/form/sections/DisabilitySection";
import HealthSection from "../components/form/sections/HealthSection";
import InitialCareSection from "../components/form/sections/InitialCareSection";
import LocationSection from "../components/form/sections/LocationSection";
import OccurrenceFormSection from "../components/form/sections/OccurrenceFormSection";
import OccurrenceTypeSection from "../components/form/sections/OccurrenceTypeSection";
import PhotoSection from "../components/form/sections/PhotoSection";
import ReviewSection from "../components/form/sections/ReviewSection";
import { TIPOS_OCORRENCIA, URGENCIAS } from "../constants/occurrence.constants";
import { useOccurrenceEditor } from "../hooks/useOccurrenceEditor";
import { useOccurrenceForm } from "../hooks/useOccurrenceForm";
import { useOccurrenceLocation } from "../hooks/useOccurrenceLocation";
import { useOccurrencePhoto } from "../hooks/useOccurrencePhoto";
import { occurrenceService } from "../services/occurrenceService";
import { cadastroOcorrenciaScreenStyles as styles } from "../styles/form/occurrenceFormScreen.styles";
import { mensagemErroApi } from "../utils/occurrenceErrors";
import { criarOccurrenceFormData } from "../utils/occurrenceForm.utils";

type CadastroOcorrenciaScreenProps = BottomTabScreenProps<
  AppTabParamList,
  "CadastroOcorrencia"
>;

export default function CadastroOcorrenciaScreen({
  navigation,
  route,
}: CadastroOcorrenciaScreenProps) {
  const form = useOccurrenceForm();
  const location = useOccurrenceLocation();
  const photo = useOccurrencePhoto();
  const petOrigem = route.params?.pet ?? null;
  const ocorrenciaId = route.params?.ocorrenciaId ?? null;
  const editor = useOccurrenceEditor({
    occurrenceId: ocorrenciaId,
    petOrigem,
    navigation,
    form,
    location,
    photo,
  });

  const voltarParaMapa = () => {
    editor.limparFormulario();
    navigation.goBack();
  };

  const itensRevisao = form.criarItensRevisao({
    endereco: location.endereco,
    fotoUri: photo.fotoUri,
  });

  const handleSalvar = async () => {
    if (
      !form.validarFormulario({
        endereco: location.endereco,
        latitude: location.latitude,
        longitude: location.longitude,
        fotoUri: photo.fotoUri,
      })
    ) {
      return;
    }

    if (
      !photo.fotoUri ||
      location.latitude === null ||
      location.longitude === null ||
      !form.tipoOcorrencia ||
      !form.tipoAnimal
    ) {
      return;
    }

    try {
      form.setSalvando(true);
      const cuidadosIniciaisParaEnviar =
        editor.modoEdicao && !form.cuidadosIniciaisAlterados
          ? form.cuidadosIniciaisOriginais
          : form.cuidadosFormatados;
      const formData = criarOccurrenceFormData({
        tipoOcorrencia: form.tipoOcorrencia,
        statusBadge: form.statusBadge,
        tipoAnimal: form.tipoAnimal,
        tipoAnimalOutro: form.tipoAnimalOutro,
        latitude: location.latitude,
        longitude: location.longitude,
        endereco: location.endereco,
        dataOcorrencia: form.dataOcorrencia,
        sexo: form.sexo,
        cor: form.cor,
        porte: form.porte,
        idade: form.idade,
        saudeCritica: form.saudeCritica,
        problemasSelecionados: form.problemasSelecionados,
        cuidadosIniciais: cuidadosIniciaisParaEnviar,
        deficiencia: form.deficiencia,
        deficienciasSelecionadas: form.deficienciasSelecionadas,
        nivelUrgencia: form.nivelUrgencia,
        observacao: form.observacao,
        ehPet: form.ehPet,
        racaConhecida: form.racaConhecida,
        raca: form.raca,
        fotoUri: photo.fotoUri,
        fotoOriginal: photo.fotoOriginal,
        petOrigem,
        modoEdicao: editor.modoEdicao,
      });

      if (!formData) {
        Alert.alert(
          "Foto inválida",
          "Selecione novamente a foto do animal para continuar.",
        );
        return;
      }

      if (ocorrenciaId !== null) {
        await occurrenceService.update(ocorrenciaId, formData);
      } else {
        await occurrenceService.create(formData);
      }

      Alert.alert(
        editor.modoEdicao ? "Ocorrência atualizada" : "Ocorrência registrada",
        editor.modoEdicao
          ? "As alterações foram salvas com sucesso."
          : "Obrigado por ajudar a comunidade a localizar e proteger animais.",
        [{ text: "Voltar ao mapa", onPress: voltarParaMapa }],
      );
    } catch (error: unknown) {
      const erroApi = axios.isAxiosError(error) ? error : null;
      console.error(
        `[CadastroOcorrencia] Erro ao ${
          editor.modoEdicao ? "atualizar" : "registrar"
        } ocorrência:`,
        erroApi?.response?.status,
        erroApi?.response?.data || erroApi?.message,
      );
      Alert.alert(
        editor.modoEdicao
          ? "Não foi possível atualizar"
          : "Não foi possível registrar",
        mensagemErroApi(
          error,
          `Não foi possível ${
            editor.modoEdicao ? "atualizar" : "registrar"
          } a ocorrência. Verifique sua conexão e tente novamente.`,
        ),
      );
    } finally {
      form.setSalvando(false);
    }
  };

  if (editor.modoEdicao && editor.carregandoOcorrencia) {
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
                {editor.modoEdicao ? "Editar ocorrência" : "Registrar ocorrência"}
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
            <Text style={styles.heroTitle}>Ajude um animal a ser encontrado</Text>
            <Text style={styles.heroDescription}>
              Registre as informações que você conseguiu observar. Quanto mais
              detalhes, mais útil será a ocorrência para a comunidade.
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <OccurrenceFormSection
            number="1"
            title="Sobre a ocorrência"
            subtitle="O que aconteceu?"
          >
            <OccurrenceTypeSection
              options={TIPOS_OCORRENCIA}
              selectedType={form.tipoOcorrencia}
              onSelect={form.selecionarTipoOcorrencia}
            />
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="2"
            title="Sobre o animal"
            subtitle="Informe apenas o que você conseguiu observar."
          >
            <AnimalSection
              tipoAnimal={form.tipoAnimal}
              onTipoAnimalChange={form.setTipoAnimal}
              tipoAnimalOutro={form.tipoAnimalOutro}
              onTipoAnimalOutroChange={form.setTipoAnimalOutro}
              ehPet={form.ehPet}
              racaConhecida={form.racaConhecida}
              onRacaConhecidaChange={form.selecionarRacaConhecida}
              raca={form.raca}
              onRacaChange={form.setRaca}
              sexo={form.sexo}
              onSexoChange={form.setSexo}
              cor={form.cor}
              onCorChange={form.setCor}
              porte={form.porte}
              onPorteChange={form.setPorte}
              idade={form.idade}
              onIdadeChange={form.setIdade}
            />
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="3"
            title="Localização e tempo"
            subtitle="Onde e quando o animal foi visto?"
          >
            <LocationSection
              endereco={location.endereco}
              sugestoesEndereco={location.sugestoesEndereco}
              buscandoEndereco={location.buscandoEndereco}
              localizando={location.localizando}
              localizacaoMarcada={location.latitude !== null}
              onEnderecoChange={location.alterarEnderecoManual}
              onSugestaoPress={location.selecionarSugestaoEndereco}
              onUsarLocalizacaoPress={location.obterLocalizacaoAtual}
            />

            <Text style={[styles.fieldLabel, styles.fieldLabelSpacing]}>
              Data da ocorrência
            </Text>
            <View style={styles.dateChoiceRow}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: form.dataOcorrenciaTexto === "" }}
                onPress={() => {
                  form.setDataOcorrencia(new Date());
                  form.setDataOcorrenciaTexto("");
                  form.setMostrarSeletorData(false);
                }}
                style={({ pressed }) => [
                  styles.dateChoiceCard,
                  form.dataOcorrenciaTexto === "" && styles.dateChoiceCardActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.dateChoiceContent}>
                  <Text
                    style={[
                      styles.dateChoiceTitle,
                      form.dataOcorrenciaTexto === "" &&
                        styles.dateChoiceTitleActive,
                    ]}
                  >
                    Hoje
                  </Text>
                  <Text style={styles.dateChoiceSubtitle}>Aconteceu hoje</Text>
                </View>
                {form.dataOcorrenciaTexto === "" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={theme.colors.brand}
                  />
                )}
              </Pressable>

              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: form.dataOcorrenciaTexto !== "" }}
                onPress={() => form.setMostrarSeletorData(true)}
                style={({ pressed }) => [
                  styles.dateChoiceCard,
                  form.dataOcorrenciaTexto !== "" && styles.dateChoiceCardActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.dateChoiceContent}>
                  <Text
                    style={[
                      styles.dateChoiceTitle,
                      form.dataOcorrenciaTexto !== "" &&
                        styles.dateChoiceTitleActive,
                    ]}
                  >
                    Outra data
                  </Text>
                  <Text style={styles.dateChoiceSubtitle}>
                    {form.dataOcorrenciaTexto || "Escolher data"}
                  </Text>
                </View>
                {form.dataOcorrenciaTexto !== "" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={theme.colors.brand}
                  />
                )}
              </Pressable>
            </View>
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="4"
            title="Condições de saúde"
            subtitle="Informe sinais de saúde crítica ou deficiência aparente."
          >
            <HealthSection
              saudeCritica={form.saudeCritica}
              onSaudeCriticaChange={form.selecionarSaudeCritica}
              problemasSelecionados={form.problemasSelecionados}
              onProblemaSelect={(opcao) =>
                form.alternarItem(opcao, form.setProblemasSelecionados)
              }
            />
            <View style={styles.sectionDivider} />
            <DisabilitySection
              deficiencia={form.deficiencia}
              onDeficienciaChange={form.selecionarDeficiencia}
              deficienciasSelecionadas={form.deficienciasSelecionadas}
              onDeficienciaSelect={(opcao) =>
                form.alternarItem(opcao, form.setDeficienciasSelecionadas)
              }
            />
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="5"
            title="Nível de urgência"
            subtitle="Qual a prioridade que essa ocorrência precisa?"
          >
            <View style={styles.urgencyList}>
              {URGENCIAS.map((urgencia) => {
                const ativo = form.nivelUrgencia === urgencia;
                const danger = urgencia === "Crítico";
                const warning = urgencia === "Moderado";
                return (
                  <Pressable
                    key={urgencia}
                    onPress={() => form.setNivelUrgencia(urgencia)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: ativo }}
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

          <OccurrenceFormSection
            number="6"
            title="Cuidados iniciais"
            subtitle="Registre se você ofereceu água ou comida ao animal."
          >
            <InitialCareSection
              aguaRegistrada={!!form.aguaRegistrada}
              comidaRegistrada={!!form.comidaRegistrada}
              aguaTexto={form.aguaRegistradaTexto}
              comidaTexto={form.comidaRegistradaTexto}
              onAguaPress={() => form.registrarCuidado("agua")}
              onComidaPress={() => form.registrarCuidado("comida")}
            />
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="7"
            title="Foto obrigatória"
            subtitle="Visualização da foto • toque para trocar/adicionar."
          >
            <PhotoSection fotoUri={photo.fotoUri} onPress={photo.selecionarFoto} />
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="8"
            title="Observação"
            subtitle="Existe algo importante que não foi informado acima?"
          >
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.observacao}
                onChangeText={form.setObservacao}
                placeholder="Conte brevemente o que você observou..."
                placeholderTextColor={theme.colors.textBody}
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>
            <Text style={styles.characterCount}>{form.observacao.length}/1000</Text>
          </OccurrenceFormSection>

          <OccurrenceFormSection
            number="9"
            title="Revisão"
            subtitle="Confira as informações antes de registrar a ocorrência."
          >
            <ReviewSection items={itensRevisao} />
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
              editor.modoEdicao
                ? "Salvar alterações da ocorrência"
                : "Registrar ocorrência"
            }
            onPress={handleSalvar}
            disabled={form.salvando}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              form.salvando && styles.submitButtonDisabled,
            ]}
          >
            {form.salvando ? (
              <ActivityIndicator color={theme.colors.surface} size="small" />
            ) : (
              <>
                <View style={styles.submitIcon}>
                  <Ionicons name="checkmark" size={20} color={theme.colors.brand} />
                </View>
                <View style={styles.submitContent}>
                  <Text style={styles.submitTitle}>
                    {editor.modoEdicao ? "Salvar alterações" : "Registrar ocorrência"}
                  </Text>
                  <Text style={styles.submitSubtitle}>
                    {editor.modoEdicao ? "Atualizar ocorrência" : "Enviar para o mapa"}
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

      <OccurrenceDateModal
        visible={form.mostrarSeletorData}
        value={form.dataOcorrenciaTexto}
        onChangeText={form.setDataOcorrenciaTexto}
        onClose={() => form.setMostrarSeletorData(false)}
        onConfirm={(date, formatted) => {
          form.setDataOcorrencia(date);
          form.setDataOcorrenciaTexto(formatted);
          form.setMostrarSeletorData(false);
        }}
      />
    </SafeAreaView>
  );
}
