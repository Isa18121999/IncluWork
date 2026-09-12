import React, { useState } from "react";
import { Alert, ScrollView, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { authHeaders } from "../config/session";
import { colors } from "../theme/colors";
export default function JobDetailScreen({ route, navigation }) {
  const { job } = route.params || {}; const [applied, setApplied] = useState(false); const [loading, setLoading] = useState(false);
  if (!job) return <Text style={styles.empty}>No se encontró la oferta.</Text>;
  const apply = async () => { setLoading(true); try { const response = await fetch(`${API_URL}/applications`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ jobId: job._id }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "No se pudo registrar la postulación"); setApplied(true); Alert.alert("Postulación registrada", "Tu postulación fue guardada correctamente."); } catch (error) { Alert.alert("Error", error.message); } finally { setLoading(false); } };
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>{job.title}</Text><Text style={styles.company}>🏢 {job.companyId?.name || "Empresa"}</Text><Text style={styles.section}>Información de la oferta</Text><Text style={styles.text}>Área: {job.area}</Text><Text style={styles.text}>Modalidad: {job.modality}</Text><Text style={styles.section}>Requisitos</Text><Text style={styles.text}>{(job.requirements || []).join(" · ") || "No especificados"}</Text><Text style={styles.section}>♿ Accesibilidad</Text><Text style={styles.text}>{(job.accessibility || []).join(" · ") || "A coordinar"}</Text><AccessibleButton title={applied ? "✓ Postulación enviada" : loading ? "Enviando..." : "📌 Postular"} onPress={apply} disabled={applied || loading} /><AccessibleButton title="Volver a empleos" type="secondary" onPress={() => navigation.goBack()} /></ScrollView>;
}
const styles = StyleSheet.create({ container: { flexGrow: 1, padding: 24, backgroundColor: colors.white }, title: { fontSize: 30, fontWeight: "800", color: colors.primary, marginBottom: 8 }, company: { fontSize: 17, color: colors.text }, section: { fontSize: 18, fontWeight: "800", color: colors.secondary, marginTop: 20, marginBottom: 8 }, text: { fontSize: 16, lineHeight: 24, color: colors.text }, empty: { padding: 24 } });
