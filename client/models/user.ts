export interface User {
    id: string
    email: string
    username: string
    authenticated?: boolean
}

export interface UserRegister {
    email: string
    username: string
    password: string
}

export interface UserLogin {
    email: string
    password: string
}