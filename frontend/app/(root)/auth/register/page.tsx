"use client"

import { register } from "@/https/users/users"
import { RegisterUserType } from "@/types/users"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"

const Page = () => {
    const router = useRouter()
    const [credentials, setCredentials] = useState<RegisterUserType>({
        username: "",
        email: "",
        password: "",
    })
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!credentials.username.trim() || !credentials.email.trim() || !credentials.password.trim()) {
            toast.error("Please fill in all fields.", {
                duration: 5000,
                position: "bottom-right",
            })
            return
        }

        if (credentials.password !== confirmPassword) {
            toast.error("Passwords do not match.", {
                duration: 5000,
                position: "bottom-right",
            })
            return
        }

        setIsSubmitting(true)

        const request = register({
            ...credentials,
            username: credentials.username.trim(),
            email: credentials.email.trim(),
        })

        toast.promise(
            request,
            {
                loading: "Creating account...",
                success: "Account created successfully",
                error: (err) => err.message,
            },
            {
                duration: 5000,
                position: "bottom-right",
            }
        )

        try {
            await request
            router.push("/auth/login")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex items-center justify-center h-screen p-4 lg:p-8">
            <div className="w-full max-w-120 overflow-hidden rounded-2xl border border-[#232f48] bg-[#192233] shadow-2xl relative">
                <div className="h-32 w-full bg-cover bg-center relative banner">
                    <div className="absolute inset-0 bg-linear-to-t from-[#192233] to-transparent"></div>
                </div>
                <div className="px-8 pb-8 -mt-6 relative z-10">
                    <h1 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">Create an account</h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Username</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Enter Username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials((prev) => ({
                                    ...prev,
                                    username: e.target.value,
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Email</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Enter Email"
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Password</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Create a password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Confirm Password</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Confirm password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="w-full h-12 bg-[#135bec] hover:bg-[#1149bc] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 mt-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <div className="mt-8 text-center text-sm text-[#92a4c9]">
                        Already have an account?
                        <Link className="text-[#135bec] hover:text-white font-semibold transition-colors ml-1" href="/auth/login">Sign IN</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page
