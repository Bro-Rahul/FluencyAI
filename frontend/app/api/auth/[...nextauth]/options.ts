import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { baseURL } from "@/https"

export const options: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 86400,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user as any
            }
            return token
        },

        async session({ session, token }) {
            if (token.user) {
                session.user = token.user
            }
            return session
        },
    },

    providers: [
        CredentialsProvider({
            name: "Speak Up",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const res = await fetch(`${baseURL}/auth/login/`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                })

                const data = await res.json()

                if (!res.ok || !data?.id) {
                    throw new Error(
                        data?.detail || "Invalid username or password"
                    )
                }

                return data
            },
        }),
    ],

    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
    },
}
