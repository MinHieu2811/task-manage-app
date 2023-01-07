import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { Fetcher, PublicConfiguration } from 'swr/_internal'
import { BoardData, BoardModel } from '../models'
import { addBoards, removeBoard, setBoards } from 'redux/features/boardSlice'

interface useBoardRes {
    dataRes: BoardData | undefined 
    isValidating: boolean
    isLoading: boolean
    error: AxiosError
    addBoard: () => Promise<AxiosResponse<void>>
    deleteBoard: (urlDelete: string, idBoard: string) => Promise<AxiosResponse<void>>
}

interface useBoardProps<T> {
    url: string
    fetcher: (url: string, token?: string) => Promise<AxiosResponse<T>>
    // fetcher: Fetcher<BoardModel>
    options?: Partial<PublicConfiguration>
    token?: string
}

export const useBoard = ({url, fetcher, options, token}: useBoardProps<BoardData>): useBoardRes => {
    const { data, isLoading, isValidating, error, mutate } = useSWR(token && token?.length > 0 ? [url, token] : url, ([url, token]) => fetcher(url, token), options)
    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const addBoard = async () => {
        const res = await axiosClient.post(`http://localhost:3000/api/board`, undefined, config).then((res) => res?.data)
        res?.success && mutate()
        return res
    }

    const deleteBoard = async (urlDelete: string, idBoard: string) => {
        const res = await (await axiosClient.delete(`${urlDelete}`)).data
        res?.success && mutate(url)
        return res
    }
    const dataRes: BoardData = data as BoardData

    return {
        dataRes,
        isLoading,
        isValidating,
        error,
        addBoard,
        deleteBoard
    }
}