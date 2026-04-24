"use client"

import {
    requestPasswordOtp,
    resetPassword,
    verifyPasswordOtp,
} from "@/https/users/users"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"

type Step = "request" | "verify" | "reset"

const Page = () => {
    const router = useRouter()
    const [step, setStep] = useState<Step>("request")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [resetToken, setResetToken] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error("Please enter your email address.", {
                duration: 5000,
                position: "bottom-right",
            })
            return
        }

        setIsSubmitting(true)
        const request = requestPasswordOtp({ email: email.trim() })

        toast.promise(
            request,
            {
                loading: "Sending OTP...",
                success: "If the account exists, the OTP has been sent.",
                error: (err) => err.message,
            },
            {
                duration: 5000,
                position: "bottom-right",
            }
        )

        try {
            await request
            setStep("verify")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!otp.trim()) {
            toast.error("Please enter the OTP.", {
                duration: 5000,
                position: "bottom-right",
            })
            return
        }

        setIsSubmitting(true)
        const request = verifyPasswordOtp({ email: email.trim(), otp: otp.trim() })

        toast.promise(
            request,
            {
                loading: "Verifying OTP...",
                success: "OTP verified successfully.",
                error: (err) => err.message,
            },
            {
                duration: 5000,
                position: "bottom-right",
            }
        )

        try {
            const data = await request
            setResetToken(data.reset_token)
            setStep("reset")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.error("Please fill in both password fields.", {
                duration: 5000,
                position: "bottom-right",
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.", {
                duration: 5000,
                position: "bottom-right",
            })
            return
        }

        setIsSubmitting(true)
        const request = resetPassword({
            reset_token: resetToken,
            new_password: newPassword,
        })

        toast.promise(
            request,
            {
                loading: "Resetting password...",
                success: "Password updated successfully.",
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
                    <h1 className="text-3xl font-bold text-white text-center mb-3 drop-shadow-lg">Reset your password</h1>
                    <p className="text-center text-sm text-[#92a4c9] mb-8">
                        {step === "request" && "Enter your email to receive a one-time password."}
                        {step === "verify" && "Enter the OTP sent to your email address."}
                        {step === "reset" && "Set a new password for your account."}
                    </p>

                    {step === "request" && (
                        <form className="space-y-4" onSubmit={handleRequestOtp}>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white pl-1">Email</label>
                                <input
                                    className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                className="w-full h-12 bg-[#135bec] hover:bg-[#1149bc] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 mt-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {step === "verify" && (
                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white pl-1">Email</label>
                                <input
                                    className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg text-[#92a4c9]"
                                    type="email"
                                    value={email}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white pl-1">OTP</label>
                                <input
                                    className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                    placeholder="Enter OTP"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            <button
                                className="w-full h-12 bg-[#135bec] hover:bg-[#1149bc] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 mt-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    )}

                    {step === "reset" && (
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white pl-1">New Password</label>
                                <input
                                    className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                    placeholder="Enter new password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white pl-1">Confirm Password</label>
                                <input
                                    className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                    placeholder="Confirm new password"
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
                                {isSubmitting ? "Updating..." : "Set New Password"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-[#92a4c9]">
                        Remembered your password?
                        <Link className="text-[#135bec] hover:text-white font-semibold transition-colors ml-1" href="/auth/login">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page
