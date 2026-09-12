import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders } from "../config/session";

const CRITERIA_LABELS = {
  skills: "Habilidades",
  experience: "Experiencia",
  education: "Educación",
  modality: "Modalidad",
  accessibility: "Accesibilidad"
};

const STATUS_OPTIONS = ["CV visto", "Aceptado", "Rechazado"];

export default function CompanyDashboardScreen({ navigation }) {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await fetch(`${API_URL}/company/my-jobs`, { headers: authHeaders() });
      const data = await response.json();
      const firstJob = data[0];
      if (!firstJob?._id) return setCandidates([]);
      const candidatesResponse = await fetch(`${API_URL}/company/candidates/${firstJob._id}`, { headers: authHeaders() });
      const candidatesData = await candidatesResponse.json();
      setCandidates(candidatesResponse.ok ? candidatesData.candidates || [] : []);
    } catch (error) {
      setCandidates([]);
    }
  };

  const updateStatus = async (candidate, status) => {
    if (!candidate.applicationId) {
      Alert.alert("Sin postulación", "Este candidato todavía no tiene una postulación registrada para esta oferta.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/applications/${candidate.applicationId}/status`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo actualizar el estado");

      setCandidates((current) => current.map((item) =>
        item.applicationId === candidate.applicationId ? { ...item, status: data.status } : item
      ));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmStatus = (candidate, status) => {
    const action = status === "CV visto" ? "marcar esta postulación como CV visto" : status === "Aceptado" ? "aceptar esta postulación" : "rechazar esta postulación";
    Alert.alert("Cambiar estado", `¿Quieres ${action}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: () => updateStatus(candidate, status) }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏢 Panel Empresa</Text>
      <Text style={styles.subtitle}>Gestiona ofertas y encuentra talento inclusivo.</Text>

      <AccessibleButton title="📌 Publicar oferta" onPress={() => navigation.navigate("CreateJob")} />

      <Text style={styles.section}>🤖 Candidatos recomendados por IA</Text>

      {candidates.map((candidate) => (
        <View key={candidate._id || candidate.applicationId || candidate.name} style={styles.card} accessible accessibilityLabel={`${candidate.name}, ${candidate.score}% Match integral, estado ${candidate.status}`}>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.match}>🤖 {candidate.score}% Match integral</Text>

          <Text style={styles.subsection}>Desglose del Match</Text>
          {Object.entries(candidate.breakdown || {}).map(([key, value]) => (
            <Text key={key} style={styles.detail}>{CRITERIA_LABELS[key] || key}: {value}%</Text>
          ))}

          <Text style={styles.subsection}>Habilidades</Text>
          <Text>Coinciden: {candidate.matchedSkills?.length ? candidate.matchedSkills.join(" · ") : "Ninguna"}</Text>
          <Text>Faltan: {candidate.missingSkills?.length ? candidate.missingSkills.join(" · ") : "Ninguna"}</Text>

          <Text style={styles.subsection}>Accesibilidad</Text>
          <Text>Coinciden: {candidate.matchedAccessibility?.length ? candidate.matchedAccessibility.join(" · ") : "Ninguna"}</Text>
          <Text>Faltan: {candidate.missingAccessibility?.length ? candidate.missingAccessibility.join(" · ") : "Ninguna"}</Text>

          <Text style={styles.status}>Estado: {candidate.status}</Text>
          <AccessibleButton title="Ver CV" onPress={() => navigation.navigate("CandidateCV", { candidate })} />

          {candidate.applicationId && candidate.status !== "Rechazado" && (
            <View style={styles.actions}>
              {STATUS_OPTIONS.filter((status) => status !== candidate.status).map((status) => (
                <AccessibleButton
                  key={status}
                  title={status === "CV visto" ? "👁 Marcar CV visto" : status === "Aceptado" ? "✅ Aceptar" : "❌ Rechazar"}
                  type="secondary"
                  onPress={() => confirmStatus(candidate, status)}
                />
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary },
  subtitle: { marginVertical: 12, color: colors.text },
  section: { marginTop: 24, fontSize: 20, fontWeight: "800", color: colors.secondary },
  card: { marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 16 },
  name: { fontSize: 18, fontWeight: "700" },
  match: { marginVertical: 8, fontWeight: "800", color: colors.success },
  subsection: { marginTop: 12, marginBottom: 4, fontWeight: "800" },
  detail: { marginTop: 2 },
  status: { marginTop: 12, fontWeight: "700" },
  actions: { marginTop: 8 }
});
