import React, { useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const COUNTRIES = [
  { label: "🇵🇪 Perú", value: "PE", document: "Carnet/Certificado CONADIS" },
  { label: "🇨🇴 Colombia", value: "CO", document: "Certificado de discapacidad" },
  { label: "🇲🇽 México", value: "MX", document: "Credencial o certificado oficial" },
  { label: "🇨🇱 Chile", value: "CL", document: "Credencial de discapacidad" },
  { label: "🇦🇷 Argentina", value: "AR", document: "Certificado Único de Discapacidad (CUD)" },
  { label: "🇪🇸 España", value: "ES", document: "Certificado de grado de discapacidad" },
  { label: "🇺🇸 Estados Unidos", value: "US", document: "Acreditación oficial aplicable" },
  { label: "🌎 Otro país", value: "OTHER", document: "Certificación oficial equivalente" },
];

export default function CandidateRegister({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("PE");
  const [documentNumber, setDocumentNumber] = useState("");
  const [status, setStatus] = useState("idle");

  const countryData = useMemo(
    () => COUNTRIES.find((item) => item.value === country) || COUNTRIES[0],
    [country]
  );

  const submitVerification = () => {
    if (!name.trim() || !email.trim() || !documentNumber.trim()) {
      setStatus("Completa nombre, correo y número de acreditación.");
      return;
    }

    setStatus("Solicitud enviada. Tu acreditación quedó pendiente de verificación.");
    navigation.navigate("CandidateDashboard");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de candidato</Text>
      <Text style={styles.subtitle}>
        Para usar IncluWork debes contar con una acreditación oficial de discapacidad.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Nombre completo"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Correo electrónico"
      />

      <Text style={styles.label}>País de registro</Text>
      <Picker selectedValue={country} onValueChange={setCountry}>
        {COUNTRIES.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>

      <Text style={styles.label}>Tipo de acreditación</Text>
      <View style={styles.readonlyBox}>
        <Text style={styles.readonlyText}>{countryData.document}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Número de carnet o certificado"
        value={documentNumber}
        onChangeText={setDocumentNumber}
        accessibilityLabel="Número de carnet o certificado"
      />

      <AccessibleButton title="Enviar para verificación" onPress={submitVerification} />

      {status !== "idle" && <Text style={styles.status}>{status}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.text,
    marginBottom: 18,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  readonlyBox: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F8FAFC",
    marginBottom: 12,
  },
  readonlyText: {
    fontSize: 16,
    color: colors.text,
  },
  status: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
