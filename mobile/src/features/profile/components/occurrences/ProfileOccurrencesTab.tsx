import React from "react";

import { FlatList, RefreshControl, Text, View } from "react-native";

import { theme } from "../../../../theme/colors";

import type { OcorrenciaResumo } from "../../../occurrences/types/occurrence.types";
import { profileOccurrencesStyles as styles } from "../../styles/occurrences/profileOccurrences.styles";
import { profileCommonStyles as commonStyles } from "../../styles/profileCommon.styles";
import ProfileOccurrenceCard from "./ProfileOccurrenceCard";
import ProfileOccurrencesEmptyState from "./ProfileOccurrencesEmptyState";

interface ProfileOccurrencesTabProps {
  occurrences: OcorrenciaResumo[];
  refreshing: boolean;
  onRefresh: () => void;
  onOccurrencePress: (occurrenceId: number) => void;
}

export default function ProfileOccurrencesTab({
  occurrences,
  refreshing,
  onRefresh,
  onOccurrencePress,
}: ProfileOccurrencesTabProps) {
  return (
    <FlatList
      data={occurrences}
      keyExtractor={(item) => String(item.id_ocorrencia)}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.brand}
          colors={[theme.colors.brand]}
        />
      }
      ListHeaderComponent={
        <View style={styles.occurrencesHeader}>
          <View>
            <Text style={commonStyles.sectionTitle}>Minhas ocorrências</Text>
            <Text style={commonStyles.sectionSubtitle}>
              Registros relacionados à sua conta.
            </Text>
          </View>
          <View style={styles.occurrenceCountBadge}>
            <Text style={styles.occurrenceCountText}>
              {occurrences.length}
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={<ProfileOccurrencesEmptyState />}
      renderItem={({ item }) => (
        <ProfileOccurrenceCard item={item} onPress={onOccurrencePress} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
