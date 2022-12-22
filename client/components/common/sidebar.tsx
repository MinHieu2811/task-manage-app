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
import { useNotiContext } from './notification'
import { generateId } from '@/utils/generateId'
import { useSelector } from 'react-redux'
import axiosClient from 'api-client/axios-client'
import { useBoard } from '@/hooks/use-board'
import { AxiosResponse } from 'axios'

const StyledContainer = styled.div`
  position: relative;
  max-width: 250px;
`

export function Sidebar() {
  const theme = useTheme()
  const router = useRouter()
  const { notiDispatch } = useNotiContext()
  const boards = useSelector((state: any) => state.board.value)

  const fetcher = async (url: string): Promise<AxiosResponse<BoardData>> => {
    return await axiosClient.get(url)
  }
  const { dataRes, isLoading, isValidating, error: fetchError, addBoard } = useBoard({url: `/board`, fetcher}) 

  const addBoardHandle = async () => {
    // const genId = generateId()
    // await addBoard('/board',{
    //   boardId: genId,
    //   boardData: {
    //     _id: genId,
    //     description: 'This is description',
    //     favorite: false,
    //     icon: '',
    //     title: 'Untitled',
    //     userId: '',
    //   }
    // })
  }

  const onDragEndHandler = async ({ source, destination }: DropResult) => {
    const newList = [...(dataRes?.data as BoardModel[])]
    const [removed] = newList.splice(source?.index, 1)
    newList.splice(destination?.index || 0, 0, removed)

    try {
      //   await boardApi.updatePosition({ boards: newList })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSignOut = async () => {
    // await signOut().then(() => {
    //   if (!signOutErr) {
    //     notiDispatch({
    //       type: 'REMOVE_ALL_AND_ADD',
    //       payload: {
    //         content: 'Sign out successfully!',
    //         type: 'is-info',
    //       },
    //     })
    //   }
    // })
  }
  return (
    <StyledContainer>
      {(isLoading) && (
        <Loading isLoading={isLoading} />
      )}
      <List
        disablePadding
        sx={{
          width: 250,
          height: '100vh',
          backgroundColor: '#1c1b22',
          borderRight: '2px solid green',
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
              <Typography
                variant="body2"
                fontWeight="700"
                style={{ color: 'white' }}
              >
                {''}
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
        {!isLoading && (
          <DragDropContext onDragEnd={onDragEndHandler}>
            <Droppable
              key={'list-board-droppable'}
              droppableId={'list-board-droppable'}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {dataRes &&
                    dataRes?.data?.map((item: BoardModel, index: number) => (
                      <Draggable
                        key={item?._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItemButton
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            selected={router?.query?.id?.includes(
                              item?._id,
                            )}
                            component={Link}
                            href={`/boards/${item._id}`}
                            sx={{
                              pl: '20px',
                              backgroundColor: `${
                                router?.query?.id?.includes(item?._id)
                                  ? `${theme?.palette?.secondary?.main} !important`
                                  : 'transparent'
                              }`,
                              transition: 'background-color 0.3s ease-in-out',
                              // borderBottom: `2px solid ${theme.palette.secondary.main}`,
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
                              {item?.icon} {item?.title}
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
      </List>
    </StyledContainer>
  )
}
