import React from "react";
import { Text, View } from "react-native";


import {
  occurrenceFormSectionStyles as styles,
} from "../../../styles/form/occurrenceFormSections.styles";

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

