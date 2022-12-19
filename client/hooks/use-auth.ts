import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosResponse } from 'axios'
import useSWR from 'swr'
import { PublicConfiguration } from 'swr/_internal'
import { BoardData, UserLogin, UserRegister } from '@/models/index'
import { User } from '@/models/index'

interface useAuthRes {
    data: User | undefined | unknown
    isValidating: boolean
    isLoading: boolean
    error: AxiosError
    getUser: (url: string) => Promise<AxiosResponse<User>>
    register: (userRegister: UserRegister) => Promise<AxiosResponse<void>>
    login: (userLogin: UserLogin) => Promise<AxiosResponse<void>>
}

interface useAuthProps<T> {
    url: string,
    fetcher: (url: string) => Promise<AxiosResponse<any>>,
    options?: Partial<PublicConfiguration>
}

export const useAuth = ({url, fetcher, options}: useAuthProps<BoardData>): useAuthRes => {
    const { data, isLoading, isValidating, error, mutate } = useSWR(url, fetcher, options)


    const login = async (user: UserLogin) => {
        const res = await (await axiosClient.post(`/auth/login`, user)).data
        res?.success && mutate()
        return res
    }

    const register = async (user: UserRegister) => {
        const res = await (await axiosClient.post(`/auth/register`, user)).data
        res?.success && mutate(url)
        return res
    }

    const getUser = async () => {
        const res = await (await axiosClient.get(`/user`))?.data
        res?.email && mutate(url)
        return res
    }

    return {
        data,
        isLoading,
        isValidating,
        error,
        login,
        register,
        getUser
    }
}