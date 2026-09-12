import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { getSessionRole, restoreSessionToken } from "./src/config/session";

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    const restore = async () => {
      await restoreSessionToken();
      const role = getSessionRole();
      setInitialRouteName(role === "candidate" ? "CandidateDashboard" : role === "company" ? "CompanyDashboard" : "Welcome");
    };
    restore();
  }, []);

  if (!initialRouteName) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator accessibilityLabel="Cargando sesión" />
      </View>
    );
  }

  return <AppNavigator initialRouteName={initialRouteName} />;
}
