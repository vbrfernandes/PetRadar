import React, { useCallback, useRef, useState } from "react";

import { FlatList, RefreshControl } from "react-native";

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppNavigationDrawer from "../../../app/navigation/components/AppNavigationDrawer";
import type { AppTabParamList } from "../../../app/navigation/types/appNavigation.types";
import { useAuthStore } from "../../../store";
import { theme } from "../../../theme";
import OccurrenceDetailDrawer from "../../occurrences/components/detail/OccurrenceDetailDrawer";
import {
  ProfileDetailScreen,
  ProfileQuickMenu,
  type ProfileUpdateResult,
} from "../../profile";
import ProcuraSeHeader from "../components/ProcuraSeHeader";
import ProcuraSeRegisterButton from "../components/ProcuraSeRegisterButton";
import ProcuraSeBannerCarousel from "../components/banner/ProcuraSeBannerCarousel";
import ProcuraSeOccurrenceCard from "../components/card/ProcuraSeOccurrenceCard";
import ProcuraSeControls from "../components/controls/ProcuraSeControls";
import ProcuraSeReportModal from "../components/report/ProcuraSeReportModal";
import ProcuraSeEmptyState from "../components/states/ProcuraSeEmptyState";
import ProcuraSeErrorState from "../components/states/ProcuraSeErrorState";
import ProcuraSeLoadingState from "../components/states/ProcuraSeLoadingState";
import ProcuraSeLocationDeniedState from "../components/states/ProcuraSeLocationDeniedState";
import { useProcuraSe } from "../hooks/useProcuraSe";
import { useProcuraSeEco } from "../hooks/useProcuraSeEco";
import { useProcuraSeFilters } from "../hooks/useProcuraSeFilters";
import { useProcuraSeProfile } from "../hooks/useProcuraSeProfile";
import { useProcuraSeReport } from "../hooks/useProcuraSeReport";
import { procuraSeScreenStyles as styles } from "../styles/procuraseScreen.styles";
import type { RecarregarListaOcorrencias } from "../types/procurase.types";

export default function ProcuraSeScreen() {
  const navigation =
    useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const user = useAuthStore((state) => state.user);

  const [selectedOccurrenceId, setSelectedOccurrenceId] =
    useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);
  const recarregarListaOrigemRef =
    useRef<RecarregarListaOcorrencias | null>(null);

  const {
    profilePhoto,
    raioPesquisaKm,
    carregarPerfil,
    aplicarAtualizacaoPerfil,
  } = useProcuraSeProfile();

  const {
    ocorrencias,
    loading,
    refreshing,
    error,
    localizacaoNegada,
    carregarFeed,
    removerOcorrencia,
    atualizarEco,
  } = useProcuraSe({ carregarPerfil });

  const {
    search,
    filtro,
    modoProcuraSe,
    ocorrenciasFiltradas,
    setSearch,
    setFiltro,
    selecionarModoProcuraSe,
    getModoProcuraSeAtual,
    limparFiltros,
  } = useProcuraSeFilters({
    ocorrencias,
    refreshing,
    carregarFeed,
  });

  const { ecosEmAndamento, alternarEco } = useProcuraSeEco({
    onEcoUpdated: atualizarEco,
  });

  const {
    denunciaOccurrenceId,
    enviandoDenuncia,
    abrirDenuncia,
    fecharDenuncia,
    enviarDenuncia,
  } = useProcuraSeReport();

  useFocusEffect(
    useCallback(() => {
      const atualizarFeed = async () => {
        await carregarFeed("normal", getModoProcuraSeAtual());

        const recarregarListaOrigem = recarregarListaOrigemRef.current;

        if (!recarregarListaOrigem) {
          return;
        }

        recarregarListaOrigemRef.current = null;
        await recarregarListaOrigem();
      };

      void atualizarFeed();
    }, [carregarFeed, getModoProcuraSeAtual]),
  );

  const handleProfileUpdated = useCallback(
    (updatedProfile: ProfileUpdateResult) => {
      aplicarAtualizacaoPerfil(updatedProfile);
      void carregarFeed("normal", getModoProcuraSeAtual());
    }, [
      aplicarAtualizacaoPerfil,
      carregarFeed,
      getModoProcuraSeAtual,
    ],
  );

  const abrirDetalheOcorrencia = useCallback(
    (
      occurrenceId: number,
      recarregarLista?: RecarregarListaOcorrencias,
    ) => {
      recarregarListaOrigemRef.current = recarregarLista ?? null;
      setSelectedOccurrenceId(occurrenceId);
    },
    [],
  );

  const handleOccurrenceEdit = useCallback(
    (occurrenceId: number) => {
      navigation.navigate("CadastroOcorrencia", { ocorrenciaId: occurrenceId });
    },
    [navigation],
  );

  const handleOccurrenceDeleted = useCallback(
    async (occurrenceId: number) => {
      removerOcorrencia(occurrenceId);

      const recarregarListaOrigem = recarregarListaOrigemRef.current;
      recarregarListaOrigemRef.current = null;

      const updates: Promise<unknown>[] = [
        carregarFeed("refresh", getModoProcuraSeAtual()),
      ];

      if (recarregarListaOrigem) {
        updates.push(Promise.resolve().then(recarregarListaOrigem));
      }

      await Promise.allSettled(updates);
    }, [carregarFeed, getModoProcuraSeAtual, removerOcorrencia],
  );

  const registrarOcorrencia = useCallback(() => {
    navigation.navigate("CadastroOcorrencia");
  }, [navigation]);

  const tentarNovamente = useCallback(() => {
    void carregarFeed("normal", getModoProcuraSeAtual());
  }, [carregarFeed, getModoProcuraSeAtual]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ProcuraSeLoadingState />
      </SafeAreaView>
    );
  }

  if (localizacaoNegada) {
    return (
      <SafeAreaView style={styles.container}>
        <ProcuraSeLocationDeniedState onRetry={tentarNovamente} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ProcuraSeErrorState message={error} onRetry={tentarNovamente} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ocorrenciasFiltradas}
        keyExtractor={(item) => String(item.id_ocorrencia)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              void carregarFeed("refresh", getModoProcuraSeAtual())
            }
            tintColor={theme.colors.brand}
            colors={[theme.colors.brand]}
          />
        }
        ListHeaderComponent={
          <>
            <ProcuraSeHeader
              profilePhoto={profilePhoto}
              mode={modoProcuraSe}
              raioPesquisaKm={raioPesquisaKm}
              onOpenMenu={() => setMenuVisible(true)}
              onOpenProfile={() => setProfileMenuVisible(true)}
            />
            <ProcuraSeBannerCarousel />
            <ProcuraSeControls
              search={search}
              mode={modoProcuraSe}
              filter={filtro}
              raioPesquisaKm={raioPesquisaKm}
              refreshing={refreshing}
              quantidadeOcorrenciasFiltradas={ocorrenciasFiltradas.length}
              onSearchChange={setSearch}
              onSelectMode={selecionarModoProcuraSe}
              onFilterChange={setFiltro}
            />
          </>
        }
        renderItem={({ item }) => (
          <ProcuraSeOccurrenceCard
            occurrence={item}
            forcaLoading={ecosEmAndamento.has(item.id_ocorrencia)}
            onPress={abrirDetalheOcorrencia}
            onToggleForca={alternarEco}
            onOpenOptions={abrirDenuncia}
          />
        )}
        ListEmptyComponent={
          <ProcuraSeEmptyState
            hasOccurrences={ocorrencias.length > 0}
            mode={modoProcuraSe}
            raioPesquisaKm={raioPesquisaKm}
            search={search}
            filter={filtro}
            onClearFilters={limparFiltros}
          />
        }
      />

      <ProcuraSeRegisterButton onPress={registrarOcorrencia} />

      <ProcuraSeReportModal
        visible={denunciaOccurrenceId !== null}
        sending={enviandoDenuncia}
        onClose={fecharDenuncia}
        onSubmit={enviarDenuncia}
      />

      <AppNavigationDrawer
        visible={menuVisible}
        activeScreen="ProcuraSe"
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={() => setMenuVisible(false)}
        onNavigateMap={() => navigation.navigate("Mapa")}
        onNavigateFeed={() => navigation.navigate("Feed")}
        onNavigateProcuraSe={() => navigation.navigate("ProcuraSe")}
      />

      <ProfileQuickMenu
        visible={profileMenuVisible}
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={() => setProfileMenuVisible(false)}
        onOpenProfile={() => setProfileDetailVisible(true)}
      />

      <ProfileDetailScreen
        visible={profileDetailVisible}
        onClose={() => setProfileDetailVisible(false)}
        onProfileUpdated={handleProfileUpdated}
        onOccurrencePress={abrirDetalheOcorrencia}
      />

      <OccurrenceDetailDrawer
        visible={selectedOccurrenceId !== null}
        occurrenceId={selectedOccurrenceId}
        onClose={() => setSelectedOccurrenceId(null)}
        onEdit={handleOccurrenceEdit}
        onDeleted={handleOccurrenceDeleted}
      />
    </SafeAreaView>
  );
}
