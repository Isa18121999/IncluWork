import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AccessibleButton from "../components/AccessibleButton";
import { API_URL } from "../config/api";
import { authHeaders } from "../config/session";
import { colors } from "../theme/colors";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications`, { headers: authHeaders() });
      if (!res.ok) throw new Error("No se pudieron obtener las notificaciones");
      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch (_error) {
      if (!isRefresh) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadNotifications();
  }, [loadNotifications]));

  const markAsRead = async (id) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: authHeaders()
    });
    if (!res.ok) return;
    setNotifications((current) =>
      current.map((item) => item._id === id ? { ...item, read: true } : item)
    );
    setUnreadCount((current) => Math.max(0, current - 1));
  };

  const markAllAsRead = async () => {
    if (!unreadCount) return;
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: authHeaders()
    });
    if (!res.ok) return;
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title} accessibilityRole="header">Notificaciones</Text>
          <Text style={styles.subtitle}>{unreadCount} sin leer</Text>
        </View>
        <AccessibleButton
          title="Leer todas" accessibilityHint="Marca todas las notificaciones como leídas."
          type="secondary"
          onPress={markAllAsRead}
          disabled={!unreadCount}
        />
      </View>

      {loading && <ActivityIndicator color={colors.primary} />}

      {!loading && !notifications.length && (
        <Text style={styles.empty}>No tienes notificaciones.</Text>
      )}

      {notifications.map((notification) => (
        <View key={notification._id} style={[styles.card, !notification.read && styles.unread]} accessible accessibilityLabel={`${notification.title}. ${notification.message}. ${notification.read ? "Leída" : "No leída"}`}>
          <View style={styles.row}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {!notification.read && <View style={styles.dot} />}
          </View>
          <Text style={styles.message}>{notification.message}</Text>
          {notification.createdAt && (
            <Text style={styles.date}>
              {new Date(notification.createdAt).toLocaleString()}
            </Text>
          )}
          {!notification.read && (
            <AccessibleButton
              title="Marcar como leída"
              type="secondary"
              onPress={() => markAsRead(notification._id)}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.white },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary },
  subtitle: { marginTop: 4, color: "#64748B" },
  card: { padding: 16, borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, marginBottom: 12 },
  unread: { borderWidth: 2, borderColor: colors.primary },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  notificationTitle: { flex: 1, fontSize: 17, fontWeight: "800" },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, marginLeft: 8 },
  message: { marginTop: 8, lineHeight: 21 },
  date: { marginTop: 10, color: "#64748B", fontSize: 12 },
  empty: { marginBottom: 16, color: "#64748B" }
});
