import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { authHeaders } from "../config/session";
import { colors } from "../theme/colors";

export default function ApplicationsScreen({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`${API_URL}/applications`, { headers: authHeaders() });
      if (!res.ok) throw new Error("No se pudieron obtener las postulaciones");
      setApplications(await res.json());
    } catch (error) {
      if (!isRefresh) setApplications([]);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadApplications();
  }, [loadApplications]));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadApplications(true)} />}
    >
      <Text style={styles.title} accessibilityRole="header">Mis postulaciones</Text>
      {loading && <ActivityIndicator color={colors.primary} />}

      {applications.map((application) => (
        <View key={application._id} style={styles.card} accessible accessibilityLabel={`${application.jobId?.title || "Oferta"}, ${application.jobId?.companyId?.name || "Empresa"}, Match integral ${Number(application.matchScore ?? 0)}%, estado ${application.status || "Postulado"}`}>
          <Text style={styles.job}>{application.jobId?.title || "Oferta"}</Text>
          <Text style={styles.company}>{application.jobId?.companyId?.name || "Empresa"}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Match integral</Text>
            <Text style={styles.match}>{Number(application.matchScore ?? 0)}%</Text>
          </View>
          {application.matchBreakdown && Object.keys(application.matchBreakdown).length > 0 && (\n            <View style={styles.breakdownBox}>\n              <Text style={styles.breakdownTitle}>Desglose del match</Text>\n              {Object.entries(application.matchBreakdown).map(([key, value]) => (\n                <Text key={key} style={styles.breakdown}>• {({ skills: "Habilidades", experience: "Experiencia", education: "Educación", modality: "Modalidad", accessibility: "Accesibilidad" })[key] || key}: {value}%</Text>\n              ))}\n            </View>\n          )}\n          {application.missingSkills?.length > 0 && (\n            <Text style={styles.warning}>⚠️ Habilidades faltantes: {application.missingSkills.join(" · ")}</Text>\n          )}\n          <View style={styles.statusBox}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.status}>{application.status || "Postulado"}</Text>
          </View>
          {application.createdAt && (
            <Text style={styles.date}>
              Postulado: {new Date(application.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      ))}

      {!loading && !applications.length && <Text style={styles.empty}>Aún no tienes postulaciones.</Text>}
      <AccessibleButton title="Buscar empleos" onPress={() => navigation.navigate("Jobs")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 20 },
  card: { padding: 16, borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, marginBottom: 12 },
  job: { fontWeight: "800", fontSize: 18 },
  company: { marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  label: { fontWeight: "700" },
  match: { fontSize: 20, fontWeight: "800", color: colors.primary },
  breakdownBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E2E8F0" },\n  breakdownTitle: { fontWeight: "800", marginBottom: 4 },\n  breakdown: { marginTop: 2, color: "#334155" },\n  warning: { marginTop: 8, color: "#92400E" },\n  statusBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E2E8F0" },
  status: { color: colors.secondary, marginTop: 4, fontWeight: "700" },
  date: { marginTop: 10, color: "#64748B", fontSize: 13 },
  empty: { marginBottom: 16 }
});
