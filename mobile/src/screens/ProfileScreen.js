import React, { useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function ProfileScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [city, setCity] = useState("");

  const candidateId = route?.params?.candidateId;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>
      <Text style={styles.status}>🟢 Perfil verificado</Text>
      <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Ciudad" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Cargo o profesión" value={jobTitle} onChangeText={setJobTitle} />
      <TextInput style={styles.input} placeholder="Experiencia" value={experience} onChangeText={setExperience} />
      <TextInput style={styles.input} placeholder="Habilidades" value={skills} onChangeText={setSkills} />
      <AccessibleButton title="📄 Gestionar mi CV" onPress={() => navigation.navigate("CV", { candidateId })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary },
  status: { marginTop: 8, color: colors.success },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, marginTop: 10 }
});
