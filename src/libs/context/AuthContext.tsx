"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { verify } from "jsonwebtoken";
import { User } from "@/types/api";

const JWT_SECRET = process.env.JWT_SECRET || "";

// Interfaz simplificada del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Valor predeterminado del contexto
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
};

// Crear el contexto
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Props para el proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTokenFromCookie = (): string | null => {
      if (typeof window === "undefined") return null;

      const value = `; ${document.cookie}`;
      const parts = value.split(`; sessionToken=`);

      if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
      }
      return null;
    };

    const checkUser = () => {
      try {
        const token = getTokenFromCookie();

        if (token) {
          const decodedUser = verify(token, JWT_SECRET);
          const userData = decodedUser as User;
          console.log(userData);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const interval = setInterval(checkUser, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
