import React from "react";

import { Text, View } from "react-native";

import { petDetailStyles as styles } from "../../styles/detail/petDetail.styles";

interface PetDetailRowProps {
    label: string;
    value: string;
}

export default function PetDetailRow({ label, value }: PetDetailRowProps) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}
