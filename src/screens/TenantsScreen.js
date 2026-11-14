import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTenants, getPayments, hasPaidRent, currentMonth } from "../storage/storage";
import Chip from "../components/Chip";
import { colors, rs } from "../theme";

export default function TenantsScreen({ navigation }) {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const month = currentMonth();

  useFocusEffect(
    useCallback(() => {
      getTenants().then(setTenants);
      getPayments().then(setPayments);
    }, [])
  );

  const q = query.toLowerCase();
  const data = tenants
    .map((t) => ({ ...t, status: hasPaidRent(payments, t.id, month) ? "Paid" : "Pending" }))
    .filter(
      (t) =>
        (t.name.toLowerCase().includes(q) || t.room.toLowerCase().includes(q)) &&
        (filter === "All" || t.status === filter)
    );

  return (
    <View style={s.container}>
      <TextInput
        style={s.input}
        placeholder="Search by name or room..."
        value={query}
        onChangeText={setQuery}
      />
      <View style={s.row}>
        {["All", "Paid", "Pending"].map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={s.empty}>No tenants found</Text>}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => navigation.navigate("TenantDetail", { id: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.sub}>Room {item.room} • {rs(item.rent)}</Text>
            </View>
            <Text style={[s.badge, item.status === "Paid" ? s.paid : s.pending]}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate("AddTenant")}>
        <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: colors.bg },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap" },
  card: { flexDirection: "row", alignItems: "center", padding: 14, backgroundColor: colors.card, borderRadius: 10, marginBottom: 8 },
  name: { fontWeight: "bold", fontSize: 16, color: colors.text },
  sub: { color: colors.sub, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: "hidden", fontWeight: "bold" },
  paid: { backgroundColor: "#d7f0ea", color: "#1f7a6e" },
  pending: { backgroundColor: "#fde3e4", color: colors.danger },
  empty: { textAlign: "center", marginTop: 30, color: colors.sub },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", elevation: 4 },
});
