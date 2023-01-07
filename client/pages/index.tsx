import styled from '@emotion/styled'
import { Box, Button } from '@mui/material'
import { Sidebar } from '@/component/common/sidebar'
import { Helmet } from '@/component/common'
import { generateId } from '@/utils/generateId'
import { useBoard } from '@/hooks/use-board'
import axiosClient from 'api-client/axios-client'
import { BoardModel, User } from '../models'
import Cookies from 'cookies'
import { getSession, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { AxiosRequestConfig } from 'axios'
import { useNotiContext } from '@/component/common/notification'
import { useRouter } from 'next/router'

const StyledContainer = styled(Box)`
  display: flex;
  margin: 0;
  max-width: 100vw;
  align-items: center;
  padding: 0px;
`

const Home = () => {
  // const { data } = useTokenContext()
  const {notiDispatch} = useNotiContext()
  const { data: session } = useSession()
  const router = useRouter()
  const fetcher = async (url: string, token?: string) => {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token ? token : ''}`
      }
    }
    return await axiosClient.get(url, config)
  }
  const { dataRes, addBoard } = useBoard({ url: `/board`, fetcher, token: session?.user?.token, options: {
    refreshInterval: 2000*5,
    shouldRetryOnError(err) {
        notiDispatch({
          type: 'REMOVE_ALL_AND_ADD',
          payload: {
            type: "is-danger",
            content: `Error: ${err}`
          }
        })

        return false
    },
  }})

  useEffect(() => {
    if(dataRes?.data?.length) {
      router?.replace(`boards/${dataRes?.data[0]._id}`)
    }
  }, [dataRes?.data, router])
  return (
    <StyledContainer>
      <Helmet title="Taskido" />
      <Sidebar />
      <Box
        sx={{
          width: 'calc(100vw - 250px)',
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1c1b22',
        }}
      >
        <Button variant="outlined" color="success" onClick={addBoard}>
          Click here to create your first board
        </Button>
      </Box>
    </StyledContainer>
  )
}

export default Home
