import React, { useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3000/api/cv";

export default function CVUpload({ navigation, route }) {
  const [cvName, setCvName] = useState("");
  const [loading, setLoading] = useState(false);

  const candidateId = route?.params?.candidateId;

  const chooseCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        await uploadCV(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el CV.");
    }
  };

  const uploadCV = async (file) => {
    if (!candidateId) {
      Alert.alert("Falta candidato", "No se encontró el candidato asociado.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cv", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/pdf"
      });

      const response = await fetch(`${API_URL}/${candidateId}`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error subiendo CV");

      setCvName(file.name);
      Alert.alert("CV actualizado", "Tu CV fue guardado correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Mi CV</Text>
      <Text style={styles.description}>
        Sube o actualiza tu CV para mejorar tu perfil y Match IA.
      </Text>

      {cvName ? <Text style={styles.file}>{cvName}</Text> : <Text style={styles.empty}>No tienes un CV cargado.</Text>}

      <AccessibleButton title={loading ? "Subiendo..." : "📤 Subir CV"} onPress={chooseCV} disabled={loading} />
      <AccessibleButton title="🔄 Actualizar CV" type="secondary" onPress={chooseCV} disabled={loading} />
      <AccessibleButton title="Volver a mi perfil" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary, marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: colors.text, marginBottom: 20 },
  empty: { fontSize: 16, color: colors.text, marginBottom: 20 },
  file: { fontSize: 16, fontWeight: "700", color: colors.success, marginBottom: 20 }
});
