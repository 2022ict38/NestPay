import { useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert, Linking, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getTenants, getPayments, deleteTenant, deletePayment, hasPaidRent, currentMonth,
} from "../storage/storage";
import { colors, rs } from "../theme";

export default function TenantDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);

  const load = useCallback(async () => {
    const t = (await getTenants()).find((x) => x.id === id);
    const p = (await getPayments()).filter((x) => x.tenantId === id);
    setTenant(t || null);
    setPayments(p.sort((a, b) => b.date.localeCompare(a.date)));
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!tenant) return <View style={s.container}><Text style={{ padding: 20 }}>Loading...</Text></View>;

  const paid = hasPaidRent(payments, tenant.id, currentMonth());
  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  const onDelete = () =>
    Alert.alert("Delete tenant", `Remove ${tenant.name} and all their payments?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => { await deleteTenant(tenant.id); navigation.goBack(); },
      },
    ]);

  const onDeletePayment = (pid) =>
    Alert.alert("Delete payment", "Remove this payment record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deletePayment(pid); load(); } },
    ]);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 14 }}>
      <View style={s.card}>
        <Text style={s.name}>{tenant.name}</Text>
        <Text style={s.sub}>Room {tenant.room}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${tenant.phone}`)}>
          <Text style={[s.sub, { color: colors.primary }]}>📞 {tenant.phone}</Text>
        </TouchableOpacity>
        <Text style={s.sub}>Monthly rent: {rs(tenant.rent)}</Text>
        <Text style={[s.status, { color: paid ? colors.primary : colors.danger }]}>
          This month: {paid ? "Rent Paid" : "Rent Pending"}
        </Text>
        <Text style={s.sub}>Total paid so far: {rs(total)}</Text>
      </View>

      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("AddPayment", { tenantId: tenant.id })}>
          <Text style={s.btnText}>+ Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: colors.warn }]} onPress={() => navigation.navigate("AddTenant", { tenant })}>
          <Text style={s.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: colors.danger }]} onPress={onDelete}>
          <Text style={s.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.title}>Payment history ({payments.length})</Text>
      {payments.length === 0 && <Text style={s.sub}>No payments recorded yet.</Text>}
      {payments.map((p) => (
        <TouchableOpacity key={p.id} style={s.pay} onLongPress={() => onDeletePayment(p.id)}>
          <View>
            <Text style={{ fontWeight: "bold" }}>{p.type}</Text>
            <Text style={s.sub}>{p.month} • paid on {p.date}</Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>{rs(p.amount)}</Text>
        </TouchableOpacity>
      ))}
      {payments.length > 0 && <Text style={s.hint}>Long-press a payment to delete it</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "bold", color: colors.text },
  sub: { color: colors.sub, marginTop: 4 },
  status: { fontWeight: "bold", marginTop: 8 },
  row: { flexDirection: "row", marginBottom: 14 },
  btn: { flex: 1, backgroundColor: colors.primary, padding: 12, borderRadius: 10, marginHorizontal: 4, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: colors.text },
  pay: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 6 },
  hint: { textAlign: "center", color: colors.sub, fontSize: 12, marginTop: 6 },
});
