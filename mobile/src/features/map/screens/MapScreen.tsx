import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Mapbox from "@rnmapbox/maps";

import AppNavigationDrawer from "../../../components/AppNavigationDrawer";
import type { AppTabParamList } from "../../../navigation/navigation.types";
import { useAuthStore } from "../../../store/useAuthStore";
import OccurrenceDetailDrawer from "../../occurrences/components/detail/OccurrenceDetailDrawer";
import {
  ProfileDetailScreen,
  ProfileQuickMenu,
  type ProfileUpdateResult,
} from "../../profile";
import { MapBottomActions } from "../components/controls/MapBottomActions";
import { MapHeader } from "../components/controls/MapHeader";
import { MapZoomControls } from "../components/controls/MapZoomControls";
import { MapFiltersModal } from "../components/filters/MapFiltersModal";
import { MapLocationButton } from "../components/location/MapLocationButton";
import { OccurrenceMarkers } from "../components/markers/OccurrenceMarkers";
import { MapDiscoveryStatus } from "../components/states/MapDiscoveryStatus";
import { MapLoadingStates } from "../components/states/MapLoadingStates";
import {
  INITIAL_COORDINATE,
  INITIAL_ZOOM,
  MAPBOX_ACCESS_TOKEN,
} from "../constants/map.constants";
import { useMapAnimations } from "../hooks/useMapAnimations";
import { useMapCamera } from "../hooks/useMapCamera";
import { useMapLocation } from "../hooks/useMapLocation";
import { useMapOccurrences } from "../hooks/useMapOccurrences";
import { useMapProfile } from "../hooks/useMapProfile";
import { mapScreenStyles as styles } from "../styles/map.styles";

if (!MAPBOX_ACCESS_TOKEN) {
  console.error("MAPBOX: EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN não foi encontrada.");
} else {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

export default function MapScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const user = useAuthStore((state) => state.user);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const { userLocation, loadingLocation, obterLocalizacaoInicial } =
    useMapLocation();
  const {
    profilePhoto,
    raioPesquisaKm,
    perfilMapaCarregado,
    aplicarPerfilAtualizado,
  } = useMapProfile();
  const {
    searchFocusAnim,
    discoveryAnim,
    discoveryVisible,
    handleSearchFocus,
    handleSearchBlur,
  } = useMapAnimations();
  const {
    mapRef,
    cameraRef,
    recentralizarMapa,
    alterarZoom,
    marcarMapaPronto,
  } = useMapCamera({ userLocation, obterLocalizacaoInicial });
  const {
    search,
    setSearch,
    tipoFiltro,
    setTipoFiltro,
    urgenciaFiltro,
    setUrgenciaFiltro,
    ocorrenciasVisiveis,
    loadingOcorrencias,
    selectedOccurrenceId,
    setSelectedOccurrenceId,
    abrirDetalheOcorrencia,
    carregarOcorrenciasProximas,
    handleOccurrenceDeleted,
  } = useMapOccurrences({
    userLocation,
    raioPesquisaKm,
    perfilMapaCarregado,
    obterLocalizacaoInicial,
  });

  const handleProfileUpdated = useCallback(
    (updatedProfile: ProfileUpdateResult) => {
      const novoRaio = aplicarPerfilAtualizado(updatedProfile);

      if (userLocation) {
        void carregarOcorrenciasProximas(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          novoRaio,
        );
      }
    }, [aplicarPerfilAtualizado, carregarOcorrenciasProximas, userLocation],
  );

  const handleOccurrenceEdit = useCallback(
    (occurrenceId: number) => {
      navigation.navigate("CadastroOcorrencia", { ocorrenciaId: occurrenceId });
    },
    [navigation],
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Mapbox.MapView
        ref={mapRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        styleURL={Mapbox.StyleURL.Street}
        compassEnabled={false}
        logoEnabled={true}
        attributionEnabled={true}
        scaleBarEnabled={false}
        rotateEnabled={true}
        pitchEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        onMapIdle={marcarMapaPronto}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: INITIAL_COORDINATE,
            zoomLevel: INITIAL_ZOOM,
            pitch: 0,
            heading: 0,
          }}
        />

        <Mapbox.UserLocation visible={true} showsUserHeadingIndicator={false} />

        <OccurrenceMarkers
          ocorrencias={ocorrenciasVisiveis}
          onOccurrencePress={abrirDetalheOcorrencia}
        />
      </Mapbox.MapView>

      <MapLoadingStates
        loadingLocation={loadingLocation}
        loadingOcorrencias={loadingOcorrencias}
      />

      <MapHeader
        search={search}
        profilePhoto={profilePhoto}
        searchFocusAnim={searchFocusAnim}
        onChangeSearch={setSearch}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        onOpenMenu={() => setMenuVisible(true)}
        onOpenFilters={() => setFiltersVisible(true)}
        onOpenProfile={() => setProfileMenuVisible(true)}
      />

      <MapDiscoveryStatus
        discoveryVisible={discoveryVisible}
        discoveryAnim={discoveryAnim}
      />

      <MapZoomControls onChangeZoom={alterarZoom} />

      <MapLocationButton onPress={recentralizarMapa} />

      <MapBottomActions
        onRegisterOccurrence={() => navigation.navigate("CadastroOcorrencia")}
      />

      <ProfileQuickMenu
        visible={profileMenuVisible}
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={() => {
          setProfileMenuVisible(false);
        }}
        onOpenProfile={() => {
          setProfileDetailVisible(true);
        }}
      />

      <MapFiltersModal
        visible={filtersVisible}
        tipoFiltro={tipoFiltro}
        urgenciaFiltro={urgenciaFiltro}
        onChangeTipoFiltro={setTipoFiltro}
        onChangeUrgenciaFiltro={setUrgenciaFiltro}
        onClose={() => setFiltersVisible(false)}
      />

      <AppNavigationDrawer
        visible={menuVisible}
        activeScreen="Mapa"
        profilePhoto={profilePhoto}
        userName={user?.name || null}
        userEmail={user?.email || null}
        onClose={() => setMenuVisible(false)}
        onNavigateMap={() => {
          navigation.navigate("Mapa");
        }}
        onNavigateFeed={() => {
          navigation.navigate("Feed");
        }}
        onNavigateProcuraSe={() => {
          navigation.navigate("ProcuraSe");
        }}
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
