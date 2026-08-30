import React, { useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CandidateProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [modality, setModality] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi perfil profesional</Text>
      <Text style={styles.subtitle}>Completa tu perfil para mejorar tus recomendaciones y tu Match IA.</Text>

      <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} accessibilityLabel="Nombre completo" />
      <TextInput style={styles.input} placeholder="Cargo o profesión" value={professionalTitle} onChangeText={setProfessionalTitle} accessibilityLabel="Cargo o profesión" />
      <TextInput style={styles.input} placeholder="Años de experiencia" value={experience} onChangeText={setExperience} keyboardType="numeric" accessibilityLabel="Años de experiencia" />
      <TextInput style={styles.input} placeholder="Habilidades (separadas por comas)" value={skills} onChangeText={setSkills} accessibilityLabel="Habilidades" />
      <TextInput style={styles.input} placeholder="Formación académica" value={education} onChangeText={setEducation} accessibilityLabel="Formación académica" />
      <TextInput style={styles.input} placeholder="Modalidad preferida: remoto, híbrido o presencial" value={modality} onChangeText={setModality} accessibilityLabel="Modalidad laboral preferida" />

      <AccessibleButton title="📄 Gestionar mi CV" onPress={() => navigation.navigate("CV" )} />
      <AccessibleButton title="💾 Guardar perfil" type="secondary" onPress={() => navigation.navigate("CandidateDashboard")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.text, marginBottom: 18 },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
});
