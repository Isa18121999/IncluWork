import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function AccessibleButton({
  title,
  onPress,
  type = "primary",
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "secondary" && styles.secondary,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  secondary: {
    backgroundColor: colors.success,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
