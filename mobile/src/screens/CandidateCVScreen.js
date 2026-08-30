import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CandidateCVScreen({ route, navigation }) {
  const { candidate } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📄 Revisión de CV</Text>
      <Text style={styles.name}>{candidate?.name || "Candidato"}</Text>
      <Text style={styles.match}>🤖 {candidate?.match || 0}% Match IA</Text>
      <Text style={styles.section}>Perfil profesional</Text>
      <Text style={styles.text}>Experiencia, habilidades y compatibilidad disponibles para revisión de la empresa.</Text>
      <Text style={styles.section}>Estado</Text>
      <Text style={styles.text}>{candidate?.status || "Postulado"}</Text>
      <AccessibleButton title="Aceptar candidato" onPress={() => {}} />
      <AccessibleButton title="Volver" type="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary },
  name: { fontSize: 20, fontWeight: "700", marginTop: 16 },
  match: { fontSize: 20, fontWeight: "800", color: colors.success, marginTop: 10 },
  section: { fontSize: 18, fontWeight: "800", color: colors.secondary, marginTop: 24 },
  text: { fontSize: 16, lineHeight: 24, color: colors.text, marginTop: 8 },
});