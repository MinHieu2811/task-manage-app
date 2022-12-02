import { Sidebar } from '@/component/common/sidebar';
import { db } from 'config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import * as React from 'react';
import styled from '@emotion/styled'
import { Helmet } from '@/component/common';
import BoardWrapper from '@/component/common/board';
import { BoardModel } from '@/models/board';

export interface IAppProps {
    board: BoardModel
    id: string
}

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function App ({board, id}: IAppProps) {
    console.log(board)
  return (
    <StyledContainer>
        <Helmet title='Board' />
      <Sidebar />
      <BoardWrapper boardData={board} boardId={id} />
    </StyledContainer>
  );
}

export const getServerSideProps = async (context: any) => {
    const boardId = context?.params?.id
    const docRef = doc(db, 'boards', boardId[0])
    const board = await getDoc(docRef)
    return {
        props: {
            board: board?.data(),
            id: board?.id
        }
    }
}
