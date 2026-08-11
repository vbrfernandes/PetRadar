// ============================================================
// AppNavigationDrawer.tsx
//
// Menu principal compartilhado do PetRadar.
//
// Utilizado por:
// - MapScreen
// - FeedNoticias
//
// Objetivo:
// evitar duplicação do drawer de navegação.
// ============================================================

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../theme/colors";

// ============================================================
// DIMENSÕES
// ============================================================

const { width } = Dimensions.get("window");

const DRAWER_WIDTH = Math.min(
    width * 0.84,
    340,
);

// ============================================================
// TIPAGEM
// ============================================================

export type AppNavigationScreen =
    | "Mapa"
    | "Feed";

interface AppNavigationDrawerProps {
    visible: boolean;

    activeScreen: AppNavigationScreen;

    profilePhoto: string | null;

    userName?: string | null;
    userEmail?: string | null;

    onClose: () => void;

    onNavigateMap: () => void;
    onNavigateFeed: () => void;
}

interface DrawerItemProps {
    icon: keyof typeof Ionicons.glyphMap;

    label: string;

    active?: boolean;

    onPress?: () => void;
}

// ============================================================
// ITEM DO DRAWER
// ============================================================

function DrawerItem({
    icon,
    label,
    active = false,
    onPress,
}: DrawerItemProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{
                selected: active,
            }}
            style={({ pressed }) => [
                styles.drawerItem,

                active &&
                    styles.drawerItemActive,

                pressed &&
                    styles.drawerItemPressed,
            ]}
        >
            <View
                style={[
                    styles.drawerItemIcon,

                    active &&
                        styles.drawerItemIconActive,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={21}
                    color={
                        active
                            ? theme.colors.brand
                            : theme.colors.textBody
                    }
                />
            </View>

            <Text
                style={[
                    styles.drawerItemText,

                    active &&
                        styles.drawerItemTextActive,
                ]}
            >
                {label}
            </Text>

            {active ? (
                <View
                    style={
                        styles.drawerActiveIndicator
                    }
                />
            ) : null}
        </Pressable>
    );
}

// ============================================================
// COMPONENTE
// ============================================================

export default function AppNavigationDrawer({
    visible,

    activeScreen,

    profilePhoto,

    userName,
    userEmail,

    onClose,

    onNavigateMap,
    onNavigateFeed,
}: AppNavigationDrawerProps) {
    const translateX = useRef(
        new Animated.Value(
            -DRAWER_WIDTH,
        ),
    ).current;

    const overlayOpacity = useRef(
        new Animated.Value(0),
    ).current;

    const [mounted, setMounted] =
        useState(visible);

    // ========================================================
    // ABERTURA / FECHAMENTO
    // ========================================================

    useEffect(() => {
        if (visible) {
            setMounted(true);

            translateX.setValue(
                -DRAWER_WIDTH,
            );

            overlayOpacity.setValue(0);

            Animated.parallel([
                Animated.spring(
                    translateX,
                    {
                        toValue: 0,

                        useNativeDriver: true,

                        damping: 22,
                        stiffness: 180,
                    },
                ),

                Animated.timing(
                    overlayOpacity,
                    {
                        toValue: 1,

                        duration: 220,

                        useNativeDriver: true,
                    },
                ),
            ]).start();

            return;
        }

        if (!mounted) {
            return;
        }

        Animated.parallel([
            Animated.timing(
                translateX,
                {
                    toValue:
                        -DRAWER_WIDTH,

                    duration: 220,

                    useNativeDriver: true,
                },
            ),

            Animated.timing(
                overlayOpacity,
                {
                    toValue: 0,

                    duration: 180,

                    useNativeDriver: true,
                },
            ),
        ]).start(() => {
            setMounted(false);
        });
    }, [
        visible,
        mounted,
        translateX,
        overlayOpacity,
    ]);

    // ========================================================
    // FECHAR + EXECUTAR AÇÃO
    // ========================================================

    const fecharComAcao = (
        action: () => void,
    ) => {
        Animated.parallel([
            Animated.timing(
                translateX,
                {
                    toValue:
                        -DRAWER_WIDTH,

                    duration: 220,

                    useNativeDriver: true,
                },
            ),

            Animated.timing(
                overlayOpacity,
                {
                    toValue: 0,

                    duration: 180,

                    useNativeDriver: true,
                },
            ),
        ]).start(() => {
            setMounted(false);

            onClose();

            action();
        });
    };

    // ========================================================
    // NAVEGAÇÃO
    // ========================================================

    const handleMapa = () => {
        if (
            activeScreen === "Mapa"
        ) {
            onClose();

            return;
        }

        fecharComAcao(
            onNavigateMap,
        );
    };

    const handleFeed = () => {
        if (
            activeScreen === "Feed"
        ) {
            onClose();

            return;
        }

        fecharComAcao(
            onNavigateFeed,
        );
    };

    // ========================================================
    // NÃO RENDERIZAR QUANDO FECHADO
    // ========================================================

    if (!mounted) {
        return null;
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <View
            style={
                styles.drawerRoot
            }
        >
            {/* ===============================================
                OVERLAY
            ================================================ */}

            <Animated.View
                pointerEvents="none"
                style={[
                    styles.drawerOverlay,
                    {
                        opacity:
                            overlayOpacity,
                    },
                ]}
            />

            {/* ===============================================
                ÁREA EXTERNA CLICÁVEL
            ================================================ */}

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar menu"
                style={
                    styles.drawerTouchableArea
                }
                onPress={onClose}
            />

            {/* ===============================================
                DRAWER
            ================================================ */}

            <Animated.View
                style={[
                    styles.drawer,
                    {
                        width:
                            DRAWER_WIDTH,

                        transform: [
                            {
                                translateX,
                            },
                        ],
                    },
                ]}
            >
                <SafeAreaView
                    edges={[
                        "top",
                        "bottom",
                    ]}
                    style={
                        styles.drawerSafeArea
                    }
                >
                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.drawerContent
                        }
                    >
                        {/* ===================================
                            HEADER / MARCA
                        ==================================== */}

                        <View
                            style={
                                styles.drawerHeader
                            }
                        >
                            <View
                                style={
                                    styles.drawerBrandIcon
                                }
                            >
                                <MaterialCommunityIcons
                                    name="paw"
                                    size={23}
                                    color={
                                        theme
                                            .colors
                                            .surface
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.drawerBrandContent
                                }
                            >
                                <Text
                                    style={
                                        styles.drawerBrandTitle
                                    }
                                >
                                    PetRadar
                                </Text>

                                <Text
                                    style={
                                        styles.drawerBrandSubtitle
                                    }
                                >
                                    Comunidade que cuida
                                </Text>
                            </View>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Fechar menu"
                                onPress={
                                    onClose
                                }
                                style={
                                    styles.drawerClose
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={21}
                                    color={
                                        theme
                                            .colors
                                            .textTitle
                                    }
                                />
                            </Pressable>
                        </View>

                        {/* ===================================
                            USUÁRIO
                        ==================================== */}

                        <View
                            style={
                                styles.drawerUserCard
                            }
                        >
                            <Image
                                source={{
                                    uri:
                                        profilePhoto ||
                                        "https://i.pravatar.cc/150?img=11",
                                }}
                                style={
                                    styles.drawerAvatar
                                }
                            />

                            <View
                                style={
                                    styles.drawerUserInfo
                                }
                            >
                                <Text
                                    style={
                                        styles.drawerUserName
                                    }
                                    numberOfLines={
                                        1
                                    }
                                >
                                    {userName ||
                                        "Usuário"}
                                </Text>

                                <Text
                                    style={
                                        styles.drawerUserEmail
                                    }
                                    numberOfLines={
                                        1
                                    }
                                >
                                    {userEmail ||
                                        "Bem-vindo ao PetRadar"}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.drawerUserStatus
                                }
                            />
                        </View>

                        {/* ===================================
                            EXPLORAR
                        ==================================== */}

                        <Text
                            style={
                                styles.drawerSectionTitle
                            }
                        >
                            EXPLORAR
                        </Text>

                        <DrawerItem
                            icon="map-outline"
                            label="Mapa"
                            active={
                                activeScreen ===
                                "Mapa"
                            }
                            onPress={
                                handleMapa
                            }
                        />

                        <DrawerItem
                            icon="newspaper-outline"
                            label="Feed"
                            active={
                                activeScreen ===
                                "Feed"
                            }
                            onPress={
                                handleFeed
                            }
                        />

                        <DrawerItem
                            icon="people-outline"
                            label="ONGs"
                        />

                        <DrawerItem
                            icon="search-outline"
                            label="Procura-se"
                        />

                        <View
                            style={
                                styles.drawerDivider
                            }
                        />

                        {/* ===================================
                            CONTA E OPÇÕES
                        ==================================== */}

                        <Text
                            style={
                                styles.drawerSectionTitle
                            }
                        >
                            CONTA E OPÇÕES
                        </Text>

                        <DrawerItem
                            icon="notifications-outline"
                            label="Notificações"
                        />

                        <DrawerItem
                            icon="settings-outline"
                            label="Configurações"
                        />

                        {/* ===================================
                            SOS
                        ==================================== */}

                        <View
                            style={
                                styles.sosCard
                            }
                        >
                            <View
                                style={
                                    styles.sosIcon
                                }
                            >
                                <MaterialCommunityIcons
                                    name="alarm-light-outline"
                                    size={21}
                                    color={
                                        theme
                                            .colors
                                            .semantic
                                            .danger
                                            .text
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.sosContent
                                }
                            >
                                <Text
                                    style={
                                        styles.sosTitle
                                    }
                                >
                                    Emergência
                                </Text>

                                <Text
                                    style={
                                        styles.sosDescription
                                    }
                                >
                                    Precisa de ajuda?
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={
                                    theme
                                        .colors
                                        .semantic
                                        .danger
                                        .text
                                }
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
    drawerRoot: {
        position: "absolute",

        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        zIndex: 90,
    },

    // ========================================================
    // OVERLAY
    // ========================================================

    drawerOverlay: {
        position: "absolute",

        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        backgroundColor:
            "rgba(10,24,20,0.48)",

        zIndex: 90,
    },

    drawerTouchableArea: {
        position: "absolute",

        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        zIndex: 91,
    },

    // ========================================================
    // DRAWER
    // ========================================================

    drawer: {
        position: "absolute",

        top: 0,
        bottom: 0,
        left: 0,

        backgroundColor:
            theme.colors.background,

        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,

        overflow: "hidden",

        zIndex: 100,

        ...theme.shadows.elevation1,
    },

    drawerSafeArea: {
        flex: 1,
    },

    drawerContent: {
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 28,
    },

    // ========================================================
    // HEADER
    // ========================================================

    drawerHeader: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 4,

        marginBottom: 18,
    },

    drawerBrandIcon: {
        width: 43,
        height: 43,

        borderRadius: 14,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor:
            theme.colors.brand,
    },

    drawerBrandContent: {
        marginLeft: 11,

        flex: 1,
    },

    drawerBrandTitle: {
        fontSize: 17,
        fontWeight: "900",

        color:
            theme.colors.textTitle,
    },

    drawerBrandSubtitle: {
        marginTop: 1,

        fontSize: 10,

        color:
            theme.colors.textBody,
    },

    drawerClose: {
        width: 38,
        height: 38,

        borderRadius: 13,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor:
            theme.colors.surface,
    },

    // ========================================================
    // USUÁRIO
    // ========================================================

    drawerUserCard: {
        minHeight: 70,

        flexDirection: "row",
        alignItems: "center",

        padding: 10,

        borderRadius: 18,

        backgroundColor:
            theme.colors.surface,

        ...theme.shadows.elevation1,
    },

    drawerAvatar: {
        width: 46,
        height: 46,

        borderRadius: 15,
    },

    drawerUserInfo: {
        flex: 1,

        marginLeft: 10,
    },

    drawerUserName: {
        fontSize: 12,
        fontWeight: "800",

        color:
            theme.colors.textTitle,
    },

    drawerUserEmail: {
        marginTop: 3,

        fontSize: 10,

        color:
            theme.colors.textBody,
    },

    drawerUserStatus: {
        width: 9,
        height: 9,

        borderRadius: 5,

        backgroundColor:
            theme.colors.semantic.success
                .text,
    },

    // ========================================================
    // SEÇÕES
    // ========================================================

    drawerSectionTitle: {
        marginTop: 25,
        marginBottom: 9,

        paddingHorizontal: 10,

        fontSize: 9,
        fontWeight: "900",

        letterSpacing: 1,

        color:
            theme.colors.textBody,
    },

    drawerDivider: {
        height: 1,

        marginVertical: 12,

        backgroundColor:
            theme.colors.inputBg,
    },

    // ========================================================
    // ITENS
    // ========================================================

    drawerItem: {
        minHeight: 49,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 7,

        borderRadius: 15,

        marginBottom: 3,
    },

    drawerItemActive: {
        backgroundColor:
            theme.colors.semantic.success
                .bg,
    },

    drawerItemPressed: {
        backgroundColor:
            theme.colors.inputBg,
    },

    drawerItemIcon: {
        width: 38,
        height: 38,

        borderRadius: 12,

        alignItems: "center",
        justifyContent: "center",
    },

    drawerItemIconActive: {
        backgroundColor:
            theme.colors.surface,
    },

    drawerItemText: {
        marginLeft: 8,

        fontSize: 13,
        fontWeight: "600",

        color:
            theme.colors.textTitle,
    },

    drawerItemTextActive: {
        fontWeight: "800",

        color:
            theme.colors.brand,
    },

    drawerActiveIndicator: {
        width: 4,
        height: 20,

        borderRadius: 2,

        marginLeft: "auto",

        backgroundColor:
            theme.colors.brand,
    },

    // ========================================================
    // SOS
    // ========================================================

    sosCard: {
        minHeight: 66,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 10,

        marginTop: 24,

        borderRadius: 18,

        borderWidth: 1,

        borderColor:
            theme.colors.semantic.danger.bg,

        backgroundColor:
            theme.colors.semantic.danger.bg,
    },

    sosIcon: {
        width: 39,
        height: 39,

        borderRadius: 13,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor:
            theme.colors.surface,
    },

    sosContent: {
        flex: 1,

        marginLeft: 10,
    },

    sosTitle: {
        fontSize: 12,
        fontWeight: "800",

        color:
            theme.colors.semantic.danger
                .text,
    },

    sosDescription: {
        marginTop: 2,

        fontSize: 9,

        color:
            theme.colors.textBody,
    },
});