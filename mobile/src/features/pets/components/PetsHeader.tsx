import React from "react";

import { Text, View } from "react-native";

import { petsTabStyles as styles } from "../styles/petsTab.styles";

interface PetsHeaderProps {
    count: number;
}

export default function PetsHeader({ count }: PetsHeaderProps) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Meus pets</Text>
                <Text style={styles.subtitle}>
                    Pets vinculados à sua conta.
                </Text>
            </View>

            <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
            </View>
        </View>
    );
}
