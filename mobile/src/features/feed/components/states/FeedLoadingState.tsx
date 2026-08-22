import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../../../../theme";
import { feedScreenStyles } from "../../styles/feedScreen.styles";
import { feedStatesStyles as styles } from "../../styles/feedStates.styles";

export default function FeedLoadingState() {
  return (
    <SafeAreaView style={feedScreenStyles.container}>
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <MaterialCommunityIcons
            name="paw"
            size={35}
            color={theme.colors.brand}
          />
        </View>
        <ActivityIndicator size="small" color={theme.colors.brand} />
        <Text style={styles.stateTitle}>Buscando ocorrências</Text>
        <Text style={styles.stateDescription}>
          Estamos procurando animais próximos da sua localização.
        </Text>
      </View>
    </SafeAreaView>
  );
}
