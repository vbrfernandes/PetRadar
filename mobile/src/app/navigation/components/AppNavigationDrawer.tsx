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
    Text,
    View,
} from "react-native";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../../../theme";

import {
    appNavigationDrawerStyles as styles,
} from "../styles/appNavigationDrawer.styles";

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
    | "Feed"
    | "ProcuraSe";

interface AppNavigationDrawerProps {
    visible: boolean;

    activeScreen: AppNavigationScreen;

    profilePhoto: string | null;

    userName?: string | null;
    userEmail?: string | null;

    onClose: () => void;

    onNavigateMap: () => void;
    onNavigateFeed: () => void;
    onNavigateProcuraSe: () => void;
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
    onNavigateProcuraSe,

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

    const handleProcuraSe = () => {
        if (
            activeScreen ===
            "ProcuraSe"
        ) {
            onClose();

            return;
        }

        fecharComAcao(
            onNavigateProcuraSe,
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
                            active={
                                activeScreen ===
                                "ProcuraSe"
                            }
                            onPress={
                                handleProcuraSe
                            }
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
