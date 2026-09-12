import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders, getSessionRole } from "../config/session";

const criteriaLabels = { skills: "Habilidades", experience: "Experiencia", education: "Educación", modality: "Modalidad", accessibility: "Accesibilidad" };

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]); const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(""); const [area, setArea] = useState("Todas"); const [modality, setModality] = useState("Todas");
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const role = await getSessionRole();
        const endpoint = role === "candidate" ? `${API_URL}/profile/matches` : `${API_URL}/company/jobs`;
        const response = await fetch(endpoint, { headers: authHeaders() });
        const data = await response.json();
        setJobs(role === "candidate" ? (data.matches || []) : (response.ok ? data : []));
      } catch (error) { setJobs([]); } finally { setLoading(false); }
    };
    loadJobs();
  }, []);
  const filteredJobs = useMemo(() => jobs.filter((job) => { const text = `${job.title} ${job.companyId?.name || ""} ${(job.requirements || []).join(" ")}`.toLowerCase(); return (!keyword.trim() || text.includes(keyword.toLowerCase().trim())) && (area === "Todas" || job.area === area) && (modality === "Todas" || job.modality === modality); }), [jobs, keyword, area, modality]);
  const areas = ["Todas", ...new Set(jobs.map((job) => job.area).filter(Boolean))]; const modalities = ["Todas", ...new Set(jobs.map((job) => job.modality).filter(Boolean))];
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>🔎 Buscar empleos</Text><Text style={styles.subtitle}>Oportunidades publicadas por empresas inclusivas.</Text><TextInput style={styles.input} placeholder="Cargo, habilidad o empresa" value={keyword} onChangeText={setKeyword} accessibilityLabel="Buscar empleo" /><Text style={styles.label}>Área profesional</Text><Picker selectedValue={area} onValueChange={setArea}>{areas.map((item) => <Picker.Item key={item} label={item} value={item} />)}</Picker><Text style={styles.label}>Modalidad</Text><Picker selectedValue={modality} onValueChange={setModality}>{modalities.map((item) => <Picker.Item key={item} label={item} value={item} />)}</Picker>{loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.results}>{filteredJobs.length} oportunidades encontradas</Text>}{filteredJobs.map((job) => <View key={job._id} style={styles.card}><View style={styles.header}><Text style={styles.jobTitle}>{job.title}</Text>{job.score !== undefined && <Text style={styles.match}>{job.score}%</Text>}</View><Text>🏢 {job.companyId?.name || "Empresa"}</Text><Text>💼 {job.area} · 🏠 {job.modality}</Text><Text>♿ {(job.accessibility || []).join(" · ") || "Ajustes por coordinar"}</Text>{job.score !== undefined && <><Text style={styles.sectionTitle}>Desglose del Match</Text>{Object.entries(job.breakdown || {}).map(([key, value]) => <Text key={key} style={styles.breakdown}>• {criteriaLabels[key] || key}: {value}%</Text>)}<Text style={styles.sectionTitle}>Coincidencias</Text><Text>✓ Habilidades: {(job.matchedSkills || []).join(" · ") || "Ninguna"}</Text>{job.missingSkills?.length > 0 && <Text>⚠️ Habilidades faltantes: {job.missingSkills.join(" · ")}</Text>}{job.matchedAccessibility?.length > 0 && <Text>✓ Accesibilidad: {job.matchedAccessibility.join(" · ")}</Text>}{job.missingAccessibility?.length > 0 && <Text>⚠️ Accesibilidad pendiente: {job.missingAccessibility.join(" · ")}</Text>}</>}<AccessibleButton title="Ver oferta" onPress={() => navigation.navigate("JobDetail", { job })} /></View>)}{!loading && !filteredJobs.length && <Text style={styles.empty}>No encontramos ofertas con estos filtros.</Text>}</ScrollView>;
}
const styles = StyleSheet.create({ container: { flexGrow: 1, padding: 24, backgroundColor: colors.white }, title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 8 }, subtitle: { fontSize: 16, color: colors.text, marginBottom: 18 }, input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, fontSize: 16 }, label: { marginTop: 10, fontWeight: "700", color: colors.text }, results: { marginVertical: 16, fontWeight: "700", color: colors.secondary }, card: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 16, padding: 18, marginBottom: 16, gap: 8 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, jobTitle: { flex: 1, fontSize: 20, fontWeight: "800", color: colors.text }, match: { fontSize: 24, fontWeight: "800", color: colors.secondary }, sectionTitle: { marginTop: 8, fontWeight: "800", color: colors.primary }, breakdown: { fontSize: 15 }, empty: { marginTop: 20, color: colors.text } });
