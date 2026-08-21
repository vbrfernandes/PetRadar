import React, { useState } from "react";

import { FlatList, View } from "react-native";

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import type { AppTabParamList } from "../../../app/navigation/types/appNavigation.types";

import { usePets } from "../hooks/usePets";
import { petsTabStyles as styles } from "../styles/petsTab.styles";
import type { Pet } from "../types/pet.types";
import { petToOccurrencePrefill } from "../utils/petMappers";
import PetCard from "./card/PetCard";
import PetDetailModal from "./detail/PetDetailModal";
import PetFormModal from "./form/PetFormModal";
import PetsAddButton from "./PetsAddButton";
import PetsHeader from "./PetsHeader";
import PetsEmptyState from "./states/PetsEmptyState";
import PetsLoadingState from "./states/PetsLoadingState";

export default function PetsTab() {
    const navigation =
        useNavigation<BottomTabNavigationProp<AppTabParamList>>();

    const { pets, loading, adicionarPetCriado } = usePets();

    const [formVisible, setFormVisible] = useState(false);
    const [petSelecionado, setPetSelecionado] = useState<Pet | null>(null);

    if (loading) {
        return <PetsLoadingState />;
    }

    const informarComoPerdido = (pet: Pet) => {
        setPetSelecionado(null);

        navigation.navigate("CadastroOcorrencia", {
            pet: petToOccurrencePrefill(pet),
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={pets}
                keyExtractor={(item) => String(item.id_pet)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        <PetsHeader count={pets.length} />
                        <PetsAddButton
                            onPress={() => setFormVisible(true)}
                        />
                    </>
                }
                ListEmptyComponent={<PetsEmptyState />}
                renderItem={({ item }) => (
                    <PetCard
                        pet={item}
                        onPress={() => setPetSelecionado(item)}
                    />
                )}
            />

            <PetFormModal
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                onPetCreated={adicionarPetCriado}
            />

            <PetDetailModal
                pet={petSelecionado}
                onClose={() => setPetSelecionado(null)}
                onReportLost={informarComoPerdido}
            />
        </View>
    );
}
