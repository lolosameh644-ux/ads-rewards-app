// Firebase Configuration
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
};

// Validate Firebase config
export function validateFirebaseConfig(): boolean {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "databaseURL",
    "projectId",
  ] as const;

  for (const field of requiredFields) {
    if (!firebaseConfig[field]) {
      console.warn(`[Firebase] Missing ${field}`);
      return false;
    }
  }

  return true;
}
