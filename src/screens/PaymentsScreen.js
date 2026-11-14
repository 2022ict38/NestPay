import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTenants, getPayments, deletePayment } from "../storage/storage";
import Chip from "../components/Chip";
import { colors, rs } from "../theme";

const TYPES = ["All", "Rent", "Electricity", "Water", "Internet"];

export default function PaymentsScreen({ navigation }) {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [type, setType] = useState("All");
  const [month, setMonth] = useState("All");
  const [query, setQuery] = useState("");

  const load = useCallback(() => {
    getTenants().then(setTenants);
    getPayments().then(setPayments);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const months = ["All", ...Array.from(new Set(payments.map((p) => p.month))).sort().reverse()];
  const nameOf = (id) => tenants.find((t) => t.id === id)?.name || "Unknown";
  const q = query.toLowerCase();

  const data = payments
    .filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (month === "All" || p.month === month) &&
        nameOf(p.tenantId).toLowerCase().includes(q)
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = data.reduce((sum, p) => sum + p.amount, 0);

  const onDelete = (id) =>
    Alert.alert("Delete payment", "Remove this payment record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deletePayment(id); load(); } },
    ]);

  return (
    <View style={s.container}>
      <TextInput style={s.input} placeholder="Search by tenant name..." value={query} onChangeText={setQuery} />
      <View style={s.row}>
        {TYPES.map((t) => <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />)}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
        {months.map((m) => <Chip key={m} label={m === "All" ? "All months" : m} active={month === m} onPress={() => setMonth(m)} />)}
      </ScrollView>

      <Text style={s.total}>{data.length} records • Total {rs(total)}</Text>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={s.empty}>No payments found</Text>}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => navigation.navigate("TenantDetail", { id: item.tenantId })}
            onLongPress={() => onDelete(item.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{nameOf(item.tenantId)}</Text>
              <Text style={s.sub}>{item.type} • {item.month} • {item.date}</Text>
            </View>
            <Text style={s.amount}>{rs(item.amount)}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate("AddPayment")}>
        <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: colors.bg },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap" },
  total: { fontWeight: "bold", color: colors.primary, marginVertical: 8 },
  card: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.card, borderRadius: 10, marginBottom: 8 },
  name: { fontWeight: "bold", fontSize: 15, color: colors.text },
  sub: { color: colors.sub, marginTop: 2, fontSize: 12 },
  amount: { fontWeight: "bold", color: colors.text },
  empty: { textAlign: "center", marginTop: 30, color: colors.sub },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", elevation: 4 },
});
