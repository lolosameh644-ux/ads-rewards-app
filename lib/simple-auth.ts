import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SimpleUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const STORAGE_KEY = "simple_auth_user";

export async function simpleLogin(email: string, password: string): Promise<SimpleUser> {
  // Simple validation
  if (!email || !password) {
    throw new Error("البريد وكلمة المرور مطلوبان");
  }

  if (!email.includes("@")) {
    throw new Error("البريد الإلكتروني غير صحيح");
  }

  // Create user object
  const user: SimpleUser = {
    id: Math.random().toString(36).substring(7),
    email,
    name: email.split("@")[0],
    isAdmin: email === "youseef500600700800@gmail.com",
  };

  // Save to storage
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function simpleSignup(email: string, password: string, name: string): Promise<SimpleUser> {
  // Simple validation
  if (!email || !password || !name) {
    throw new Error("جميع الحقول مطلوبة");
  }

  if (!email.includes("@")) {
    throw new Error("البريد الإلكتروني غير صحيح");
  }

  if (password.length < 4) {
    throw new Error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
  }

  // Create user object
  const user: SimpleUser = {
    id: Math.random().toString(36).substring(7),
    email,
    name,
    isAdmin: false,
  };

  // Save to storage
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function getStoredUser(): Promise<SimpleUser | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
