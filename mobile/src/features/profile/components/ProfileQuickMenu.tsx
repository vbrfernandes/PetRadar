import React from "react";

import {
    Alert,
    Image,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../theme/colors";
import { useAuthStore } from "../../../store/useAuthStore";
import {
    profileQuickMenuStyles as styles,
} from "../styles/profile.styles";


// ============================================================
// TIPAGEM
// ============================================================

interface ProfileQuickMenuProps {
    visible: boolean;

    profilePhoto: string | null;

    userName?: string | null;
    userEmail?: string | null;

    onClose: () => void;

    onOpenProfile: () => void;

    onOpenNotifications?: () => void;
}

// ============================================================
// COMPONENTE
// ============================================================

export default function ProfileQuickMenu({
    visible,

    profilePhoto,

    userName,
    userEmail,

    onClose,

    onOpenProfile,
    onOpenNotifications,
}: ProfileQuickMenuProps) {
    const logout = useAuthStore(
        (state) => state.logout,
    );

    // ========================================================
    // PERFIL COMPLETO
    // ========================================================

    const handleOpenProfile = () => {
        onClose();

        onOpenProfile();
    };

    // ========================================================
    // NOTIFICAÇÕES
    // ========================================================

    const handleOpenNotifications = () => {
        onClose();

        onOpenNotifications?.();
    };

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {
        onClose();

        Alert.alert(
            "Sair da conta",
            `Olá, ${
                userName || "Usuário"
            }. Tem certeza de que deseja encerrar a sessão?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: () => logout(),
                },
            ],
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* ===============================================
                FUNDO
            ================================================ */}

            <Pressable
                style={styles.modalBackdrop}
                onPress={onClose}
            >
                {/* ===========================================
                    MENU
                ============================================ */}

                <Pressable
                    style={styles.profileMenu}
                    onPress={(event) =>
                        event.stopPropagation()
                    }
                >
                    {/* =======================================
                        USUÁRIO
                    ======================================== */}

                    <View
                        style={
                            styles.profileMenuHeader
                        }
                    >
                        <Image
                            source={{
                                uri:
                                    profilePhoto ||
                                    "https://i.pravatar.cc/150?img=11",
                            }}
                            style={
                                styles.profileMenuAvatar
                            }
                        />

                        <View
                            style={
                                styles.profileMenuIdentity
                            }
                        >
                            <Text
                                style={
                                    styles.profileMenuName
                                }
                                numberOfLines={1}
                            >
                                {userName ||
                                    "Usuário"}
                            </Text>

                            <Text
                                style={
                                    styles.profileMenuEmail
                                }
                                numberOfLines={1}
                            >
                                {userEmail ||
                                    "email não informado"}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.verifiedBadge
                            }
                        >
                            <Ionicons
                                name="checkmark"
                                size={13}
                                color={
                                    theme.colors
                                        .surface
                                }
                            />
                        </View>
                    </View>

                    <View
                        style={
                            styles.menuDivider
                        }
                    />

                    {/* =======================================
                        MEU PERFIL
                    ======================================== */}

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Meu perfil"
                        onPress={
                            handleOpenProfile
                        }
                        style={({ pressed }) => [
                            styles.profileMenuItem,

                            pressed &&
                                styles.profileMenuItemPressed,
                        ]}
                    >
                        <View
                            style={
                                styles.menuItemIcon
                            }
                        >
                            <Ionicons
                                name="person-outline"
                                size={19}
                                color={
                                    theme.colors
                                        .brand
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.menuItemContent
                            }
                        >
                            <Text
                                style={
                                    styles.menuItemTitle
                                }
                            >
                                Meu perfil
                            </Text>

                            <Text
                                style={
                                    styles.menuItemDescription
                                }
                            >
                                Dados e preferências
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={
                                theme.colors
                                    .textBody
                            }
                            style={
                                styles.menuItemArrow
                            }
                        />
                    </Pressable>

                    {/* =======================================
                        NOTIFICAÇÕES
                    ======================================== */}

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Notificações"
                        onPress={
                            handleOpenNotifications
                        }
                        style={({ pressed }) => [
                            styles.profileMenuItem,

                            pressed &&
                                styles.profileMenuItemPressed,
                        ]}
                    >
                        <View
                            style={
                                styles.menuItemIcon
                            }
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={19}
                                color={
                                    theme.colors
                                        .brand
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.menuItemContent
                            }
                        >
                            <Text
                                style={
                                    styles.menuItemTitle
                                }
                            >
                                Notificações
                            </Text>

                            <Text
                                style={
                                    styles.menuItemDescription
                                }
                            >
                                Alertas e atualizações
                            </Text>
                        </View>

                        <View
                            style={
                                styles.notificationBadge
                            }
                        >
                            <Text
                                style={
                                    styles.notificationBadgeText
                                }
                            >
                                1
                            </Text>
                        </View>
                    </Pressable>

                    <View
                        style={
                            styles.menuDivider
                        }
                    />

                    {/* =======================================
                        LOGOUT
                    ======================================== */}

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Sair da conta"
                        onPress={
                            handleLogout
                        }
                        style={({ pressed }) => [
                            styles.logoutButton,

                            pressed &&
                                styles.profileMenuItemPressed,
                        ]}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={20}
                            color={
                                theme.colors
                                    .semantic
                                    .danger
                                    .text
                            }
                        />

                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            Sair da conta
                        </Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

// ============================================================
// ESTILOS
// ============================================================

