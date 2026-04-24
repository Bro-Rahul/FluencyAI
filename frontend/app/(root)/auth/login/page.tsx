"use client"
import svg from "@/constants/svgs"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { LoginUserType } from "@/types/users"
import { login } from "@/https/users/users"
import { signIn } from "next-auth/react"


const Page = () => {
    const router = useRouter();
    const [credencials, setCredencials] = useState<LoginUserType>({
        password: "",
        username: ""
    });


    const handleSubmit = async () => {
        const request = login(credencials)

        toast.promise(
            request,
            {
                loading: "Logging in...",
                success: "Account logged in",
                error: (err) => err.message,
            },
            {
                duration: 5000,
                position: "bottom-right",
            }
        )

        try {
            await request
            router.push("/")
        } catch {

        }
    }

    const handleSocialLogin = async (provider: "google" | "github") => {
        const result = await signIn(provider, {
            callbackUrl: "/",
        })

        if (result?.error) {
            toast.error(result.error, {
                duration: 5000,
                position: "bottom-right",
            })
        }
    }



    return (
        <main className="flex items-center justify-center h-screen p-4 lg:p-8">
            <div
                className="w-full max-w-120 bg-[#192233] rounded-2xl border border-[#232f48] shadow-2xl overflow-hidden relative">
                <div className="h-32 w-full bg-cover bg-center relative banner">
                    <div className="absolute inset-0 bg-linear-to-t from-[#192233] to-transparent"></div>
                </div>
                <div className="px-8 pb-8 -mt-6 relative z-10">
                    <h1 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">LogIn an account</h1>
                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => handleSocialLogin("google")}
                            className="group flex items-center justify-center w-full h-12 px-4 bg-[#232f48] hover:bg-[#2c3b59] border border-[#324467] rounded-lg transition-all duration-200 ease-in-out font-medium text-sm text-white shadow-sm hover:shadow-md hover:border-[#4a5f8a]">
                            <Image src={svg.googleSVG} alt="google icons" className="mr-2" />
                            Sign in with Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin("github")}
                            className="group flex items-center justify-center w-full h-12 px-4 bg-[#232f48] hover:bg-[#2c3b59] border border-[#324467] rounded-lg transition-all duration-200 ease-in-out font-medium text-sm text-white shadow-sm hover:shadow-md hover:border-[#4a5f8a]">
                            <Image src={svg.githubSVG} alt="github icons" className="mr-2" />
                            Sign in with GitHub
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Username</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Enter a Username"
                                type="text"
                                onChange={e => setCredencials(pre => ({
                                    ...pre,
                                    username: e.target.value
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white pl-1">Password</label>
                            <input
                                className="w-full h-12 px-4 bg-[#111722] border border-[#324467] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent text-white placeholder-[#586c91] transition-all"
                                placeholder="Enter a password"
                                type="password"
                                onChange={e => setCredencials(pre => ({
                                    ...pre,
                                    password: e.target.value
                                }))}
                            />
                        </div>
                        <div className="text-right">
                            <Link
                                className="text-sm font-medium text-[#92a4c9] transition-colors hover:text-white"
                                href="/auth/forgot-password"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            className="w-full h-12 bg-[#135bec] hover:bg-[#1149bc] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 mt-2 cursor-pointer"
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    </div>
                    <div className="mt-8 text-center text-sm text-[#92a4c9]">
                        Don&apos;t have an account?
                        <Link className="text-[#135bec] hover:text-white font-semibold transition-colors ml-1" href="/auth/register">Sign
                            Up</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page
