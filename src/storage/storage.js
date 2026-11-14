import AsyncStorage from "@react-native-async-storage/async-storage";
import { seedTenants, seedPayments } from "../data/seedData";

const KEYS = { tenants: "nestpay_tenants", payments: "nestpay_payments" };

export const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const todayStr = () => new Date().toISOString().slice(0, 10);

// First launch: save the seed dataset into local storage
export async function initData() {
  const t = await AsyncStorage.getItem(KEYS.tenants);
  if (!t) {
    await AsyncStorage.setItem(KEYS.tenants, JSON.stringify(seedTenants));
    await AsyncStorage.setItem(KEYS.payments, JSON.stringify(seedPayments));
  }
}

export async function getTenants() {
  return JSON.parse((await AsyncStorage.getItem(KEYS.tenants)) || "[]");
}
export async function saveTenants(list) {
  await AsyncStorage.setItem(KEYS.tenants, JSON.stringify(list));
}
export async function getPayments() {
  return JSON.parse((await AsyncStorage.getItem(KEYS.payments)) || "[]");
}
export async function savePayments(list) {
  await AsyncStorage.setItem(KEYS.payments, JSON.stringify(list));
}

export async function addTenant(tenant) {
  const list = await getTenants();
  await saveTenants([...list, { ...tenant, id: "t" + Date.now() }]);
}
export async function updateTenant(tenant) {
  const list = await getTenants();
  await saveTenants(list.map((t) => (t.id === tenant.id ? tenant : t)));
}
export async function deleteTenant(id) {
  const list = await getTenants();
  await saveTenants(list.filter((t) => t.id !== id));
  const pay = await getPayments();
  await savePayments(pay.filter((p) => p.tenantId !== id));
}
export async function addPayment(payment) {
  const list = await getPayments();
  await savePayments([...list, { ...payment, id: "p" + Date.now() }]);
}
export async function deletePayment(id) {
  const list = await getPayments();
  await savePayments(list.filter((p) => p.id !== id));
}

// A tenant is "Paid" if a Rent payment exists for the given month
export const hasPaidRent = (payments, tenantId, month) =>
  payments.some((p) => p.tenantId === tenantId && p.type === "Rent" && p.month === month);
