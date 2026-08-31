import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

const API_URL = "http://localhost:3000/api/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Datos incompletos", "Ingresa tu email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo iniciar sesión");
      }

      const role = data.user?.role;
      if (role === "company") {
        navigation.replace("CompanyDashboard");
      } else if (role === "candidate") {
        navigation.replace("CandidateDashboard");
      } else {
        Alert.alert("Rol no disponible", "Tu usuario no tiene un panel configurado.");
      }
    } catch (error) {
      Alert.alert("Error de inicio de sesión", error.message || "No se pudo conectar con el servidor.");
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
        <Text style={styles.title} accessibilityRole="header">Iniciar sesión</Text>
        <Text style={styles.subtitle}>Accede a tu cuenta de IncluWork.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          accessibilityLabel="Email"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          accessibilityLabel="Contraseña"
        />

        <AccessibleButton
          title={loading ? "Ingresando..." : "Iniciar sesión"}
          onPress={handleLogin}
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
