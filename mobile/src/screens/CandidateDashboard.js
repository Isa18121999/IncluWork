import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CandidateDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola 👋</Text>
      <Text style={styles.status}>Perfil verificado 🟢</Text>
      <View style={styles.matchCard}>
        <Text style={styles.matchTitle}>Matching IA</Text>
        <Text style={styles.match}>89%</Text>
        <Text style={styles.caption}>Compatibilidad promedio laboral</Text>
      </View>
      <AccessibleButton title="🔎 Buscar empleos" onPress={() => navigation.navigate("Jobs")} />
      <AccessibleButton title="📄 Mis postulaciones" type="secondary" onPress={() => navigation.navigate("Applications")} />
      <AccessibleButton title="💬 Mensajes" onPress={() => navigation.navigate("Chat")} />
      <AccessibleButton title="♿ Accesibilidad" onPress={() => navigation.navigate("Accessibility")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary },
  status: { marginTop: 8, fontSize: 17, color: colors.success },
  matchCard: { marginTop: 24, padding: 20, borderRadius: 16, backgroundColor: colors.background, alignItems: "center" },
  matchTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  match: { fontSize: 52, fontWeight: "800", color: colors.secondary, marginTop: 4 },
  caption: { color: colors.text }
});
