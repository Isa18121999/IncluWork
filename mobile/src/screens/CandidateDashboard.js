import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders, clearSessionToken } from "../config/session";

export default function CandidateDashboard({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_URL}/profile/matches`, { headers: authHeaders() })
      .then(async (response) => response.ok ? response.json() : { matches: [] })
      .then((data) => setMatches((data.matches || []).slice(0, 3)))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);
  const handleLogout = async () => { await clearSessionToken(); navigation.replace("Welcome"); };
  const confirmLogout = () => Alert.alert("Cerrar sesión", "¿Quieres cerrar tu sesión?", [{ text: "Cancelar", style: "cancel" }, { text: "Cerrar sesión", style: "destructive", onPress: handleLogout }]);
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Hola 👋</Text><Text style={styles.status}>Perfil verificado 🟢</Text>
    <View style={styles.matchCard}><Text style={styles.matchTitle}>Tus mejores coincidencias</Text>
      {loading ? <ActivityIndicator color={colors.primary} /> : matches.length ? matches.map((job) => <View key={job._id} style={styles.matchRow}><View style={styles.matchInfo}><Text style={styles.jobTitle}>{job.title}</Text><Text>{job.companyId?.name || "Empresa"}</Text></View><Text style={styles.match}>{job.score}%</Text></View>) : <Text style={styles.caption}>Completa tus habilidades para encontrar coincidencias.</Text>}
    </View>
    <AccessibleButton title="🔎 Buscar empleos" onPress={() => navigation.navigate("Jobs")} />
    <AccessibleButton title="📄 Mis postulaciones" type="secondary" onPress={() => navigation.navigate("Applications")} />
    <AccessibleButton title="👤 Editar mi perfil" onPress={() => navigation.navigate("CandidateProfile")} />
    <AccessibleButton title="🚪 Cerrar sesión" type="secondary" onPress={confirmLogout} />
  </ScrollView>;
}
const styles = StyleSheet.create({ container: { flexGrow: 1, padding: 24, backgroundColor: colors.white }, title: { fontSize: 30, fontWeight: "800", color: colors.primary }, status: { marginTop: 8, fontSize: 17, color: colors.success }, matchCard: { marginTop: 24, padding: 20, borderRadius: 16, backgroundColor: colors.background }, matchTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 12 }, matchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#CBD5E1" }, matchInfo: { flex: 1, paddingRight: 12 }, jobTitle: { fontSize: 16, fontWeight: "700", color: colors.text }, match: { fontSize: 28, fontWeight: "800", color: colors.secondary }, caption: { color: colors.text } });
