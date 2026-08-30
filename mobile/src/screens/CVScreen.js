import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CVScreen() {
  const [cvName, setCvName] = useState("");

  const uploadCV = () => setCvName("CV pendiente de selección");
  const updateCV = () => setCvName("Nueva versión del CV pendiente de selección");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Mi CV</Text>
      <Text style={styles.subtitle}>
        Sube o actualiza tu CV para que las empresas puedan conocer tu experiencia.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>CV actual</Text>
        <Text>{cvName || "No tienes un CV cargado todavía."}</Text>
      </View>

      <AccessibleButton title="📤 Subir CV" onPress={uploadCV} />
      <AccessibleButton title="🔄 Actualizar CV" type="secondary" onPress={updateCV} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary },
  subtitle: { marginTop: 12, fontSize: 16, lineHeight: 23, color: colors.text },
  card: { marginTop: 24, padding: 20, borderRadius: 16, backgroundColor: colors.background },
  cardTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 8 },
});
