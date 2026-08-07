import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Platform,
  Animated,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../theme/colors";
import { useAuthStore } from "../store/useAuthStore";
import ProfileDetailScreen from "./ProfileDetailScreen";
import api from "../services/api";

const { width } = Dimensions.get("window");

const INITIAL_REGION: Region = {
  latitude: -19.9167,
  longitude: -43.9345,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export default function MapScreen() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const mapRef = useRef<MapView | null>(null);

  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    obterLocalizacaoInicial();
    carregarFotoPerfil();
  }, []);

  const carregarFotoPerfil = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data?.foto_perfil) {
        setProfilePhoto(response.data.foto_perfil);
      }
    } catch (error) {
      console.warn("Erro ao carregar foto do perfil:", error);
    }
  };

  const obterLocalizacaoInicial = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "A permissão de localização é necessária para exibir o mapa centralizado na sua posição.",
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation(currentLocation);

      const region: Region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      };

      mapRef.current?.animateToRegion(region, 1000);
    } catch (error) {
      console.warn("Erro ao obter localização: ", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const recentralizarMapa = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800,
      );
    } else {
      obterLocalizacaoInicial();
    }
  };

  const alterarZoom = (zoomIn: boolean) => {
    mapRef.current?.getCamera().then((camera) => {
      if (camera && camera.zoom !== undefined) {
        mapRef.current?.animateCamera(
          { zoom: camera.zoom + (zoomIn ? 1 : -1) },
          { duration: 300 },
        );
      }
    });
  };

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    setProfileMenuVisible(false);
    Alert.alert(
      "Sair da conta",
      `Olá, ${user?.name || "Usuário"}. Tem certeza de que deseja encerrar a sessão?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => logout(),
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
      />

      {loadingLocation && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
        </View>
      )}

      {/* HEADER FLUTUANTE */}
      <View style={styles.topOverlay}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons
            color={theme.colors.textTitle}
            name="menu-outline"
            size={28}
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons
            color={theme.colors.textBody}
            name="search-outline"
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor={theme.colors.textBody}
            style={styles.searchInput}
          />
        </View>

        {/* BOTÃO DE PERFIL */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setProfileMenuVisible(true)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: profilePhoto || "https://i.pravatar.cc/150?img=11" }}
            style={styles.profileImage}
          />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* CONTROLES DE ZOOM E FILTROS */}
      <View style={styles.rightControls}>
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => alterarZoom(true)}
          >
            <Ionicons color={theme.colors.textTitle} name="add" size={24} />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => alterarZoom(false)}
          >
            <Ionicons color={theme.colors.textTitle} name="remove" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.filterPill}>
            <Ionicons
              name="options-outline"
              size={18}
              color={theme.colors.textTitle}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.filterText}>Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RECENTRALIZAR */}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={recentralizarMapa}
      >
        <MaterialCommunityIcons
          color={theme.colors.brand}
          name="crosshairs-gps"
          size={24}
        />
      </TouchableOpacity>

      {/* CTA PRINCIPAL */}
      <View style={styles.bottomOverlay}>
        <TouchableOpacity activeOpacity={0.9} style={styles.ctaButton}>
          <MaterialCommunityIcons
            color={theme.colors.surface}
            name="clipboard-text-outline"
            size={24}
          />
          <Text style={styles.ctaText}>REGISTRO DE OCORRÊNCIA</Text>
          <Ionicons
            color={theme.colors.surface}
            name="chevron-forward"
            size={24}
          />
        </TouchableOpacity>
      </View>

      {/* MENU DROP DOWN DO PERFIL */}
      <Modal
        visible={profileMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setProfileMenuVisible(false)}
        >
          <View style={styles.profileMenuCard}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setProfileMenuVisible(false);
                setProfileDetailVisible(true);
              }}
            >
              <View style={styles.profileHeader}>
                <Image
                  source={{
                    uri: profilePhoto || "https://i.pravatar.cc/150?img=11",
                  }}
                  style={styles.menuProfileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user?.name || "Usuário"}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {user?.email || "email não informado"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.profileOption}
              onPress={() => {
                setProfileMenuVisible(false);
                setProfileDetailVisible(true);
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.colors.textTitle}
              />
              <Text style={styles.profileOptionText}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileOption}
              onPress={() => setProfileMenuVisible(false)}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme.colors.textTitle}
              />
              <Text style={styles.profileOptionText}>Notificações</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.logoutOption}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.colors.semantic.danger.text}
              />
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DRAWER LATERAL */}
      {menuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleMenu}
          style={styles.drawerBackdrop}
        >
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.drawerContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.drawerHeaderTitle}>Navegação</Text>

              <TouchableOpacity style={styles.drawerItemActive}>
                <Ionicons
                  color={theme.colors.brand}
                  name="map-outline"
                  size={22}
                />
                <Text style={styles.drawerTextActive}>Mapa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons
                  color={theme.colors.textTitle}
                  name="cellular-outline"
                  size={22}
                />
                <Text style={styles.drawerText}>Feed</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons
                  color={theme.colors.textTitle}
                  name="people-outline"
                  size={22}
                />
                <Text style={styles.drawerText}>ONGs</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons
                  color={theme.colors.textTitle}
                  name="search-outline"
                  size={22}
                />
                <Text style={styles.drawerText}>Procura-se</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />
              <Text style={styles.drawerHeaderTitle}>Conta e Opções</Text>

              <TouchableOpacity style={styles.drawerItem}>
                <Ionicons
                  color={theme.colors.textTitle}
                  name="settings-outline"
                  size={22}
                />
                <Text style={styles.drawerText}>Configurações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sosButton}>
                <MaterialCommunityIcons
                  color={theme.colors.surface}
                  name="alarm-light-outline"
                  size={22}
                />
                <Text style={styles.sosText}>Emergência SOS</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* MODAL DESLIZANTE DO PERFIL COMPLETO */}
      <ProfileDetailScreen
        visible={profileDetailVisible}
        onClose={() => setProfileDetailVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingOverlay: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: theme.radius.button,
    ...theme.shadows.elevation1,
  },
  topOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.padding,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    zIndex: 10,
  },
  menuButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.elevation1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    ...theme.shadows.elevation1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textTitle,
    fontWeight: "500",
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevation1,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: theme.colors.semantic.danger.text,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  rightControls: {
    position: "absolute",
    top: 120,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 9,
  },
  zoomControls: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    width: 48,
    alignItems: "center",
    ...theme.shadows.elevation1,
  },
  zoomButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomDivider: {
    width: 24,
    height: 1,
    backgroundColor: theme.colors.inputBg,
  },
  filtersContainer: {
    alignItems: "flex-end",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.button,
    ...theme.shadows.elevation1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textTitle,
  },
  recenterButton: {
    position: "absolute",
    bottom: 140,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.elevation1,
    zIndex: 10,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 48,
    left: 24,
    right: 24,
    zIndex: 10,
  },
  ctaButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.brand,
    height: 64,
    borderRadius: theme.radius.card,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    ...theme.shadows.buttonGlow,
  },
  ctaText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "ios" ? 110 : 80,
    paddingRight: theme.spacing.padding,
  },
  profileMenuCard: {
    width: 240,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: 16,
    ...theme.shadows.elevation1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  menuProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textTitle,
  },
  profileEmail: {
    fontSize: 12,
    color: theme.colors.textBody,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.inputBg,
    marginVertical: 10,
  },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: theme.radius.button,
  },
  profileOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textTitle,
    marginLeft: 12,
  },
  logoutOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: theme.radius.button,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.semantic.danger.text,
    marginLeft: 12,
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 100,
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: Platform.OS === "ios" ? 64 : 40,
    paddingBottom: 24,
    ...theme.shadows.elevation1,
  },
  drawerContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  drawerHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textBody,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 12,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.button,
    marginBottom: 4,
  },
  drawerText: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.textTitle,
    marginLeft: 16,
  },
  drawerItemActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.semantic.success.bg,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.button,
    marginBottom: 4,
  },
  drawerTextActive: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.brand,
    marginLeft: 16,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: theme.colors.inputBg,
    marginVertical: 12,
    width: "100%",
  },
  sosButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.semantic.danger.text,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    shadowColor: theme.colors.semantic.danger.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sosText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },
});
