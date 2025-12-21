export interface UserType {
    id: string,
    username: string,
    email: string,
    avatar: string | null,
    score: number,
    access_token: string,
}


export interface LoginUserType {
    username: string,
    password: string
}
