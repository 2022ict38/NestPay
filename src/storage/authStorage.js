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

const SESSION_KEY = "nestpay_session";

export async function loginUser(email, password) {
  const users = await getUsers();
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, message: "Incorrect email or password." };
  await AsyncStorage.setItem(SESSION_KEY, user.id);
  return { ok: true, user };
}

export async function setSession(userId) {
  await AsyncStorage.setItem(SESSION_KEY, userId);
}

export async function getSessionUser() {
  const id = await AsyncStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}