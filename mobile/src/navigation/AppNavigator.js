import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import CandidateRegister from "../screens/CandidateRegister";
import CandidateDashboard from "../screens/CandidateDashboard";
import CandidateProfileScreen from "../screens/CandidateProfileScreen";
import CVUpload from "../screens/CVUpload";
import JobsScreen from "../screens/JobsScreen";
import JobDetailScreen from "../screens/JobDetailScreen";
import CompanyDashboardScreen from "../screens/CompanyDashboardScreen";
import CreateJobScreen from "../screens/CreateJobScreen";
import CandidateCVScreen from "../screens/CandidateCVScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CandidateRegister" component={CandidateRegister} />
        <Stack.Screen name="CandidateDashboard" component={CandidateDashboard} />
        <Stack.Screen name="CandidateProfile" component={CandidateProfileScreen} />
        <Stack.Screen name="CV" component={CVUpload} />
        <Stack.Screen name="Jobs" component={JobsScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} />
        <Stack.Screen name="CompanyDashboard" component={CompanyDashboardScreen} />
        <Stack.Screen name="CreateJob" component={CreateJobScreen} />
        <Stack.Screen name="CandidateCV" component={CandidateCVScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
