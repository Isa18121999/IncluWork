import React, { useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3000/api/company/jobs";

export default function CreateJobScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [modality, setModality] = useState("");
  const [requirements, setRequirements] = useState("");

  const publishJob = async () => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        area,
        modality,
        requirements: requirements.split(",").map(item => item.trim()),
        accessibility: ["Ajustes inclusivos"]
      })
    });

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📌 Publicar oferta laboral</Text>
      <TextInput style={styles.input} placeholder="Cargo" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Área profesional" value={area} onChangeText={setArea} />
      <TextInput style={styles.input} placeholder="Modalidad" value={modality} onChangeText={setModality} />
      <TextInput style={styles.input} placeholder="Requisitos separados por coma" value={requirements} onChangeText={setRequirements} />
      <AccessibleButton title="Publicar oferta" onPress={publishJob} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 26, fontWeight: "800", color: colors.primary },
  input: { borderWidth: 1, borderColor: "#CBD5E1", padding: 14, borderRadius: 12, marginTop: 16 }
});