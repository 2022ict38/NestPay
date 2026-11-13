import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import TenantsScreen from "../screens/TenantsScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import TenantDetailScreen from "../screens/TenantDetailScreen";
import AddTenantScreen from "../screens/AddTenantScreen";
import AddPaymentScreen from "../screens/AddPaymentScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tenants" component={TenantsScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="TenantDetail" component={TenantDetailScreen} options={{ title: "Tenant Details" }} />
        <Stack.Screen name="AddTenant" component={AddTenantScreen} options={{ title: "Add Tenant" }} />
        <Stack.Screen name="AddPayment" component={AddPaymentScreen} options={{ title: "Add Payment" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}