import React, { useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders } from "../config/session";

const CV_URL = `${API_URL}/cv`;
const MAX_CV_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function CVUpload({ navigation, route }) {
  const [cvName, setCvName] = useState("");
  const [loading, setLoading] = useState(false);

  const chooseCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        const file = result.assets?.[0];
        if (!file) return;
        const extension = `.${String(file.name || "").split(".").pop()}`.toLowerCase();
        const mimeType = file.mimeType || "";
        if (!ALLOWED_EXTENSIONS.includes(extension) || (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType))) {
          Alert.alert("Formato no válido", "El CV debe ser PDF, DOC o DOCX.");
          return;
        }
        if (file.size !== undefined && file.size > MAX_CV_SIZE) {
          Alert.alert("Archivo demasiado grande", "El CV no puede superar los 10 MB.");
          return;
        }
        await uploadCV(file);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el CV.");
    }
  };

  const uploadCV = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cv", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/pdf"
      });

      const response = await fetch(`${CV_URL}/me`, {
        method: "POST",
        headers: authHeaders(),
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
