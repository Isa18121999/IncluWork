import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CompanyDashboardScreen({ navigation }) {
  const candidates = [
    { name: "Candidato recomendado", match: 94, status: "Postulado" },
    { name: "Perfil compatible", match: 87, status: "CV visto" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏢 Panel Empresa</Text>
      <Text style={styles.subtitle}>Gestiona ofertas y encuentra talento inclusivo.</Text>

      <AccessibleButton title="📌 Publicar oferta" onPress={() => {}} />

      <Text style={styles.section}>🤖 Candidatos recomendados por IA</Text>

      {candidates.map((candidate, index) => (
        <View key={index} style={styles.card} accessible>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.match}>🤖 {candidate.match}% Match IA</Text>
          <Text>{candidate.status}</Text>
          <AccessibleButton title="Ver CV" onPress={() => {}} />
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
});