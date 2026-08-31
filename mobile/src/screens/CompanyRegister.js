import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3000/api/auth";

export default function CompanyRegister({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Datos incompletos", "Completa empresa, email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role: "company"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo completar el registro");
      }

      Alert.alert("Registro exitoso", "Tu empresa fue registrada correctamente.", [
        { text: "Continuar", onPress: () => navigation.replace("CompanyDashboard") }
      ]);
    } catch (error) {
      Alert.alert("Error de registro", error.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">Registro de empresa</Text>
        <Text style={styles.subtitle}>Crea una cuenta para publicar oportunidades inclusivas.</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de la empresa"
          value={name}
          onChangeText={setName}
          accessibilityLabel="Nombre de la empresa"
        />
        <TextInput
          style={styles.input}
          placeholder="Email corporativo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email corporativo"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Contraseña"
        />

        <AccessibleButton
          title={loading ? "Registrando..." : "Crear cuenta de empresa"}
          onPress={handleRegister}
          disabled={loading}
        />
        <AccessibleButton title="Volver" type="secondary" onPress={() => navigation.goBack()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary, textAlign: "center" },
  subtitle: { fontSize: 17, lineHeight: 24, color: colors.text, textAlign: "center", marginTop: 10, marginBottom: 24 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.secondary, borderRadius: 10, paddingHorizontal: 16, fontSize: 17, color: colors.text, marginBottom: 14, backgroundColor: colors.white }
});
