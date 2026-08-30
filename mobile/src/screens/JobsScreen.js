import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const JOBS = [
  { id: "1", title: "Frontend Developer", company: "Empresa Inclusiva SAC", area: "Tecnología", modality: "Remoto", accessibility: ["Subtítulos", "Horario flexible"], match: 94 },
  { id: "2", title: "Diseñador UX/UI", company: "Tecnología Accesible", area: "Diseño", modality: "Híbrido", accessibility: ["Horario flexible"], match: 91 },
  { id: "3", title: "Analista de datos", company: "Data Perú", area: "Tecnología", modality: "Remoto", accessibility: ["Trabajo remoto", "Material accesible"], match: 86 },
];

export default function JobsScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState("Todas");
  const [modality, setModality] = useState("Todas");
  const [minimumMatch, setMinimumMatch] = useState("80");

  const filteredJobs = useMemo(() => JOBS.filter((job) => {
    const text = `${job.title} ${job.company}`.toLowerCase();
    const keywordOk = !keyword.trim() || text.includes(keyword.toLowerCase().trim());
    const areaOk = area === "Todas" || job.area === area;
    const modalityOk = modality === "Todas" || job.modality === modality;
    const matchOk = job.match >= Number(minimumMatch);
    return keywordOk && areaOk && modalityOk && matchOk;
  }), [keyword, area, modality, minimumMatch]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔎 Buscar empleos</Text>
      <Text style={styles.subtitle}>Encuentra oportunidades compatibles con tu perfil y preferencias.</Text>

      <TextInput style={styles.input} placeholder="Cargo, habilidad o empresa" value={keyword} onChangeText={setKeyword} accessibilityLabel="Buscar empleo" />

      <Text style={styles.label}>Área profesional</Text>
      <Picker selectedValue={area} onValueChange={setArea}>
        <Picker.Item label="Todas" value="Todas" />
        <Picker.Item label="Tecnología" value="Tecnología" />
        <Picker.Item label="Diseño" value="Diseño" />
      </Picker>

      <Text style={styles.label}>Modalidad</Text>
      <Picker selectedValue={modality} onValueChange={setModality}>
        <Picker.Item label="Todas" value="Todas" />
        <Picker.Item label="Remoto" value="Remoto" />
        <Picker.Item label="Híbrido" value="Híbrido" />
        <Picker.Item label="Presencial" value="Presencial" />
      </Picker>

      <Text style={styles.label}>Match IA mínimo</Text>
      <Picker selectedValue={minimumMatch} onValueChange={setMinimumMatch}>
        <Picker.Item label="70%" value="70" />
        <Picker.Item label="80%" value="80" />
        <Picker.Item label="90%" value="90" />
      </Picker>

      <Text style={styles.results}>{filteredJobs.length} oportunidades encontradas</Text>

      {filteredJobs.map((job) => (
        <View key={job.id} style={styles.card} accessible accessibilityLabel={`${job.title}, ${job.match}% de compatibilidad`}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.company}>🏢 {job.company}</Text>
          <Text style={styles.match}>🤖 {job.match}% Match IA</Text>
          <Text style={styles.details}>💼 {job.area} · 🏠 {job.modality}</Text>
          <Text style={styles.accessibility}>♿ {job.accessibility.join(" · ")}</Text>
          <AccessibleButton title="Ver oferta" onPress={() => navigation.navigate("JobDetail", { job })} />
        </View>
      ))}

      {filteredJobs.length === 0 && <Text style={styles.empty}>No encontramos ofertas con estos filtros. Prueba ampliando la búsqueda.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.text, marginBottom: 18 },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 10 },
  label: { marginTop: 10, fontWeight: "700", color: colors.text },
  results: { marginTop: 16, marginBottom: 10, fontWeight: "700", color: colors.secondary },
  card: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 16, padding: 18, marginBottom: 16 },
  jobTitle: { fontSize: 20, fontWeight: "800", color: colors.text },
  company: { marginTop: 7, fontSize: 16, color: colors.text },
  match: { marginTop: 10, fontSize: 18, fontWeight: "800", color: colors.success },
  details: { marginTop: 8, color: colors.text },
  accessibility: { marginTop: 8, lineHeight: 22, color: colors.text },
  empty: { marginTop: 20, fontSize: 16, lineHeight: 23, color: colors.text },
});