import { Sidebar } from '@/component/common/sidebar';
import * as React from 'react';
import styled from '@emotion/styled'
import { Helmet } from '@/component/common';
// import BoardWrapper from '@/component/common/board';
import { BoardModel, SectionModel } from '@/models/board';
import { useDispatch } from 'react-redux';
import { setSection } from 'redux/features/sectionSlice';
import MainBoard from '@/component/common/main-board';
import axios, { AxiosRequestConfig } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'cookies';

export interface IAppProps {
    resBoard: any
}

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function BoardPage ({resBoard}: IAppProps) {
  console.log('board', resBoard?.data)
  return (
    <StyledContainer>
        <Helmet title='Board' />
      <Sidebar />
      {/* <BoardWrapper boardData={board} boardId={id} /> */}
      <MainBoard board={resBoard?.data} />
    </StyledContainer>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const boardId = context?.params?.id as string[]
  const cookies = new Cookies(context?.req, context?.res)

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cookies?.get('auth-token')}`
    },
  }
  const resBoard = await axios.get(`http://localhost:3000/api/board/${boardId[0]}`, config).then((res) => res?.data)
  return {
    props: {resBoard}
  }
}