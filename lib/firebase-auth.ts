import { firebaseConfig, validateFirebaseConfig } from "./firebase-config";

// Simple Firebase Auth implementation using REST API
class FirebaseAuthService {
  private apiKey: string;
  private authDomain: string;

  constructor() {
    if (!validateFirebaseConfig()) {
      console.warn("[Firebase] Config validation failed");
    }
    this.apiKey = firebaseConfig.apiKey;
    this.authDomain = firebaseConfig.authDomain;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string) {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            displayName,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Sign up failed");
      }

      return await response.json();
    } catch (error) {
      console.error("[Firebase] Sign up error:", error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Sign in failed");
      }

      return await response.json();
    } catch (error) {
      console.error("[Firebase] Sign in error:", error);
      throw error;
    }
  }

  // Get user info
  async getUserInfo(idToken: string) {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get user info");
      }

      const data = await response.json();
      return data.users?.[0];
    } catch (error) {
      console.error("[Firebase] Get user info error:", error);
      throw error;
    }
  }
}

export const firebaseAuth = new FirebaseAuthService();
