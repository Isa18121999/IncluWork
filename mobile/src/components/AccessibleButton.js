import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const getAccessibleLabel = (title, accessibilityLabel) => {
  if (accessibilityLabel) return accessibilityLabel;
  return String(title).replace(/[\\p{Extended_Pictographic}\\uFE0F]/gu, "").replace(/\\s+/g, " ").trim();
};

export default function AccessibleButton({ title, onPress, type = "primary", disabled = false, accessibilityLabel, accessibilityHint }) {
  return (
    <TouchableOpacity
      style={[styles.button, type === "secondary" && styles.secondary, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      accessibilityRole="button"
      accessibilityLabel={getAccessibleLabel(title, accessibilityLabel)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
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
  disabled: { opacity: 0.5 },
  text: { color: colors.white, fontSize: 18, fontWeight: "700" },
});
