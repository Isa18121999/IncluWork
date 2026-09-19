import React, { useMemo, useState } from "react";
import { Alert, View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { setSessionToken } from "../config/session";
import { sanitizeName, sanitizePhone, validateName, validateEmail, validatePhone, validatePassword } from "../config/validation";

const AUTH_URL = `${API_URL}/auth`;
const COUNTRIES = [
  { label: "🇵🇪 Perú", value: "PE", document: "Carnet/Certificado CONADIS" },
  { label: "🇨🇴 Colombia", value: "CO", document: "Certificado de discapacidad" },
  { label: "🇲🇽 México", value: "MX", document: "Credencial o certificado oficial" },
  { label: "🇨🇱 Chile", value: "CL", document: "Credencial de discapacidad" },
  { label: "🇦🇷 Argentina", value: "AR", document: "Certificado Único de Discapacidad (CUD)" },
  { label: "🇪🇸 España", value: "ES", document: "Certificado de grado de discapacidad" },
  { label: "🇺🇸 Estados Unidos", value: "US", document: "Acreditación oficial aplicable" },
  { label: "🌎 Otro país", value: "OTHER", document: "Certificación oficial equivalente" }
];
export default function CandidateRegister({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("PE");
  const [documentNumber, setDocumentNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const countryData = useMemo(() => COUNTRIES.find((item) => item.value === country) || COUNTRIES[0], [country]);

  const submitRegistration = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    if (!normalizedName || !normalizedEmail || !normalizedPhone || !password || !documentNumber.trim()) {
      Alert.alert("Datos incompletos", "Completa todos los campos obligatorios.");
      return;
    }
    if (!validateName(normalizedName)) {
      Alert.alert("Nombre no válido", "El nombre solo puede contener letras, espacios, guiones y apóstrofes.");
      return;
    }
    if (!validateEmail(normalizedEmail)) {
      Alert.alert("Correo no válido", "Ingresa un correo electrónico válido.");
      return;
    }
    if (!validatePhone(normalizedPhone)) {
      Alert.alert("Teléfono no válido", "El teléfono debe contener solo números (7 a 15 dígitos).");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Contraseña no válida", "Debe tener 8 a 128 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalizedName, email: normalizedEmail, phone: normalizedPhone, password, role: "candidate", country, accreditationType: countryData.document, accreditationNumber: documentNumber.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo completar el registro");
      setSessionToken(data.token);
      Alert.alert("Registro correcto", "Tu cuenta y perfil de candidato fueron creados.", [
        { text: "Continuar", onPress: () => navigation.replace("CandidateDashboard", { userId: data.user.id, token: data.token }) }
      ]);
    } catch (error) {
      Alert.alert("Error de registro", error.message || "No se pudo conectar con el servidor.");
    } finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de candidato</Text>
      <Text style={styles.subtitle}>Crea tu cuenta y completa los datos de acreditación para utilizar Inklu.</Text>
      <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={(value) => setName(sanitizeName(value))} autoCapitalize="words" accessibilityLabel="Nombre completo" />
      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} accessibilityLabel="Correo electrónico" />
      <TextInput style={styles.input} placeholder="Teléfono (7 a 15 dígitos)" value={phone} onChangeText={(value) => setPhone(sanitizePhone(value))} keyboardType="phone-pad" accessibilityLabel="Teléfono" maxLength={15} />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Contraseña" />
      <Text style={styles.passwordHint}>8–128 caracteres · mayúscula · minúscula · número · carácter especial</Text>
      <Text style={styles.label}>País de registro</Text>
      <Picker selectedValue={country} onValueChange={setCountry}>{COUNTRIES.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}</Picker>
      <Text style={styles.label}>Tipo de acreditación</Text>
      <View style={styles.readonlyBox}><Text style={styles.readonlyText}>{countryData.document}</Text></View>
      <TextInput style={styles.input} placeholder="Número de carnet o certificado" value={documentNumber} onChangeText={setDocumentNumber} accessibilityLabel="Número de carnet o certificado" />
      <AccessibleButton title={loading ? "Registrando..." : "Crear cuenta"} onPress={submitRegistration} disabled={loading} />
      <AccessibleButton title="Ya tengo una cuenta" type="secondary" onPress={() => navigation.navigate("Login")} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.text, marginBottom: 18 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "700", color: colors.text },
  input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
  passwordHint: { marginTop: -6, marginBottom: 8, color: colors.text, fontSize: 13 },
  readonlyBox: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, padding: 14, backgroundColor: "#F8FAFC", marginBottom: 12 },
  readonlyText: { fontSize: 16, color: colors.text }
});
