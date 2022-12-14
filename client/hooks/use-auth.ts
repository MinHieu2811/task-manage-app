import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosResponse } from 'axios'
import useSWR from 'swr'
import { PublicConfiguration } from 'swr/_internal'
import { BoardData, UserLogin, UserRegister } from '@/models/index'
import { User } from '@/models/index'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useNotiContext } from '@/component/common/notification'

interface useAuthRes {
    data: User | undefined | unknown
    isValidating: boolean
    isLoading: boolean
    error: AxiosError
    getUser: (url: string) => Promise<AxiosResponse<User>>
    register: (userRegister: UserRegister, fn?: Promise<boolean>) => Promise<AxiosResponse<void>>
    login: (userLogin: UserLogin, fn?: Promise<boolean>) => Promise<AxiosResponse<void>>
    logout: (fn?: Promise<boolean>) => void
}

interface useAuthProps<T> {
    url: string,
    fetcher: (url: string) => Promise<AxiosResponse<T>>,
    options?: Partial<PublicConfiguration>
}

export const useAuth = ({url, fetcher, options}: useAuthProps<User>, redirectTo: string = '', redirectIfFound: boolean = false): useAuthRes => {
    const router = useRouter()
    const { notiDispatch } = useNotiContext()
    const { data, isLoading, isValidating, error, mutate } = useSWR(url, fetcher, options)

    useEffect(() => {
      if(!redirectTo || !data) return
      if (
        (redirectTo && !redirectIfFound && !data) ||
        (redirectIfFound && data)
      ) {
        router.push(redirectTo)
      }
    }, [data, redirectIfFound, redirectTo, router])
    
    const login = async (user: UserLogin, fn?: Promise<boolean>) => {
        const res = await axiosClient.post(`/auth/login`, user).then((res) => {
            console.log(res)
            return res?.data
        })
        if(res?.success && fn) {
            fn
        }
        notiDispatch({
            type: 'REMOVE_ALL_AND_ADD',
            payload: {
                content: 'Logged in successfully!',
                type: 'is-success',
            },
        })
        res?.success && mutate(url)
        return res
    }

    const register = async (user: UserRegister, fn?: Promise<boolean>) => {
        const res = await (await axiosClient.post(`/auth/register`, user)).data
        res?.success && mutate(url)
        return res
    }

    const getUser = async () => {
        const res = await (await axiosClient.get(`/user`))?.data
        res?.email && mutate(url)
        return res
    }

    const logout = async (fn?: Promise<boolean>) => {
        await axiosClient.post('/auth/logout').then((res) => {
            fn && fn
            notiDispatch({
                type: 'REMOVE_ALL_AND_ADD',
                payload: {
                    content: 'Signed out successfully!',
                    type: 'is-success',
                },
            })
        })
    }

    return {
        data,
        isLoading,
        isValidating,
        error,
        login,
        register,
        getUser,
        logout
    }
}