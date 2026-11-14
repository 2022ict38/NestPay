import { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getTenants, addPayment, currentMonth, todayStr } from "../storage/storage";
import Chip from "../components/Chip";
import { colors } from "../theme";

const TYPES = ["Rent", "Electricity", "Water", "Internet"];

export default function AddPaymentScreen({ navigation, route }) {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState(route.params?.tenantId || null);
  const [type, setType] = useState("Rent");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(currentMonth());

  useEffect(() => {
    getTenants().then((list) => {
      setTenants(list);
      const t = list.find((x) => x.id === tenantId);
      if (t) setAmount(String(t.rent));
    });
  }, []);

  const pickTenant = (t) => {
    setTenantId(t.id);
    if (type === "Rent") setAmount(String(t.rent));
  };

  const pickType = (tp) => {
    setType(tp);
    const t = tenants.find((x) => x.id === tenantId);
    if (tp === "Rent" && t) setAmount(String(t.rent));
  };

  const onSave = async () => {
    if (!tenantId) return Alert.alert("Select tenant", "Please choose a tenant.");
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return Alert.alert("Invalid amount", "Enter a valid amount.");
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))
      return Alert.alert("Invalid month", "Use the format YYYY-MM (e.g. 2026-11).");

    await addPayment({ tenantId, type, amount: Number(amount), month, date: todayStr() });
    navigation.goBack();
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.label}>Tenant</Text>
      <View style={s.row}>
        {tenants.map((t) => (
          <Chip key={t.id} label={`${t.room} - ${t.name.split(" ")[0]}`} active={tenantId === t.id} onPress={() => pickTenant(t)} />
        ))}
      </View>

      <Text style={s.label}>Payment type</Text>
      <View style={s.row}>
        {TYPES.map((t) => <Chip key={t} label={t} active={type === t} onPress={() => pickType(t)} />)}
      </View>

      <Text style={s.label}>Amount (Rs.)</Text>
      <TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="e.g. 2500" />

      <Text style={s.label}>For month (YYYY-MM)</Text>
      <TextInput style={s.input} value={month} onChangeText={setMonth} maxLength={7} placeholder="2026-11" />

      <TouchableOpacity style={s.btn} onPress={onSave}>
        <Text style={s.btnText}>Save Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: { fontWeight: "bold", marginBottom: 6, color: colors.text },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 14 },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
