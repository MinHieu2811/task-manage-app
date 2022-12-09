import { generateId } from '@/utils/index';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { auth, db } from 'config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loading } from './loading';
import { useDispatch } from 'react-redux';
import { setBoards } from 'redux/features/boardSlice';
import { BoardData } from '@/models/board';
import MainBoard from './main-board';

export default function BoardWrapper({boardData, boardId}: BoardData) {
  const [loggedInUser, loading, error] = useAuthState(auth)
  const dispatch = useDispatch()
  const initialBoard = [{
    _id: generateId(),
    description: 'This is description',
    favorite: false,
    icon: '',
    title: 'Untitled',
    userId: loggedInUser?.uid,
    sections: []
  }]

  const addBoardHandle = async () => {
    await addDoc(collection(db, 'boards'), initialBoard)
    dispatch(setBoards(initialBoard))
  }

  if (loading) {
    <Loading isLoading={loading} />
  }
  return (
    boardData ? (
      <MainBoard board={{boardData, boardId}} />
    ) : (
      <Box sx={{
        width: 'calc(100vw - 250px)',
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#160e36',
      }}>
        <Button
          variant='outlined'
          color='success'
          onClick={addBoardHandle}
        >
          Click here to create your first board
        </Button>
      </Box>
    )
  );
}