import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { PublicConfiguration } from 'swr/_internal'
import { BoardData } from '../models'
import { addBoards, setBoards } from 'redux/features/boardSlice'

interface useBoardRes {
    data: BoardData | undefined | unknown
    isValidating: boolean
    isLoading: boolean
    error: AxiosError
    addBoard: (urlPost: string, newBoard: BoardData) => Promise<AxiosResponse<void>>
}

interface useBoardProps<T> {
    url: string,
    fetcher: (url: string) => Promise<AxiosResponse<any>>,
    options?: PublicConfiguration
}

export const useBoard = ({url, fetcher, options}: useBoardProps<BoardData>): useBoardRes => {
    const dispatch = useDispatch()
    const { data, isLoading, isValidating, error, mutate } = useSWR(url, fetcher, options)
    useEffect(() => {
        dispatch(setBoards(data))
    }, [data, dispatch])

    const addBoard = async (urlPost: string, newBoard: BoardData) => {
        const res = await (await axiosClient.post(`${urlPost}/create`, newBoard)).data
        res?.success && mutate(url)
        dispatch(addBoards(newBoard))
        return res
    }

    return {
        data,
        isLoading,
        isValidating,
        error,
        addBoard
    }
}