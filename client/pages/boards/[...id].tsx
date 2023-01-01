import { Sidebar } from '@/component/common/sidebar';
import * as React from 'react';
import styled from '@emotion/styled'
import { Helmet } from '@/component/common';
// import BoardWrapper from '@/component/common/board';
import { BoardModel } from '@/models/board';
import { setSection } from 'redux/features/sectionSlice';
import MainBoard from '@/component/common/main-board';
import axios, { AxiosRequestConfig } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'cookies';
import { validateToken } from '@/utils/sessions';

export interface IAppProps {
    data: BoardModel
    success: boolean
}

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function BoardPage ({data}: IAppProps) {
  return (
    <StyledContainer>
        <Helmet title='Board' />
      <Sidebar />
      {/* <BoardWrapper boardData={board} boardId={id} /> */}
      <MainBoard board={data} />
    </StyledContainer>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const boardId = context?.params?.id as string[]
  const cookies = new Cookies(context?.req, context?.res)
  const authCookie = cookies?.get('auth-token')

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authCookie}`
    },
  }
  if(authCookie && validateToken(authCookie || '')) {
    let resBoard: IAppProps = {
      data: {},
      success: false
    }
    const res = await axios.get(`http://localhost:3000/api/board/${boardId[0]}`, config).then((res) => res?.data)
      resBoard['data'] = res?.data
      resBoard['success'] = res?.success

      return {
        props: resBoard
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
        props: {},
      }
  }
}