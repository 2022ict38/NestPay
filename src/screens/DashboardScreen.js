import { useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTenants, getPayments, hasPaidRent, currentMonth } from "../storage/storage";
import { colors, rs } from "../theme";

const TYPES = ["Rent", "Electricity", "Water", "Internet"];

export default function DashboardScreen({ navigation }) {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const month = currentMonth();

  useFocusEffect(
    useCallback(() => {
      getTenants().then(setTenants);
      getPayments().then(setPayments);
    }, [])
  );

  const monthPayments = payments.filter((p) => p.month === month);
  const collected = monthPayments.reduce((sum, p) => sum + p.amount, 0);
  const expectedRent = tenants.reduce((sum, t) => sum + t.rent, 0);
  const pending = tenants.filter((t) => !hasPaidRent(payments, t.id, month));
  const paidCount = tenants.length - pending.length;
  const byType = TYPES.map((type) => ({
    type,
    total: monthPayments.filter((p) => p.type === type).reduce((s, p) => s + p.amount, 0),
  }));

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 14 }}>
      <Text style={s.month}>Summary for {month}</Text>

      <View style={s.row}>
        <View style={s.box}>
          <Text style={s.big}>{tenants.length}</Text>
          <Text style={s.label}>Tenants</Text>
        </View>
        <View style={s.box}>
          <Text style={[s.big, { color: colors.primary }]}>{paidCount}</Text>
          <Text style={s.label}>Rent Paid</Text>
        </View>
        <View style={s.box}>
          <Text style={[s.big, { color: colors.danger }]}>{pending.length}</Text>
          <Text style={s.label}>Pending</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.label}>Collected this month</Text>
        <Text style={s.money}>{rs(collected)}</Text>
        <Text style={s.label}>Expected monthly rent: {rs(expectedRent)}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.title}>Collections by type</Text>
        {byType.map((b) => (
          <View key={b.type} style={s.line}>
            <Text>{b.type}</Text>
            <Text style={{ fontWeight: "bold" }}>{rs(b.total)}</Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.title}>Pending rent ({pending.length})</Text>
        {pending.length === 0 && <Text style={s.label}>Everyone has paid this month 🎉</Text>}
        {pending.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={s.line}
            onPress={() => navigation.navigate("TenantDetail", { id: t.id })}
          >
            <Text>{t.name} ({t.room})</Text>
            <Text style={{ color: colors.danger }}>{rs(t.rent)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("AddTenant")}>
          <Text style={s.btnText}>+ Add Tenant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("AddPayment")}>
          <Text style={s.btnText}>+ Add Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  month: { fontSize: 16, color: colors.sub, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  box: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, marginHorizontal: 4, alignItems: "center" },
  big: { fontSize: 26, fontWeight: "bold", color: colors.text },
  label: { color: colors.sub, fontSize: 13 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 12 },
  money: { fontSize: 28, fontWeight: "bold", color: colors.primary, marginVertical: 4 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: colors.text },
  line: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  btn: { flex: 1, backgroundColor: colors.primary, padding: 14, borderRadius: 10, marginHorizontal: 4, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
});
