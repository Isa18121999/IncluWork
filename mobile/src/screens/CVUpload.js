import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CVUpload({ navigation }) {
  const [cvName, setCvName] = useState("");

  const chooseCV = () => {
    // Integrar aquí Document Picker y el endpoint real de subida.
    setCvName("CV seleccionado — listo para subir");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Mi CV</Text>
      <Text style={styles.description}>
        Sube tu CV profesional y mantenlo actualizado para mejorar tu perfil y Match IA.
      </Text>

      {cvName ? <Text style={styles.file}>{cvName}</Text> : <Text style={styles.empty}>No tienes un CV cargado.</Text>}

      <AccessibleButton title="📤 Subir CV" onPress={chooseCV} />
      <AccessibleButton title="🔄 Actualizar CV" type="secondary" onPress={chooseCV} />
      <AccessibleButton title="Volver a mi perfil" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary, marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: colors.text, marginBottom: 20 },
  empty: { fontSize: 16, color: colors.text, marginBottom: 20 },
  file: { fontSize: 16, fontWeight: "700", color: colors.success, marginBottom: 20 },
});
