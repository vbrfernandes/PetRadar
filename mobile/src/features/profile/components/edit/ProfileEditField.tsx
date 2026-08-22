import React from "react";

import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../../theme";

import { profileEditStyles as styles } from "../../styles/edit/profileEdit.styles";

interface ProfileEditFieldProps
  extends Pick<
    TextInputProps,
    | "accessibilityLabel"
    | "autoCapitalize"
    | "keyboardType"
    | "maxLength"
    | "multiline"
    | "numberOfLines"
    | "textAlignVertical"
  > {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  suffix?: string;
  helper?: string;
}

export default function ProfileEditField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  suffix,
  helper,
  multiline,
  ...inputProps
}: ProfileEditFieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={theme.colors.brand}
          style={multiline ? styles.multilineIcon : undefined}
        />
        <TextInput
          {...inputProps}
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          multiline={multiline}
        />
        {suffix ? <Text style={styles.inputSuffix}>{suffix}</Text> : null}
      </View>
      {helper ? <Text style={styles.helperText}>{helper}</Text> : null}
    </View>
  );
}
