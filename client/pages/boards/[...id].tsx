import { Sidebar } from '@/component/common/sidebar';
import * as React from 'react';
import styled from '@emotion/styled'
import { Helmet } from '@/component/common';
// import BoardWrapper from '@/component/common/board';
import { BoardModel } from '@/models/board';
import MainBoard from '@/component/common/main-board';
import { AxiosRequestConfig } from 'axios';
import axiosClient from 'api-client/axios-client';
import { useNotiContext } from '@/component/common/notification';
import { useBoard } from '@/hooks/use-board';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export interface IAppProps {
    data: BoardModel
    success: boolean
}

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function BoardPage () {
  const { notiDispatch } = useNotiContext()
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
  const { dataRes } = useBoard({ url: `/board/${router?.query?.id}`, fetcher, token: session?.user?.token, options: {
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
  return (
    <StyledContainer>
        <Helmet title='Board' />
      <Sidebar />
      <MainBoard board={dataRes?.data} />
    </StyledContainer>
  );
}

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//   const boardId = context?.params?.id as string[]
//   const cookies = new Cookies(context?.req, context?.res)
//   const authCookie = cookies?.get('auth-token')

//   const config: AxiosRequestConfig = {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${authCookie}`
//     },
//   }
//   if(authCookie && validateToken(authCookie || '')) {
//     let resBoard: IAppProps = {
//       data: {},
//       success: false
//     }
//     const res = await axios.get(`http://localhost:3000/api/board/${boardId[0]}`, config).then((res) => res?.data)
//       resBoard['data'] = res?.data
//       resBoard['success'] = res?.success

//       return {
//         props: resBoard
//       }
//     } else {
//       return {
//         redirect: {
//           permanent: false,
//           destination: '/login',
//         },
//         props: {},
//       }
//   }
// }