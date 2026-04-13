import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { baseURL } from "@/https"


export const options: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 86400,
    },

    callbacks: {
        async signIn({ user, account }) {
            if (!account || account.provider === "credentials") {
                return true
            }

            if (!user.email) {
                throw new Error("Social login failed because the provider did not return an email.")
            }

            const response = await fetch(`${baseURL}/auth/social-login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    username: user.name || user.email?.split("@")[0] || "user",
                    avatar: user.image,
                    provider: account.provider,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data?.id) {
                throw new Error(data?.detail || "Social login failed")
            }

            Object.assign(user, data)
            return true
        },

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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:email",
                },
            },
        }),

        CredentialsProvider({
            name: "Speak Up",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const res = await fetch(`${baseURL}/auth/login/`, {
                    method: "POST",
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
