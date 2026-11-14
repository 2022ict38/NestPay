import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.chip, active && s.active]}>
      <Text style={[s.text, active && s.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, backgroundColor: "#e8eceb", marginRight: 8, marginBottom: 6 },
  active: { backgroundColor: colors.primary },
  text: { color: colors.text },
  activeText: { color: "#fff", fontWeight: "bold" },
});
