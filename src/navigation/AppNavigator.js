import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../screens/DashboardScreen";
import TenantsScreen from "../screens/TenantsScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import TenantDetailScreen from "../screens/TenantDetailScreen";
import AddTenantScreen from "../screens/AddTenantScreen";
import AddPaymentScreen from "../screens/AddPaymentScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = { Dashboard: "home", Tenants: "people", Payments: "cash" };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "NestPay" }} />
      <Tab.Screen name="Tenants" component={TenantsScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: "#fff" }}
      >
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="TenantDetail" component={TenantDetailScreen} options={{ title: "Tenant Details" }} />
        <Stack.Screen name="AddTenant" component={AddTenantScreen} options={{ title: "Add Tenant" }} />
        <Stack.Screen name="AddPayment" component={AddPaymentScreen} options={{ title: "Add Payment" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
