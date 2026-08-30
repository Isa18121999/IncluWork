import React, { useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CreateJobScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📌 Publicar oferta laboral</Text>
      <TextInput style={styles.input} placeholder="Cargo" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Requisitos y habilidades" value={requirements} onChangeText={setRequirements} />
      <AccessibleButton title="Publicar oferta" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 26, fontWeight: "800", color: colors.primary },
  input: { borderWidth: 1, borderColor: "#CBD5E1", padding: 14, borderRadius: 12, marginTop: 16 }
});