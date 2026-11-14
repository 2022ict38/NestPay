import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { initData } from "./src/storage/storage";

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initData().then(() => setReady(true));
  }, []);
  if (!ready)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#2a9d8f" />
      </View>
    );
  return <AppNavigator />;
}
