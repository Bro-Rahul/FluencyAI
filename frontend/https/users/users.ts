import {
    ForgotPasswordRequestType,
    LoginUserType,
    RegisterUserType,
    ResetPasswordType,
    UserHeatMapType,
    VerifyOtpType
} from "@/types/users"
import { signIn } from "next-auth/react"
import { baseURL } from ".."

const USERBASEURL = `${baseURL}/users`
const AUTHBASEURL = `${baseURL}/auth`

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

export const register = async (credentials: RegisterUserType) => {
    const res = await fetch(`${AUTHBASEURL}/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.detail ?? "Registration failed")
    }

    return data
}

export const requestPasswordOtp = async (payload: ForgotPasswordRequestType) => {
    const res = await fetch(`${AUTHBASEURL}/forgot-password/request-otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.detail ?? "Unable to send OTP")
    }

    return data
}

export const verifyPasswordOtp = async (payload: VerifyOtpType): Promise<{ reset_token: string }> => {
    const res = await fetch(`${AUTHBASEURL}/forgot-password/verify-otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.detail ?? "Invalid OTP")
    }

    return data
}

export const resetPassword = async (payload: ResetPasswordType) => {
    const res = await fetch(`${AUTHBASEURL}/forgot-password/reset/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data?.detail ?? "Unable to reset password")
    }

    return data
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
