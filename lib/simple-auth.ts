import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";

export interface SimpleUser {
  id: number;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  lastSignedIn: Date;
}

const STORAGE_KEY = "simple_auth_user";
const TOKEN_KEY = "simple_auth_token";



export async function simpleLogin(email: string, password: string): Promise<SimpleUser> {
  if (!email || !password) {
    throw new Error("البريد وكلمة المرور مطلوبان");
  }

  if (!email.includes("@")) {
    throw new Error("البريد الإلكتروني غير صحيح");
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    if (!data.user) {
      throw new Error("Failed to login");
    }

    const user: SimpleUser = {
      ...data.user,
      lastSignedIn: new Date(data.user.lastSignedIn),
      role: (data.user.email === 'youseef500600700800@gmail.com' || data.user.role === 'admin') ? 'admin' : 'user'
    };

    if (data.token) {
      if (Platform.OS === "web") {
        window.localStorage.setItem(TOKEN_KEY, data.token);
      } else {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
      }
    }

    if (Platform.OS === "web") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  } catch (error) {
    console.error("[Auth] Login error:", error);
    throw error instanceof Error ? error : new Error("Login failed");
  }
}

export async function simpleSignup(email: string, password: string, name: string): Promise<SimpleUser> {
  if (!email || !password || !name) {
    throw new Error("جميع الحقول مطلوبة");
  }

  if (!email.includes("@")) {
    throw new Error("البريد الإلكتروني غير صحيح");
  }

  if (password.length < 4) {
    throw new Error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }

    const data = await response.json();

    if (!data.user) {
      throw new Error("Failed to signup");
    }

    const user: SimpleUser = {
      ...data.user,
      lastSignedIn: new Date(data.user.lastSignedIn),
      role: (data.user.email === 'youseef500600700800@gmail.com' || data.user.role === 'admin') ? 'admin' : 'user'
    };

    if (data.token) {
      if (Platform.OS === "web") {
        window.localStorage.setItem(TOKEN_KEY, data.token);
      } else {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
      }
    }

    if (Platform.OS === "web") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    return user;
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    throw error instanceof Error ? error : new Error("Signup failed");
  }
}

export async function getStoredUser(): Promise<SimpleUser | null> {
  try {
    let data: string | null = null;

    if (Platform.OS === "web") {
      data = window.localStorage.getItem(STORAGE_KEY);
    } else {
      data = await AsyncStorage.getItem(STORAGE_KEY);
    }

    if (!data) return null;

    const user = JSON.parse(data);
    if (user.lastSignedIn && typeof user.lastSignedIn === "string") {
      user.lastSignedIn = new Date(user.lastSignedIn);
    }
    return user;
  } catch {
    return null;
  }
}

export async function getStoredToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return window.localStorage.getItem(TOKEN_KEY);
    } else {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  try {
    await fetch(`${getApiBaseUrl()}/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("[Auth] Logout API error:", error);
  }
}
