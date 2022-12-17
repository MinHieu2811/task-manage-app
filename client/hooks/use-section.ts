import { addSections, setSection } from '@/toolkit/features/sectionSlice'
import axiosClient from 'api-client/axios-client'
import { AxiosError, AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { PublicConfiguration } from 'swr/_internal'
import { SectionData } from '../models'

interface useBoardRes {
    data: SectionData | undefined | unknown
    isValidating: boolean
    isLoading: boolean
    error: AxiosError
    addSection: (urlPost: string, newSection: SectionData) => Promise<AxiosResponse<void>>
}

interface useSectionProps<T> {
    url: string,
    fetcher: (url: string) => Promise<AxiosResponse<any>>,
    options?: PublicConfiguration
}

export const useSection = ({url, fetcher, options}: useSectionProps<SectionData>): useBoardRes => {
    const dispatch = useDispatch()
    const { data, isLoading, isValidating, error, mutate } = useSWR(url, fetcher, options)

    useEffect(() => {
        !isLoading && dispatch(setSection(data))
    }, [data, dispatch, isLoading])

    const addSection = async (urlPost: string, newSection: SectionData) => {
        const res = await (await axiosClient.post(`${urlPost}/create`, newSection)).data
        res?.success && mutate(url)
        dispatch(addSections(newSection))
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