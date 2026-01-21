import { LoginUserType, UserHeatMapType } from "@/types/users"
import { signIn } from "next-auth/react"
import { baseURL } from ".."

const USERBASEURL = `${baseURL}/users`

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

export const getUserHeatMap = async (token: string, year: number): Promise<UserHeatMapType[]> => {
    const res = await fetch(`${USERBASEURL}/heat-map/?year=${year}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Can't get the user HeatMap!");
    }

    return res.json();
}