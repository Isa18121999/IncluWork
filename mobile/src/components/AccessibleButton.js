import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function AccessibleButton({ title, onPress, type = "primary" }) {
  return (
    <TouchableOpacity
      style={[styles.button, type === "secondary" && styles.secondary]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessible
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  secondary: { backgroundColor: colors.success },
  text: { color: colors.white, fontSize: 18, fontWeight: "700" },
});
