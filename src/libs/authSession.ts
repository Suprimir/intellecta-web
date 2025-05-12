"use client";

import { User } from "@/types/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Definición de tipos para NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      uuid: string;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken: string;
    refreshToken: string;
    fullname: string;
    roles: string[];
    expiresIn?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    fullname: string;
    roles: string[];
    expiresIn: number;
    expiryDate?: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Se requiere email y contraseña");
        }

        try {
          const response = await fetch("/api/profile");
          if (!response.ok) {
            throw new Error("Error al obtener perfil de usuario");
          }

          const userData = await response.json();
          console.log(userData);
          return {
            id: userData.uuid.toString(),
            email: userData.email,
          };
        } catch (error: any) {
          throw new Error(error.message || "Error de autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.fullname = user.fullname;
        token.roles = user.roles;
        token.expiresIn = user.expiresIn || 3600;
        token.expiryDate = Date.now() + token.expiresIn * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uuid = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

// Exportamos NextAuth con las opciones configuradas
export default NextAuth(authOptions);

// Exportamos una función para acceder al usuario actual
export const getServerSession = async () => {
  const response = await fetch("/api/auth/session");
  if (!response.ok) return null;
  return response.json();
};
