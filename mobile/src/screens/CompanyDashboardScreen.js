import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3000/api/company/candidates/demo";

export default function CompanyDashboardScreen({ navigation }) {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      setCandidates([]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏢 Panel Empresa</Text>
      <Text style={styles.subtitle}>Gestiona ofertas y encuentra talento inclusivo.</Text>

      <AccessibleButton title="📌 Publicar oferta" onPress={() => navigation.navigate("CreateJob")} />

      <Text style={styles.section}>🤖 Candidatos recomendados por IA</Text>

      {candidates.map((candidate, index) => (
        <View key={index} style={styles.card} accessible accessibilityLabel={`${candidate.name}, ${candidate.match}% Match IA`}>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.match}>🤖 {candidate.match}% Match IA</Text>
          <Text>🧠 {candidate.skills?.join(" · ")}</Text>
          <Text>{candidate.status}</Text>
          <AccessibleButton title="Ver CV" onPress={() => navigation.navigate("CandidateCV", { candidate })} />
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