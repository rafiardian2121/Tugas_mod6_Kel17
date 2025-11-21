import { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMqttSensor } from "../hooks/useMqttSensor.js";
import { Api } from "../services/api.js";
import { DataTable } from "../components/DataTable.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabSwipe } from "../hooks/useTabSwipe.js";

function MonitoringScreen() {
  const { temperature, timestamp, connectionState, error: mqttError } = useMqttSensor();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 🔹 Client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await Api.getSensorReadings();
      setReadings(data ?? []);
      setCurrentPage(1); // reset to page 1 setiap fetch
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReadings();
    }, [fetchReadings])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchReadings();
    } finally {
      setRefreshing(false);
    }
  }, [fetchReadings]);

  // 🔹 Hitung total halaman & ambil data per halaman
  const totalPages = Math.ceil(readings.length / pageSize);
  const pageData = readings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    // <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 🔥 Realtime MQTT Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Realtime Temperature</Text>
          <View style={styles.valueRow}>
            <Text style={styles.temperatureText}>
              {typeof temperature === "number" ? `${temperature.toFixed(2)}°C` : "--"}
            </Text>
          </View>
          <Text style={styles.metaText}>MQTT status: {connectionState}</Text>
          {timestamp && (
            <Text style={styles.metaText}>
              Last update: {new Date(timestamp).toLocaleString()}
            </Text>
          )}
          {mqttError && <Text style={styles.errorText}>MQTT error: {mqttError}</Text>}
        </View>

        {/* 📊 Data History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Triggered Readings History</Text>
          {loading && <ActivityIndicator />}
        </View>

        {apiError && <Text style={styles.errorText}>Failed to load history: {apiError}</Text>}

        <DataTable
          columns={[
            {
              key: "recorded_at",
              title: "Timestamp",
              render: (value) => (value ? new Date(value).toLocaleString() : "--"),
            },
            {
              key: "temperature",
              title: "Temperature (°C)",
              render: (value) =>
                typeof value === "number" ? `${Number(value).toFixed(2)}` : "--",
            },
            {
              key: "threshold_value",
              title: "Threshold (°C)",
              render: (value) =>
                typeof value === "number" ? `${Number(value).toFixed(2)}` : "--",
            },
          ]}
          data={pageData}
          keyExtractor={(item) => item.id}
        />

        {/* 🔽 Pagination */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            disabled={currentPage === 1}
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationDisabled,
            ]}
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <Text style={styles.paginationText}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Page {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            disabled={currentPage === totalPages || totalPages === 0}
            style={[
              styles.paginationButton,
              (currentPage === totalPages || totalPages === 0) && styles.paginationDisabled,
            ]}
            onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    // </SafeAreaView>
  );
}

export default useTabSwipe(MonitoringScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  valueRow: { flexDirection: "row", alignItems: "flex-end" },
  temperatureText: { fontSize: 48, fontWeight: "700", color: "#ff7a59" },
  metaText: { marginTop: 8, color: "#555" },
  errorText: { marginTop: 8, color: "#c82333" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "600" },

  // 🔽 Style Pagination
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  paginationButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  paginationText: { color: "#fff", fontWeight: "600" },
  paginationDisabled: { backgroundColor: "#ccc" },
  pageInfo: { fontSize: 14, fontWeight: "500" },
});
