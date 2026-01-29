import { firebaseConfig } from "./firebase-config";

// Firebase Realtime Database REST API
class FirebaseDatabase {
  private databaseURL: string;

  constructor() {
    this.databaseURL = firebaseConfig.databaseURL || "";
  }

  // Set data
  async set(path: string, data: any, idToken?: string) {
    try {
      const url = `${this.databaseURL}/${path}.json${idToken ? `?auth=${idToken}` : ""}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to set data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Firebase DB] Set error:", error);
      throw error;
    }
  }

  // Get data
  async get(path: string, idToken?: string) {
    try {
      const url = `${this.databaseURL}/${path}.json${idToken ? `?auth=${idToken}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Firebase DB] Get error:", error);
      throw error;
    }
  }

  // Update data
  async update(path: string, data: any, idToken?: string) {
    try {
      const url = `${this.databaseURL}/${path}.json${idToken ? `?auth=${idToken}` : ""}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Firebase DB] Update error:", error);
      throw error;
    }
  }

  // Delete data
  async delete(path: string, idToken?: string) {
    try {
      const url = `${this.databaseURL}/${path}.json${idToken ? `?auth=${idToken}` : ""}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete data: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("[Firebase DB] Delete error:", error);
      throw error;
    }
  }
}

export const firebaseDB = new FirebaseDatabase();
