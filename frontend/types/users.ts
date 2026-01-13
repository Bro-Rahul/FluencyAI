export interface UserType {
    id: string,
    username: string,
    email: string,
    avatar: string | null,
    score: number,
    access_token: string,
    created_at: string,
}


export interface LoginUserType {
    username: string,
    password: string
}


export interface UserHeatMapType {
    total: number,
    date: string
}