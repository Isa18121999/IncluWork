import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";
import { API_URL } from "../config/api";
import { authHeaders } from "../config/session";
import { sanitizeName, sanitizePhone, validateName, validatePhone } from "../config/validation";

export default function CandidateProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [modality, setModality] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile/me`, { headers: authHeaders() });
      const profile = await response.json();
      if (!response.ok) return;
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setProfessionalTitle(profile.professionalTitle || "");
      setExperience(String(profile.experience ?? ""));
      setSkills((profile.skills || []).join(", "));
      setEducation(profile.education || "");
      setModality(profile.modality || "");
      setAccessibility((profile.accessibility || []).join(", "));
    } catch (_error) {}
  };

  const saveProfile = async () => {
    const normalizedName = name.trim();
    const normalizedPhone = phone.trim();
    const numericExperience = Number(experience);

    if (!normalizedName || !normalizedPhone) {
      Alert.alert("Datos incompletos", "Nombre y teléfono son obligatorios.");
      return;
    }
    if (!validateName(normalizedName)) {
      Alert.alert("Nombre no válido", "El nombre solo puede contener letras, espacios, guiones y apóstrofes.");
      return;
    }
    if (!validatePhone(normalizedPhone)) {
      Alert.alert("Teléfono no válido", "El teléfono debe contener solo números (7 a 15 dígitos).");
      return;
    }
    if (!Number.isFinite(numericExperience) || numericExperience < 0) {
      Alert.alert("Experiencia no válida", "La experiencia debe ser un número mayor o igual a 0.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          name: normalizedName,
          phone: normalizedPhone,
          professionalTitle: professionalTitle.trim(),
          experience: numericExperience,
          skills: skills.split(",").map(item => item.trim()).filter(Boolean),
          education: education.trim(),
          modality: modality.trim(),
          accessibility: accessibility.split(",").map(item => item.trim()).filter(Boolean)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo guardar el perfil");
      Alert.alert("Perfil actualizado", "Tus datos se guardaron correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi perfil profesional</Text>
      <Text style={styles.subtitle}>Completa tu perfil para mejorar tus recomendaciones y tu Match integral.</Text>
      <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={(value) => setName(sanitizeName(value))} autoCapitalize="words" accessibilityLabel="Nombre completo" />
      <TextInput style={styles.input} placeholder="Teléfono (7 a 15 dígitos)" value={phone} onChangeText={(value) => setPhone(sanitizePhone(value))} keyboardType="phone-pad" maxLength={15} accessibilityLabel="Teléfono" />
      <TextInput style={styles.input} placeholder="Cargo o profesión" value={professionalTitle} onChangeText={setProfessionalTitle} accessibilityLabel="Cargo o profesión" />
      <TextInput style={styles.input} placeholder="Años de experiencia" value={experience} onChangeText={(value) => setExperience(value.replace(/[^0-9.]/g, ""))} keyboardType="decimal-pad" accessibilityLabel="Años de experiencia" />
      <TextInput style={styles.input} placeholder="Habilidades (separadas por comas)" value={skills} onChangeText={setSkills} accessibilityLabel="Habilidades" />
      <TextInput style={styles.input} placeholder="Formación académica" value={education} onChangeText={setEducation} accessibilityLabel="Formación académica" />
      <TextInput style={styles.input} placeholder="Modalidad preferida: remoto, híbrido o presencial" value={modality} onChangeText={setModality} accessibilityLabel="Modalidad laboral preferida" />
      <TextInput style={styles.input} placeholder="Necesidades de accesibilidad (separadas por comas)" value={accessibility} onChangeText={setAccessibility} accessibilityLabel="Necesidades de accesibilidad" />
      <AccessibleButton title="📄 Gestionar mi CV" onPress={() => navigation.navigate("CV")} disabled={loading} />
      <AccessibleButton title={loading ? "Guardando..." : "💾 Guardar perfil"} type="secondary" onPress={saveProfile} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.text, marginBottom: 18 },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 }
});
