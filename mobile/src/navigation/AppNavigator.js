import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import CandidateRegister from "../screens/CandidateRegister";
import CandidateDashboard from "../screens/CandidateDashboard";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="CandidateRegister" component={CandidateRegister} />
        <Stack.Screen name="CandidateDashboard" component={CandidateDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
