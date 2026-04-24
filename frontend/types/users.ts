export interface UserType {
    id: string,
    username: string,
    email: string,
    avatar: string | null,
    score: number,
    access_token: string,
    created_at: string,
    avg: number,
    streak: number,
    total: number
}


export interface LoginUserType {
    username: string,
    password: string
}

export interface RegisterUserType {
    username: string,
    email: string,
    password: string
}

export interface ForgotPasswordRequestType {
    email: string
}

export interface VerifyOtpType {
    email: string
    otp: string
}

export interface ResetPasswordType {
    reset_token: string
    new_password: string
}


export interface UserHeatMapType {
    total: number,
    date: string
}
