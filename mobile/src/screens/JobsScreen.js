import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]); const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(""); const [area, setArea] = useState("Todas"); const [modality, setModality] = useState("Todas");
  useEffect(() => { fetch(`${API_URL}/company/jobs`).then(async (response) => response.ok ? response.json() : []).then(setJobs).catch(() => setJobs([])).finally(() => setLoading(false)); }, []);
  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const text = `${job.title} ${job.companyId?.name || ""} ${(job.requirements || []).join(" ")}`.toLowerCase();
    return (!keyword.trim() || text.includes(keyword.toLowerCase().trim())) && (area === "Todas" || job.area === area) && (modality === "Todas" || job.modality === modality);
  }), [jobs, keyword, area, modality]);
  const areas = ["Todas", ...new Set(jobs.map((job) => job.area).filter(Boolean))];
  const modalities = ["Todas", ...new Set(jobs.map((job) => job.modality).filter(Boolean))];
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>🔎 Buscar empleos</Text><Text style={styles.subtitle}>Oportunidades publicadas por empresas inclusivas.</Text>
    <TextInput style={styles.input} placeholder="Cargo, habilidad o empresa" value={keyword} onChangeText={setKeyword} accessibilityLabel="Buscar empleo" />
    <Text style={styles.label}>Área profesional</Text><Picker selectedValue={area} onValueChange={setArea}>{areas.map((item) => <Picker.Item key={item} label={item} value={item} />)}</Picker>
    <Text style={styles.label}>Modalidad</Text><Picker selectedValue={modality} onValueChange={setModality}>{modalities.map((item) => <Picker.Item key={item} label={item} value={item} />)}</Picker>
    {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.results}>{filteredJobs.length} oportunidades encontradas</Text>}
    {filteredJobs.map((job) => <View key={job._id} style={styles.card}><Text style={styles.jobTitle}>{job.title}</Text><Text>🏢 {job.companyId?.name || "Empresa"}</Text><Text>💼 {job.area} · 🏠 {job.modality}</Text><Text>♿ {(job.accessibility || []).join(" · ") || "Ajustes por coordinar"}</Text><AccessibleButton title="Ver oferta" onPress={() => navigation.navigate("JobDetail", { job })} /></View>)}
    {!loading && !filteredJobs.length && <Text style={styles.empty}>No encontramos ofertas con estos filtros.</Text>}
  </ScrollView>;
}
const styles = StyleSheet.create({ container: { flexGrow: 1, padding: 24, backgroundColor: colors.white }, title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 8 }, subtitle: { fontSize: 16, color: colors.text, marginBottom: 18 }, input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, fontSize: 16 }, label: { marginTop: 10, fontWeight: "700", color: colors.text }, results: { marginVertical: 16, fontWeight: "700", color: colors.secondary }, card: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 16, padding: 18, marginBottom: 16, gap: 8 }, jobTitle: { fontSize: 20, fontWeight: "800", color: colors.text }, empty: { marginTop: 20, color: colors.text } });
