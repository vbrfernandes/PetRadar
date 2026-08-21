import React, { useCallback, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import AppNavigationDrawer from "../../../components/AppNavigationDrawer";
import type { AppTabParamList } from "../../../navigation/navigation.types";
import { useAuthStore } from "../../../store/useAuthStore";
import { theme } from "../../../theme/colors";
import OccurrenceDetailDrawer from "../../occurrences/components/detail/OccurrenceDetailDrawer";
import ProfileDetailScreen from "../../profile/components/ProfileDetailScreen";
import ProfileQuickMenu from "../../profile/components/ProfileQuickMenu";
import FeedBannerCarousel from "../components/banner/FeedBannerCarousel";
import OccurrenceCard from "../components/card/OccurrenceCard";
import FeedControls from "../components/controls/FeedControls";
import FeedHeader from "../components/FeedHeader";
import FeedRegisterButton from "../components/FeedRegisterButton";
import ReportOccurrenceModal from "../components/ReportOccurrenceModal";
import FeedEmptyState from "../components/states/FeedEmptyState";
import FeedErrorState from "../components/states/FeedErrorState";
import FeedLoadingState from "../components/states/FeedLoadingState";
import FeedLocationDeniedState from "../components/states/FeedLocationDeniedState";
import { useFeed } from "../hooks/useFeed";
import { useFeedEco } from "../hooks/useFeedEco";
import { useFeedFilters } from "../hooks/useFeedFilters";
import { useFeedReport } from "../hooks/useFeedReport";
import { feedScreenStyles as styles } from "../styles/feedScreen.styles";
import type { RecarregarListaOcorrencias } from "../types/feed.types";

export default function FeedNoticias() {
  const navigation =
    useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const user = useAuthStore((state) => state.user);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    number | null
  >(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);
  const recarregarListaOrigemRef =
    useRef<RecarregarListaOcorrencias | null>(null);

  const {
    ocorrencias,
    setOcorrencias,
    loading,
    refreshing,
    error,
    localizacaoNegada,
    raioPesquisaKm,
    profilePhoto,
    modoFeed,
    carregarFeed,
    selecionarModoFeed,
    handleProfileUpdated,
    removerOcorrencia,
  } = useFeed();
  const { forcasEmAndamento, alternarForca } = useFeedEco(setOcorrencias);
  const {
    search,
    setSearch,
    filtro,
    setFiltro,
    ocorrenciasFiltradas,
    limparFiltros,
  } = useFeedFilters(ocorrencias, modoFeed);
  const {
    denunciaOccurrenceId,
    enviandoDenuncia,
    abrirOpcoesOcorrencia,
    fecharDenuncia,
    enviarDenuncia,
  } = useFeedReport();

  useFocusEffect(
    useCallback(() => {
      const atualizarFeed = async () => {
        await carregarFeed();

        const recarregarListaOrigem = recarregarListaOrigemRef.current;

        if (!recarregarListaOrigem) {
          return;
        }

        recarregarListaOrigemRef.current = null;
        await recarregarListaOrigem();
      };

      void atualizarFeed();
    }, [carregarFeed]),
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
      const atualizacoes: Promise<unknown>[] = [
        carregarFeed("refresh"),
      ];

      if (recarregarListaOrigem) {
        atualizacoes.push(
          Promise.resolve().then(recarregarListaOrigem),
        );
      }

      await Promise.allSettled(atualizacoes);
    },
    [carregarFeed, removerOcorrencia],
  );

  const abrirMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const fecharMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const registrarOcorrencia = useCallback(() => {
    navigation.navigate("CadastroOcorrencia");
  }, [navigation]);

  if (loading) {
    return <FeedLoadingState />;
  }

  if (localizacaoNegada) {
    return <FeedLocationDeniedState onRetry={() => void carregarFeed()} />;
  }

  if (error) {
    return <FeedErrorState error={error} onRetry={() => void carregarFeed()} />;
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
            onRefresh={() => void carregarFeed("refresh")}
            tintColor={theme.colors.brand}
            colors={[theme.colors.brand]}
          />
        }
        ListHeaderComponent={
          <>
            <FeedHeader
              profilePhoto={profilePhoto}
              modoFeed={modoFeed}
              raioPesquisaKm={raioPesquisaKm}
              onOpenMenu={abrirMenu}
              onOpenProfile={() => setProfileMenuVisible(true)}
            />
            <FeedBannerCarousel />
            <FeedControls
              search={search}
              modoFeed={modoFeed}
              filtro={filtro}
              raioPesquisaKm={raioPesquisaKm}
              refreshing={refreshing}
              quantidadeOcorrenciasFiltradas={ocorrenciasFiltradas.length}
              onSearchChange={setSearch}
              onSelectMode={selecionarModoFeed}
              onFilterChange={setFiltro}
            />
          </>
        }
        renderItem={({ item }) => (
          <OccurrenceCard
            occurrence={item}
            forcaLoading={forcasEmAndamento.has(item.id_ocorrencia)}
            onPress={abrirDetalheOcorrencia}
            onToggleForca={alternarForca}
            onOpenOptions={abrirOpcoesOcorrencia}
          />
        )}
        ListEmptyComponent={
          <FeedEmptyState
            totalOcorrencias={ocorrencias.length}
            modoFeed={modoFeed}
            raioPesquisaKm={raioPesquisaKm}
            search={search}
            filtro={filtro}
            onClearFilters={limparFiltros}
          />
        }
      />

      <FeedRegisterButton onPress={registrarOcorrencia} />

      <ReportOccurrenceModal
        visible={denunciaOccurrenceId !== null}
        loading={enviandoDenuncia}
        onClose={fecharDenuncia}
        onSelectReason={enviarDenuncia}
      />

      <AppNavigationDrawer
        visible={menuVisible}
        activeScreen="Feed"
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={fecharMenu}
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
