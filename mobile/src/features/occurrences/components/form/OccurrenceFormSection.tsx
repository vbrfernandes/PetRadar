import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../../../../theme/colors";

interface OccurrenceFormSectionProps {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function OccurrenceFormSection({
  number,
  title,
  subtitle,
  children,
}: OccurrenceFormSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionNumber}>
          <Text style={styles.sectionNumberText}>{number}</Text>
        </View>

        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionTitle}>{title}</Text>

          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(31, 92, 77, 0.06)",
    ...theme.shadows.elevation1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(31, 92, 77, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sectionNumberText: {
    color: theme.colors.brand,
    fontSize: 13,
    fontWeight: "800",
  },

  sectionHeaderContent: {
    flex: 1,
  },

  sectionTitle: {
    color: theme.colors.textTitle,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    color: theme.colors.textBody,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});
