import { useState, useLayoutEffect } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getTenants, addTenant, updateTenant } from "../storage/storage";
import { colors } from "../theme";

export default function AddTenantScreen({ navigation, route }) {
  const editing = route.params?.tenant;
  const [name, setName] = useState(editing?.name || "");
  const [room, setRoom] = useState(editing?.room || "");
  const [phone, setPhone] = useState(editing?.phone || "");
  const [rent, setRent] = useState(editing ? String(editing.rent) : "");

  useLayoutEffect(() => {
    navigation.setOptions({ title: editing ? "Edit Tenant" : "Add Tenant" });
  }, [navigation, editing]);

  const onSave = async () => {
    if (!name.trim() || !room.trim() || !phone.trim() || !rent.trim())
      return Alert.alert("Missing data", "Please fill in all fields.");
    if (!/^\d{10}$/.test(phone.trim()))
      return Alert.alert("Invalid phone", "Phone number must have 10 digits.");
    if (isNaN(Number(rent)) || Number(rent) <= 0)
      return Alert.alert("Invalid rent", "Enter a valid rent amount.");

    const all = await getTenants();
    const dup = all.some(
      (t) => t.room.toLowerCase() === room.trim().toLowerCase() && t.id !== editing?.id
    );
    if (dup) return Alert.alert("Room taken", "Another tenant already has this room.");

    const tenant = { name: name.trim(), room: room.trim(), phone: phone.trim(), rent: Number(rent) };
    if (editing) await updateTenant({ ...editing, ...tenant });
    else await addTenant(tenant);
    navigation.goBack();
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.label}>Full name</Text>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. Kasun Perera" />
      <Text style={s.label}>Room number</Text>
      <TextInput style={s.input} value={room} onChangeText={setRoom} placeholder="e.g. R11" />
      <Text style={s.label}>Phone</Text>
      <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} placeholder="0771234567" />
      <Text style={s.label}>Monthly rent (Rs.)</Text>
      <TextInput style={s.input} value={rent} onChangeText={setRent} keyboardType="numeric" placeholder="e.g. 12000" />
      <TouchableOpacity style={s.btn} onPress={onSave}>
        <Text style={s.btnText}>{editing ? "Update Tenant" : "Save Tenant"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: { fontWeight: "bold", marginBottom: 4, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 14 },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
