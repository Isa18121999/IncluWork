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
      if (!response.ok) throw new Error(data.message || "No se pudo iniciar sesión");

      const params = { userId: data.user.id };
      if (data.user.role === "company") {
        navigation.replace("CompanyDashboard", params);
      } else if (data.user.role === "candidate") {
        navigation.replace("CandidateDashboard", params);
      } else {
        Alert.alert("Rol no disponible");
      }
    } catch (error) {
      Alert.alert("Error de inicio de sesión", error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <AccessibleButton title={loading ? "Ingresando..." : "Iniciar sesión"} onPress={handleLogin} disabled={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "800", color: colors.primary },
  input: { borderWidth: 1, borderColor: colors.secondary, borderRadius: 10, padding: 16, marginTop: 14 }
});
