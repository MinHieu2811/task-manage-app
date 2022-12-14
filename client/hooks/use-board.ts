import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosResponse } from 'axios'
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
    addBoard: (urlPost: string, newBoard: BoardModel) => Promise<AxiosResponse<void>>
    deleteBoard: (urlDelete: string, idBoard: string) => Promise<AxiosResponse<void>>
}

interface useBoardProps<T> {
    url: string,
    fetcher: (url: string) => Promise<AxiosResponse<T>>,
    // fetcher: Fetcher<BoardModel>
    options?: Partial<PublicConfiguration>
}

export const useBoard = ({url, fetcher, options}: useBoardProps<BoardData>): useBoardRes => {
    const { data, isLoading, isValidating, error, mutate } = useSWR(url, fetcher, options)

    const addBoard = async (urlPost: string, newBoard: BoardModel) => {
        const res = await (await axiosClient.post(`${urlPost}/create`, newBoard)).data
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