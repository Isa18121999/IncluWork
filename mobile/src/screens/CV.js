import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function CVScreen() {
  const [cv, setCv] = useState(null);

  const selectCV = () => {
    // Integrar Document Picker y almacenamiento seguro en la siguiente etapa.
    setCv({ name: "CV pendiente de selección", version: 1 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Mi CV</Text>
      <Text style={styles.description}>
        Sube tu CV para que puedas actualizarlo y utilizarlo en tus postulaciones y análisis de compatibilidad.
      </Text>

      {cv ? (
        <View style={styles.card}>
          <Text style={styles.file}>{cv.name}</Text>
          <Text>Versión {cv.version}</Text>
          <AccessibleButton title="🔄 Actualizar CV" onPress={selectCV} />
        </View>
      ) : (
        <AccessibleButton title="📤 Subir CV" onPress={selectCV} />
      )}

      <Text style={styles.note}>
        Formatos previstos: PDF y DOC/DOCX. El archivo real se conectará al servicio de almacenamiento en la siguiente integración.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: colors.text, marginBottom: 22 },
  card: { padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: colors.background },
  file: { fontSize: 17, fontWeight: "700", color: colors.text, marginBottom: 6 },
  note: { marginTop: 20, fontSize: 14, lineHeight: 21, color: colors.text },
});
