import React, { useState } from "react";
import { Alert, ScrollView, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function JobDetailScreen({ route, navigation }) {
  const { job } = route.params || {};
  const [applied, setApplied] = useState(false);

  if (!job) return <Text style={styles.empty}>No se encontró la oferta.</Text>;

  const apply = () => {
    setApplied(true);
    Alert.alert("Postulación registrada", "Tu postulación fue guardada correctamente.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>🏢 {job.company}</Text>
      <Text style={styles.match}>🤖 {job.match}% Match IA</Text>
      <Text style={styles.section}>Información de la oferta</Text>
      <Text style={styles.text}>Área: {job.area}</Text>
      <Text style={styles.text}>Modalidad: {job.modality}</Text>
      <Text style={styles.section}>♿ Accesibilidad</Text>
      <Text style={styles.text}>{job.accessibility.join(" · ")}</Text>
      <Text style={styles.section}>¿Por qué es compatible?</Text>
      <Text style={styles.text}>Tu perfil presenta una alta compatibilidad con las características y condiciones de esta oportunidad.</Text>
      <AccessibleButton title={applied ? "✓ Postulación enviada" : "📌 Postular"} onPress={apply} disabled={applied} />
      <AccessibleButton title="Volver a empleos" type="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary, marginBottom: 8 },
  company: { fontSize: 17, color: colors.text, marginBottom: 12 },
  match: { fontSize: 20, fontWeight: "800", color: colors.success, marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "800", color: colors.secondary, marginTop: 16, marginBottom: 8 },
  text: { fontSize: 16, lineHeight: 24, color: colors.text },
  empty: { padding: 24, fontSize: 18, color: colors.text },
});