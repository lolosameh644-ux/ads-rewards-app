import { useEffect, useState, useCallback } from "react";
import { getStoredUser, logout as simpleLogout, SimpleUser } from "@/lib/simple-auth";

export interface User extends SimpleUser {}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const storedUser = await getStoredUser();
        setUser(storedUser);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to check user");
        setError(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const logout = useCallback(async () => {
    try {
      await simpleLogout();
      setUser(null);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to logout");
      setError(error);
    }
  }, []);

  const isAuthenticated = Boolean(user);
  const isAdmin = isAuthenticated && user && user.email === 'youseef500600700800@gmail.com';

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isGuest: false,
    refresh: async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    },
    logout,
  };
}
