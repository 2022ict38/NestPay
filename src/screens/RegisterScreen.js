import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { registerUser, setSession } from "../storage/authStorage";
import { colors } from "../theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm)
      return Alert.alert("Missing data", "Please fill in all fields.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return Alert.alert("Invalid email", "Enter a valid email address.");
    if (password.length < 6)
      return Alert.alert("Weak password", "Password must be at least 6 characters.");
    if (password !== confirm)
      return Alert.alert("Mismatch", "Passwords do not match.");

    const result = await registerUser({ name, email, password });
    if (!result.ok) return Alert.alert("Registration failed", result.message);

    await setSession(result.user.id);

    Alert.alert("Success", "Account created!", [
      { text: "OK", onPress: () => navigation.replace("Main") },
    ]);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.logo}>🏠 NestPay</Text>
      <Text style={s.subtitle}>Create your account</Text>

      <Text style={s.label}>Full name</Text>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" />

      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="you@example.com"
      />

      <Text style={s.label}>Password</Text>
      <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />

      <Text style={s.label}>Confirm password</Text>
      <TextInput style={s.input} value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Re-enter password" />

      <TouchableOpacity style={s.btn} onPress={onRegister}>
        <Text style={s.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", color: colors.primary, marginTop: 18, fontWeight: "bold" }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60 },
  logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: colors.primary },
  subtitle: { textAlign: "center", color: colors.sub, marginBottom: 24, marginTop: 4 },
  label: { fontWeight: "bold", marginBottom: 4, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 14 },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});