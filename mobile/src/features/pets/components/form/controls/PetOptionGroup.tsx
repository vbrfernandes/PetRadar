import React from "react";

import { Pressable, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../../theme";

import { petFormStyles as styles } from "../../../styles/form/petForm.styles";

interface PetOption<Value extends string> {
    readonly value: Value;
    readonly label: string;
    readonly icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface PetOptionGroupProps<Value extends string> {
    options: readonly PetOption<Value>[];
    value: Value | "";
    onChange: (value: Value) => void;
}

export default function PetOptionGroup<Value extends string>({
    options,
    value,
    onChange,
}: PetOptionGroupProps<Value>) {
    return (
        <View style={styles.optionContainer}>
            {options.map((option) => {
                const active = value === option.value;

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        style={[
                            option.icon
                                ? styles.optionButton
                                : styles.sizeButton,
                            active && styles.optionButtonActive,
                        ]}
                    >
                        {option.icon ? (
                            <MaterialCommunityIcons
                                name={option.icon}
                                size={20}
                                color={
                                    active
                                        ? theme.colors.surface
                                        : theme.colors.brand
                                }
                            />
                        ) : null}

                        <Text
                            style={[
                                styles.optionText,
                                active && styles.optionTextActive,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
