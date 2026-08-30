import React, { useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [city, setCity] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>
      <Text style={styles.status}>🟢 Perfil verificado</Text>

      <Text style={styles.section}>Información personal</Text>
      <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Ciudad" value={city} onChangeText={setCity} />

      <Text style={styles.section}>Perfil profesional</Text>
      <TextInput style={styles.input} placeholder="Cargo o profesión" value={jobTitle} onChangeText={setJobTitle} />
      <TextInput style={styles.input} placeholder="Años de experiencia" value={experience} onChangeText={setExperience} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Habilidades (separadas por coma)" value={skills} onChangeText={setSkills} />

      <Text style={styles.section}>♿ Preferencias de accesibilidad</Text>
      <Text style={styles.help}>Puedes indicar ajustes para trabajo, comunicación o entrevistas.</Text>
      <AccessibleButton title="📄 Gestionar mi CV" onPress={() => navigation.navigate("CV")} />
      <AccessibleButton title="💾 Guardar perfil" type="secondary" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary },
  status: { marginTop: 8, color: colors.success, fontSize: 17 },
  section: { marginTop: 24, marginBottom: 8, fontSize: 19, fontWeight: "800", color: colors.text },
  help: { fontSize: 15, lineHeight: 22, color: colors.text, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, marginTop: 10, fontSize: 16 },
});
