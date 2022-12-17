import { Sidebar } from '@/component/common/sidebar';
import { db } from 'config/firebase';
import * as React from 'react';
import styled from '@emotion/styled'
import { Helmet } from '@/component/common';
// import BoardWrapper from '@/component/common/board';
import { BoardModel, SectionData, SectionModel } from '@/models/board';
import { useDispatch } from 'react-redux';
import { setSection } from 'redux/features/sectionSlice';
import MainBoard from '@/component/common/main-board';

export interface IAppProps {
    board: BoardModel
    id: string
    section: SectionModel[]
}

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function BoardPage ({board, id, section}: IAppProps) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setSection(section))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])
  
  return (
    <StyledContainer>
        <Helmet title='Board' />
      <Sidebar />
      {/* <BoardWrapper boardData={board} boardId={id} /> */}
      <MainBoard board={{boardData: board, boardId: id}} />
    </StyledContainer>
  );
}

export const getServerSideProps = async (context: any) => {
    let secArr: SectionData[] = []
    const boardId = context?.params?.id
    
    return {
        props: {}
    }
}
