import React, { useState } from "react";
import { Alert, ScrollView, Text, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { authHeaders } from "../config/session";

const APPLICATIONS_URL = `${API_URL}/applications`;

export default function CandidateCVScreen({ route, navigation }) {
  const { candidate } = route.params || {};
  const [status, setStatus] = useState(candidate?.status || "Postulado");
  const [loadingCv, setLoadingCv] = useState(false);

  const openCandidateCv = async () => {
    if (!candidate?.applicationId) {
      Alert.alert("CV no disponible", "No se encontró la postulación de este candidato.");
      return;
    }

    setLoadingCv(true);
    try {
      const response = await fetch(`${API_URL}/cv/application/${candidate.applicationId}`, {
        headers: authHeaders()
      });

      if (!response.ok) {
        let message = "No se pudo obtener el CV.";
        try {
          const data = await response.json();
          message = data.message || message;
        } catch {}
        throw new Error(message);
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const extension = contentType.includes("pdf") ? "pdf" : contentType.includes("wordprocessingml") ? "docx" : contentType.includes("msword") ? "doc" : "cv";
      const safeName = (candidate.name || "candidato").replace(/[^a-zA-Z0-9_-]/g, "_");
      const target = `${FileSystem.cacheDirectory}inklu-cv-${safeName}.${extension}`;
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      const chunkSize = 0x8000;
      for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
      }
      const base64 = globalThis.btoa(binary);
      await FileSystem.writeAsStringAsync(target, base64, { encoding: FileSystem.EncodingType.Base64 });

      if (!(await Sharing.isAvailableAsync())) throw new Error("El dispositivo no permite abrir archivos desde Inklu.");
      await Sharing.shareAsync(target, { mimeType: contentType, dialogTitle: "Abrir CV del candidato" });
    } catch (error) {
      Alert.alert("CV", error.message || "No se pudo abrir el CV.");
    } finally {
      setLoadingCv(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!candidate?.applicationId) { Alert.alert("Error", "No se encontró la postulación."); return; }
    try {
      const response = await fetch(`${APPLICATIONS_URL}/${candidate.applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error("No se pudo actualizar la postulación");
      const updatedApplication = await response.json();
      setStatus(updatedApplication.status);
      Alert.alert("Actualizado", `Estado: ${updatedApplication.status}`);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo actualizar el estado.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Revisión de candidato</Text>
      <Text style={styles.name}>{candidate?.name || "Candidato"}</Text>
      <Text style={styles.match}>🤖 {candidate?.score || candidate?.match || 0}% Match IA</Text>
      <Text style={styles.section}>Perfil profesional</Text>
      <Text style={styles.text}>{candidate?.professionalTitle || "Perfil profesional"}</Text>
      <Text style={styles.section}>Habilidades</Text>
      <Text style={styles.text}>{candidate?.skills?.join(" · ") || "Habilidades no disponibles"}</Text>
      <Text style={styles.section}>Estado</Text>
      <Text style={styles.text}>{status}</Text>
      <AccessibleButton title={loadingCv ? "Abriendo CV..." : "📄 Abrir CV"} onPress={openCandidateCv} disabled={loadingCv} />
      <AccessibleButton title="Marcar CV visto" onPress={() => updateStatus("CV visto")} />
      <AccessibleButton title="Pasar a proceso" onPress={() => updateStatus("En proceso")} />
      <AccessibleButton title="Finalizar proceso" onPress={() => updateStatus("Proceso finalizado")} />
      <AccessibleButton title="Volver" type="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary },
  name: { fontSize: 20, fontWeight: "700", marginTop: 16 },
  match: { fontSize: 20, fontWeight: "800", color: colors.success, marginTop: 10 },
  section: { fontSize: 18, fontWeight: "800", color: colors.secondary, marginTop: 24 },
  text: { fontSize: 16, lineHeight: 24, color: colors.text, marginTop: 8 },
});
