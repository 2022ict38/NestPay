import AsyncStorage from "@react-native-async-storage/async-storage";
import { seedTenants, seedPayments } from "../data/seedData";

const KEYS = { tenants: "nestpay_tenants", payments: "nestpay_payments" };

// පළවෙනි වතාවේ seed data save කරනවා
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