import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders } from "../config/session";

const JOBS_URL = `${API_URL}/company/jobs`;
const MODALITIES = ["remoto", "híbrido", "hibrido", "presencial"];

export default function CreateJobScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [modality, setModality] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [educationRequired, setEducationRequired] = useState("");
  const [requirements, setRequirements] = useState("");
  const [accessibility, setAccessibility] = useState("");

  const publishJob = async () => {
    const normalizedTitle = title.trim();
    const normalizedArea = area.trim();
    const normalizedModality = modality.trim().toLowerCase();
    const experience = Number(experienceRequired);
    const requirementList = requirements.split(",").map((item) => item.trim()).filter(Boolean);
    const accessibilityList = accessibility.split(",").map((item) => item.trim()).filter(Boolean);

    if (normalizedTitle.length < 2 || normalizedTitle.length > 300) {
      Alert.alert("Cargo no válido", "El cargo debe tener entre 2 y 300 caracteres.");
      return;
    }
    if (normalizedArea.length < 2 || normalizedArea.length > 300) {
      Alert.alert("Área no válida", "El área profesional debe tener entre 2 y 300 caracteres.");
      return;
    }
    if (!MODALITIES.includes(normalizedModality)) {
      Alert.alert("Modalidad no válida", "Selecciona remoto, híbrido o presencial.");
      return;
    }
    if (!Number.isFinite(experience) || experience < 0 || experience > 60) {
      Alert.alert("Experiencia no válida", "Ingresa un número entre 0 y 60 años.");
      return;
    }
    if (educationRequired.trim().length > 300) {
      Alert.alert("Formación no válida", "La formación requerida no puede superar 300 caracteres.");
      return;
    }
    if (requirementList.length > 30 || requirementList.some((item) => item.length > 100)) {
      Alert.alert("Requisitos no válidos", "Puedes registrar hasta 30 requisitos de máximo 100 caracteres.");
      return;
    }
    if (accessibilityList.length > 30 || accessibilityList.some((item) => item.length > 100)) {
      Alert.alert("Accesibilidad no válida", "Puedes registrar hasta 30 requisitos de máximo 100 caracteres.");
      return;
    }

    try {
      const response = await fetch(JOBS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ title: normalizedTitle, area: normalizedArea, modality: normalizedModality, experienceRequired: experience, educationRequired: educationRequired.trim(), requirements: requirementList, accessibility: accessibilityList })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo publicar la oferta");
      Alert.alert("Oferta publicada", "La oferta laboral fue creada correctamente.", [{ text: "Continuar", onPress: () => navigation.goBack() }]);
    } catch (error) { Alert.alert("Error", error.message || "No se pudo conectar con el servidor."); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📌 Publicar oferta laboral</Text>
      <TextInput style={styles.input} placeholder="Cargo" value={title} onChangeText={setTitle} maxLength={300} />
      <TextInput style={styles.input} placeholder="Área profesional" value={area} onChangeText={setArea} maxLength={300} />
      <TextInput style={styles.input} placeholder="Modalidad: remoto, híbrido o presencial" value={modality} onChangeText={setModality} maxLength={20} />
      <TextInput style={styles.input} placeholder="Experiencia mínima en años" value={experienceRequired} onChangeText={(value) => setExperienceRequired(value.replace(/[^0-9]/g, ""))} keyboardType="numeric" maxLength={2} />
      <TextInput style={styles.input} placeholder="Formación académica requerida" value={educationRequired} onChangeText={setEducationRequired} maxLength={300} />
      <TextInput style={styles.input} placeholder="Requisitos / habilidades separados por coma" value={requirements} onChangeText={setRequirements} maxLength={3000} multiline />
      <TextInput style={styles.input} placeholder="Accesibilidad requerida, separada por coma" value={accessibility} onChangeText={setAccessibility} maxLength={3000} multiline />
      <AccessibleButton title="Publicar oferta" onPress={publishJob} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 26, fontWeight: "800", color: colors.primary },
  input: { borderWidth: 1, borderColor: "#CBD5E1", padding: 14, borderRadius: 12, marginTop: 16 }
});
