import { useState, useCallback } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getSessionUser, updateUser, logout } from "../storage/authStorage";
import { getTenants, getPayments } from "../storage/storage";
import { colors } from "../theme";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [counts, setCounts] = useState({ tenants: 0, payments: 0 });

  useFocusEffect(
    useCallback(() => {
      getSessionUser().then((u) => {
        setUser(u);
        if (u) { setName(u.name); setEmail(u.email); }
      });
      Promise.all([getTenants(), getPayments()]).then(([t, p]) =>
        setCounts({ tenants: t.length, payments: p.length })
      );
    }, [])
  );

  const onSave = async () => {
    if (!name.trim() || !email.trim())
      return Alert.alert("Missing data", "Name and email are required.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return Alert.alert("Invalid email", "Enter a valid email address.");
    if (password && password.length < 6)
      return Alert.alert("Weak password", "New password must be at least 6 characters.");

    const result = await updateUser(user.id, { name, email, password });
    if (!result.ok) return Alert.alert("Update failed", result.message);

    setUser(result.user);
    setPassword("");
    setEditing(false);
    Alert.alert("Saved", "Profile updated.");
  };

  const onLogout = () =>
    Alert.alert("Logout", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.getParent().reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);

  if (!user) return <View style={s.container}><Text style={{ padding: 20 }}>Loading...</Text></View>;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <View style={s.avatarBox}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={s.name}>{user.name}</Text>
        <Text style={s.email}>{user.email}</Text>
      </View>

      <View style={s.row}>
        <View style={s.box}>
          <Text style={s.big}>{counts.tenants}</Text>
          <Text style={s.label}>Tenants</Text>
        </View>
        <View style={s.box}>
          <Text style={s.big}>{counts.payments}</Text>
          <Text style={s.label}>Payments</Text>
        </View>
      </View>

      {editing ? (
        <View style={s.card}>
          <Text style={s.fieldLabel}>Full name</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} />
          <Text style={s.fieldLabel}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Text style={s.fieldLabel}>New password (optional)</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Leave empty to keep current" />
          <View style={s.row}>
            <TouchableOpacity style={[s.btn, { backgroundColor: colors.primary }]} onPress={onSave}>
              <Text style={s.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: colors.sub }]}
              onPress={() => { setEditing(false); setName(user.name); setEmail(user.email); setPassword(""); }}
            >
              <Text style={s.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={[s.btn, { backgroundColor: colors.warn, marginHorizontal: 0 }]} onPress={() => setEditing(true)}>
          <Text style={s.btnText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[s.btn, { backgroundColor: colors.danger, marginHorizontal: 0, marginTop: 12 }]} onPress={onLogout}>
        <Text style={s.btnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  avatarBox: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: colors.text },
  email: { color: colors.sub, marginTop: 2 },
  row: { flexDirection: "row", marginBottom: 12 },
  box: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, marginHorizontal: 4, alignItems: "center" },
  big: { fontSize: 24, fontWeight: "bold", color: colors.primary },
  label: { color: colors.sub },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14 },
  fieldLabel: { fontWeight: "bold", marginBottom: 4, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 12 },
  btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: "center", marginHorizontal: 4 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});