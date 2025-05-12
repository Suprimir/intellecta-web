"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Definición del tipo de usuario
type User = {
  uuid: string;
  username: string;
  email: string;
  rol?: string;
};

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para verificar si hay un usuario autenticado
    const checkUser = async () => {
      try {
        const response = await fetch("/api/profile");

        if (response.ok) {
          const userData: User = await response.json();

          // Establecer el usuario si la verificación es exitosa
          setUser({
            uuid: userData.uuid,
            username: userData.username,
            email: userData.email,
            rol: userData.rol,
          });
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

    // Verificar usuario al cargar la página
    checkUser();

    // Opcional: Agregar un evento para verificar la cookie periódicamente
    const interval = setInterval(checkUser, 5 * 60 * 1000); // Cada 5 minutos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Proporcionar el contexto con el usuario y el estado de carga
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
