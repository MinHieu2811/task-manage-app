import { addSections, setSection } from '@/toolkit/features/sectionSlice'
import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { PublicConfiguration } from 'swr/_internal'
import { SectionData, SectionModel } from '../models'

interface boardPost {
    boardId: string
}
interface useBoardRes {
    data: SectionData | undefined | unknown
    isValidating: boolean
    isLoading: boolean
    error: AxiosError
    addSection: (boardId: boardPost) => Promise<AxiosResponse<void>>
}

interface useSectionProps<T> {
    url: string,
    fetcher: (url: string) => Promise<AxiosResponse<any>>,
    options?: PublicConfiguration
}

export const useSection = ({url, fetcher, options}: useSectionProps<SectionModel>): useBoardRes => {
    const dispatch = useDispatch()
    const { data, isLoading, isValidating, error, mutate } = useSWR(url, fetcher, options)

    // useEffect(() => {
    //     !isLoading && dispatch(setSection(data))
    // }, [data, dispatch, isLoading])

    const addSection = async (boardId: boardPost) => {
        const res = await (await axiosClient.post('/section/create', boardId)).data
        res?.success && mutate(url)
        return res
    }

    return {
        data,
        isLoading,
        isValidating,
        error,
        addSection
    }
}