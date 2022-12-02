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
import styled from '@emotion/styled'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

const StyledInputTitle = styled.input`
  width: 100%;
  border: 0;
  padding: 10px 15px;
  font-size: 30px;
  outline: none;
  background: transparent;
  &::placeholder {
    color: white;
  }
  color: white;
  margin: 20px 0px;
`

const StyledLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: gray;
`

const StyledInputDesc = styled.textarea`
  width: 100%;
  border: 0;
  height: 200px;
  max-height: 500px;
  resize: vertical;
  padding: 10px 15px;
  font-size: 20px;
  outline: none;
  background: transparent;
  &::placeholder {
    color: white;
  }
  color: white;
  margin: 20px 0px;
`

export default function BoardWrapper({boardData, boardId}: BoardData) {
  const [loggedInUser, loading, error] = useAuthState(auth)
  const dispatch = useDispatch()
  const initialBoard = [{
    _id: generateId(),
    description: 'This is description',
    favorite: false,
    favoritePosition: 0,
    icon: '',
    position: 0,
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
      <Box sx={{
        width: 'calc(100vw - 250px)',
        height: '100vh',
        backgroundColor: '#160e36',
      }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>

          <StyledInputTitle name='title' placeholder={boardData?.title} />
          <StarBorderOutlinedIcon sx={{
            fontSize: '30px',
            color: 'white',
            transition: 'color 0.8s ease in out',
            margin: '0 10px',
            ':hover': {
              color: 'yellow'
            }
          }} />
          </Box>
          <StyledInputDesc name='desc' placeholder={boardData?.description} />
          <StyledLine />
      </Box>
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