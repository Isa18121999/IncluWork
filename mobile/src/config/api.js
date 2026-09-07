const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

// Expo only exposes variables prefixed with EXPO_PUBLIC_. Keeping this value in
// one place prevents development-only localhost URLs from being shipped.
const baseUrl = (configuredUrl || "http://localhost:3000").replace(/\/+$/, "");

export const API_URL = `${baseUrl}/api`;
