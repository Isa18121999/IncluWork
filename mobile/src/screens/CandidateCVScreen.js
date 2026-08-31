import React, { useState } from "react";
import { Alert, ScrollView, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3000/api/applications";

export default function CandidateCVScreen({ route, navigation }) {
  const { candidate } = route.params || {};
  const [status, setStatus] = useState(candidate?.status || "Postulado");

  const updateStatus = async (newStatus) => {
    setStatus(newStatus);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate?.id,
          status: newStatus
        })
      });
      Alert.alert("Actualizado", `Estado: ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📄 Revisión de CV</Text>
      <Text style={styles.name}>{candidate?.name || "Candidato"}</Text>
      <Text style={styles.match}>🤖 {candidate?.score || candidate?.match || 0}% Match IA</Text>
      <Text style={styles.section}>Perfil profesional</Text>
      <Text style={styles.text}>{candidate?.professionalTitle || "Perfil profesional"}</Text>
      <Text style={styles.section}>Habilidades</Text>
      <Text style={styles.text}>{candidate?.skills?.join(" · ") || "Habilidades no disponibles"}</Text>
      <Text style={styles.section}>Estado</Text>
      <Text style={styles.text}>{status}</Text>
      <AccessibleButton title="Aceptar candidato" onPress={() => updateStatus("Aceptado")} />
      <AccessibleButton title="Rechazar candidato" onPress={() => updateStatus("Rechazado")} />
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