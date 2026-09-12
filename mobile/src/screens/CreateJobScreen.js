import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders } from "../config/session";

const JOBS_URL = `${API_URL}/company/jobs`;

export default function CreateJobScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [modality, setModality] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [educationRequired, setEducationRequired] = useState("");
  const [requirements, setRequirements] = useState("");
  const [accessibility, setAccessibility] = useState("");

  const publishJob = async () => {
    if (!title.trim()) {
      Alert.alert("Datos incompletos", "Ingresa el cargo de la oferta.");
      return;
    }

    try {
      const response = await fetch(JOBS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title: title.trim(),
          area: area.trim(),
          modality: modality.trim(),
          experienceRequired: Number(experienceRequired) || 0,
          educationRequired: educationRequired.trim(),
          requirements: requirements.split(",").map(item => item.trim()).filter(Boolean),
          accessibility: accessibility.split(",").map(item => item.trim()).filter(Boolean)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo publicar la oferta");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo conectar con el servidor.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📌 Publicar oferta laboral</Text>
      <TextInput style={styles.input} placeholder="Cargo" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Área profesional" value={area} onChangeText={setArea} />
      <TextInput style={styles.input} placeholder="Modalidad: remoto, híbrido o presencial" value={modality} onChangeText={setModality} />
      <TextInput style={styles.input} placeholder="Experiencia mínima en años" value={experienceRequired} onChangeText={setExperienceRequired} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Formación académica requerida" value={educationRequired} onChangeText={setEducationRequired} />
      <TextInput style={styles.input} placeholder="Requisitos / habilidades separados por coma" value={requirements} onChangeText={setRequirements} />
      <TextInput style={styles.input} placeholder="Accesibilidad requerida, separada por coma" value={accessibility} onChangeText={setAccessibility} />
      <AccessibleButton title="Publicar oferta" onPress={publishJob} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 26, fontWeight: "800", color: colors.primary },
  input: { borderWidth: 1, borderColor: "#CBD5E1", padding: 14, borderRadius: 12, marginTop: 16 }
});
