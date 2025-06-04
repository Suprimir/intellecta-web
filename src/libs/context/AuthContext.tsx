"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type User = {
  uuid: string;
  username: string;
  email: string;
  rol?: string;
  profilePicture?: string | null;
};

interface AuthContextType {
  user: User | null;
  loadingUser: boolean;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loadingUser: true,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/profile");

        if (response.ok) {
          const userData: User = await response.json();

          setUser({
            uuid: userData.uuid,
            username: userData.username,
            email: userData.email,
            rol: userData.rol,
            profilePicture:
              userData.profilePicture || "/userImages/default.webp",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    checkUser();

    const interval = setInterval(checkUser, 5 * 60 * 1000); // Cada 5 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
