import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo} accessibilityLabel="Logo IncluWork">
        IncluWork
      </Text>

      <Text style={styles.title}>
        Conectando talento con oportunidades inclusivas
      </Text>

      <Text style={styles.description}>
        Una plataforma laboral accesible para personas con discapacidad y empresas comprometidas con la inclusión.
      </Text>

      <AccessibleButton
        title="Soy candidato"
        onPress={() => navigation.navigate("CandidateRegister")}
      />

      <AccessibleButton
        title="Soy empresa"
        type="secondary"
        onPress={() => navigation.navigate("CompanyRegister")}
      />

      <AccessibleButton
        title="Iniciar sesión"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.white,
  },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  description: {
    marginTop: 16,
    fontSize: 17,
    lineHeight: 25,
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
});
