import { Sidebar } from '@/component/common/sidebar';
import { db } from 'config/firebase';
import { collection, doc, DocumentData, getDoc, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import * as React from 'react';
import styled from '@emotion/styled'
import { Helmet } from '@/component/common';
import BoardWrapper from '@/component/common/board';
import { BoardModel, SectionModel } from '@/models/board';
import { useDispatch } from 'react-redux';
import { setSection } from 'redux/features/sectionSlice';

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
  console.log(section);
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setSection(section))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])
  
  return (
    <StyledContainer>
        <Helmet title='Board' />
      <Sidebar />
      <BoardWrapper boardData={board} boardId={id} />
    </StyledContainer>
  );
}

export const getServerSideProps = async (context: any) => {
    let secArr: SectionModel[] = []
    const boardId = context?.params?.id
    const docRef = doc(db, 'boards', boardId[0])
    const sections = await getDocs(collection(db, 'section'))
    const board = await getDoc(docRef)
    sections?.docs?.forEach((item: QueryDocumentSnapshot<DocumentData>) => {
      if (boardId?.includes(item?.data()?.boardId)) {
        secArr = [...secArr, item?.data()] as SectionModel[]
      }
    })
    console.log(secArr)
    return {
        props: {
            board: board?.data(),
            id: board?.id,
            section: secArr 
        }
    }
}
