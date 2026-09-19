import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { colors } from "../theme/colors";
import { setSessionToken } from "../config/session";

const AUTH_URL = `${API_URL}/auth`;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{7,15}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/;

export default function CompanyRegister({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    if (!normalizedName || !normalizedEmail || !normalizedPhone || !password) {
      Alert.alert("Datos incompletos", "Completa empresa, email, teléfono y contraseña.");
      return;
    }
    if (normalizedName.length < 2 || normalizedName.length > 150 || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(normalizedName)) {
      Alert.alert("Empresa no válida", "Ingresa un nombre de empresa válido.");
      return;
    }
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      Alert.alert("Correo no válido", "Ingresa un correo electrónico válido.");
      return;
    }
    if (!PHONE_PATTERN.test(normalizedPhone)) {
      Alert.alert("Teléfono no válido", "El teléfono debe contener solo números (7 a 15 dígitos).");
      return;
    }
    if (!PASSWORD_PATTERN.test(password)) {
      Alert.alert("Contraseña no válida", "Debe tener 8 a 128 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalizedName, email: normalizedEmail, phone: normalizedPhone, password, role: "company" })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo completar el registro");
      setSessionToken(data.token);
      Alert.alert("Registro exitoso", "Tu empresa fue registrada correctamente.", [
        { text: "Continuar", onPress: () => navigation.replace("CompanyDashboard", { userId: data.user.id, token: data.token }) }
      ]);
    } catch (error) {
      Alert.alert("Error de registro", error.message || "No se pudo conectar con el servidor.");
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">Registro de empresa</Text>
        <Text style={styles.subtitle}>Crea una cuenta para publicar oportunidades inclusivas.</Text>
        <TextInput style={styles.input} placeholder="Nombre de la empresa" value={name} onChangeText={setName} accessibilityLabel="Nombre de la empresa" />
        <TextInput style={styles.input} placeholder="Email corporativo" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} accessibilityLabel="Email corporativo" />
        <TextInput style={styles.input} placeholder="Teléfono (7 a 15 dígitos)" value={phone} onChangeText={(value) => setPhone(value.replace(/\D/g, ""))} keyboardType="phone-pad" accessibilityLabel="Teléfono" maxLength={15} />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Contraseña" />
        <Text style={styles.passwordHint}>8–128 caracteres · mayúscula · minúscula · número · carácter especial</Text>
        <AccessibleButton title={loading ? "Registrando..." : "Crear cuenta de empresa"} onPress={handleRegister} disabled={loading} />
        <AccessibleButton title="Volver" type="secondary" onPress={() => navigation.goBack()} disabled={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary, textAlign: "center" },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.text, textAlign: "center", marginTop: 10, marginBottom: 24 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.secondary, borderRadius: 10, paddingHorizontal: 16, fontSize: 17, color: colors.text, marginBottom: 14, backgroundColor: colors.white },
  passwordHint: { marginTop: -8, marginBottom: 10, color: colors.text, fontSize: 13 }
});
