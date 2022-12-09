import {
  Box,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import * as React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import styled from '@emotion/styled'
import { BoardData, BoardModel } from '@/models/index'
import { useRouter } from 'next/router'
import { Loading } from './loading'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { auth, db } from 'config/firebase'
import AvatarUser from './avatar'
import { useNotiContext } from './notification'
import { collection, addDoc } from 'firebase/firestore'
import { generateId } from '@/utils/generateId'
import { getCollectionDoc } from '@/utils/index'
import { useDispatch } from 'react-redux'
import { setBoards } from 'redux/features/boardSlice'
import { useSelector } from 'react-redux'

const StyledContainer = styled.div`
  position: relative;
  max-width: 250px;
`

export function Sidebar() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const [user, loading, error] = useAuthState(auth)
  const [loadFetch, setLoadFetch] = React.useState(false)
  const [signOut, signOutLoading, signOutErr] = useSignOut(auth)
  const router = useRouter()
  const { notiDispatch } = useNotiContext()
  const [boardsList, setBoardsList] = React.useState<BoardModel[]>([])
  const boards = useSelector((state: any) => state.board.value)

  React.useEffect(() => {
    const readDoc = async () => {
      setLoadFetch(true)
      let arrBoard: BoardModel[] = []
      // const dataCol = await getDocs(collection(db, "boards"));
      ;(await getCollectionDoc('boards'))?.forEach((item) => {
        if (item?.data() && item?.data().userId === user?.uid) {
          arrBoard = [
            ...arrBoard,
            { boardData: item?.data(), boardId: item?.id },
          ] as BoardModel[]
        }
      })
      setBoardsList(arrBoard)
      dispatch(setBoards(arrBoard))
      setLoadFetch(false)
    }
    readDoc()
  }, [user, dispatch])

  const addBoardHandle = async () => {
    const boardLength: number = (await getCollectionDoc('boards'))?.docs?.length
    await addDoc(collection(db, 'boards'), {
      _id: generateId(),
      description: 'This is description',
      favorite: false,
      icon: '',
      title: 'Untitled',
      userId: user?.uid,
      sections: [],
    })
    dispatch(
      setBoards([
        ...boards,
        {
          _id: generateId(),
          description: 'This is description',
          favorite: false,
          icon: '',
          title: 'Untitled',
          userId: user?.uid,
          sections: [],
        },
      ]),
    )
  }

  const onDragEndHandler = async ({ source, destination }: DropResult) => {
    const newList = [...boardsList]
    const [removed] = newList.splice(source?.index, 1)
    newList.splice(destination?.index || 0, 0, removed)

    try {
      //   await boardApi.updatePosition({ boards: newList })
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchBoard() {
    await fetch('/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user?.uid)
    }).then((res) => console.log(res))
  }

  const handleSignOut = async () => {
    await signOut().then(() => {
      if (!signOutErr) {
        notiDispatch({
          type: 'REMOVE_ALL_AND_ADD',
          payload: {
            content: 'Sign out successfully!',
            type: 'is-info',
          },
        })
      }
    })
  }
  return (
    <StyledContainer>
      {(loading || signOutLoading || loadFetch) && (
        <Loading isLoading={loading || signOutLoading || loadFetch} />
      )}
      <List
        disablePadding
        sx={{
          width: 250,
          height: '100vh',
          backgroundColor: '#160e36',
          borderRight: '3px solid green',
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <AvatarUser
                photoURL={user?.photoURL || ''}
                displayName={user?.displayName || ''}
              />
              <Typography
                variant="body2"
                fontWeight="700"
                style={{ color: 'white' }}
              >
                {user?.displayName || ''}
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton
                onClick={handleSignOut}
                sx={{
                  ':hover': {
                    backgroundColor: 'rgba(243, 236, 236, 0.637) !important',
                  },
                }}
              >
                <LogoutOutlinedIcon
                  fontSize="small"
                  style={{ color: 'white' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        {/* <FavoriteList /> */}
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              style={{ color: 'white' }}
            >
              Private
            </Typography>
            <Tooltip title="Add board">
              <IconButton
                sx={{
                  ':hover': {
                    backgroundColor: 'rgba(243, 236, 236, 0.637) !important',
                  },
                }}
                onClick={addBoardHandle}
              >
                <AddBoxOutlinedIcon
                  fontSize="small"
                  style={{ color: 'white' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </ListItem>
        {!loadFetch && boardsList && (
          <DragDropContext onDragEnd={onDragEndHandler}>
            <Droppable
              key={'list-board-droppable'}
              droppableId={'list-board-droppable'}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {boards &&
                    boards?.map((item: BoardData, index: number) => (
                      <Draggable
                        key={item?.boardId}
                        draggableId={item.boardId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItemButton
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            selected={router?.query?.id?.includes(
                              item?.boardId,
                            )}
                            component={Link}
                            href={`/boards/${item.boardId}`}
                            sx={{
                              pl: '20px',
                              backgroundColor: `${
                                router?.query?.id?.includes(item?.boardId)
                                  ? `${theme?.palette?.secondary?.main} !important`
                                  : 'transparent'
                              }`,
                              transition: 'background-color 0.3s ease-in-out',
                              borderBottom: `2px solid ${theme.palette.secondary.main}`,
                              ':hover': {
                                backgroundColor:
                                  'rgba(243, 236, 236, 0.637) !important',
                              },
                              cursor: snapshot.isDragging
                                ? 'grab'
                                : 'pointer !important',
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item?.boardData?.icon} {item?.boardData?.title}
                            </Typography>
                          </ListItemButton>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <button onClick={fetchBoard}>Fetch Board</button>
      </List>
    </StyledContainer>
  )
}
