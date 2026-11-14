import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "nestpay_users";

export async function getUsers() {
  return JSON.parse((await AsyncStorage.getItem(USERS_KEY)) || "[]");
}

export async function registerUser({ name, email, password }) {
  const users = await getUsers();
  const mail = email.trim().toLowerCase();

  if (users.some((u) => u.email === mail)) {
    return { ok: false, message: "This email is already registered." };
  }

  const user = { id: "u" + Date.now(), name: name.trim(), email: mail, password };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return { ok: true, user };
}