import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AccessibleButton from "../components/AccessibleButton";
import { colors } from "../theme/colors";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo} accessibilityLabel="Logo IncluWork">IncluWork</Text>
      <Text style={styles.title}>¡Bienvenidos a IncluWork!</Text>
      <Text style={styles.description}>
        Conectamos talento con oportunidades laborales inclusivas mediante tecnología accesible e inteligencia artificial.
      </Text>
      <AccessibleButton title="👤 Soy candidato" onPress={() => navigation.navigate("CandidateRegister")} />
      <AccessibleButton title="🏢 Soy empresa" type="secondary" onPress={() => navigation.navigate("CompanyRegister")} />
      <AccessibleButton title="🔐 Iniciar sesión" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.white },
  logo: { textAlign: "center", fontSize: 42, fontWeight: "800", color: colors.primary, marginBottom: 24 },
  title: { textAlign: "center", fontSize: 28, fontWeight: "800", color: colors.text },
  description: { textAlign: "center", marginTop: 14, marginBottom: 20, fontSize: 17, lineHeight: 25, color: colors.text },
});
