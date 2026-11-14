import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { loginUser } from "../storage/authStorage";
import { colors } from "../theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    if (!email.trim() || !password)
      return Alert.alert("Missing data", "Enter your email and password.");

    const result = await loginUser(email, password);
    if (!result.ok) return Alert.alert("Login failed", result.message);

    navigation.replace("Main");
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.logo}>🏠 NestPay</Text>
      <Text style={s.subtitle}>Login to manage your boarding house</Text>

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
      <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" />

      <TouchableOpacity style={s.btn} onPress={onLogin}>
        <Text style={s.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={s.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 80 },
  logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: colors.primary },
  subtitle: { textAlign: "center", color: colors.sub, marginBottom: 28, marginTop: 4 },
  label: { fontWeight: "bold", marginBottom: 4, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 14 },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", color: colors.primary, marginTop: 18, fontWeight: "bold" },
});