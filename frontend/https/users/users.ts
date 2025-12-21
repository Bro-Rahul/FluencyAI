import { LoginUserType } from "@/types/users"
import { signIn } from "next-auth/react"

export const login = async (crediencial: LoginUserType) => {
    const res = await signIn("credentials", {
        ...crediencial,
        redirect: false,
    })

    if (!res?.ok) {
        throw new Error(res?.error || "Login failed")
    }
    return res
}