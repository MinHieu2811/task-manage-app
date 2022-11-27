import { Box, Drawer, IconButton, Link, List, ListItem, ListItemButton, Tooltip, Typography, useTheme } from '@mui/material';
import * as React from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import styled from '@emotion/styled'
import { BoardModel } from '@/models/index';
import { useRouter } from 'next/router'
import { Loading } from './loading'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth, db } from 'config/firebase';
import AvatarUser from './avatar';
import { useNotiContext } from './notification';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { generateId } from '@/utils/generateId';

const StyledContainer = styled.div`
    position: relative;
    max-width:250px; 
`

export function Sidebar() {
    const theme = useTheme()
    const [user, loading, error] = useAuthState(auth)
    const [signOut, signOutLoading, signOutErr] = useSignOut(auth)
    const router = useRouter()
    const { notiDispatch } = useNotiContext()
    const [boards, setBoards] = React.useState<BoardModel[]>([])

    React.useEffect(() => {
        const readDoc = async () => {
            let arrBoard: BoardModel[] = []
            const dataCol = await getDocs(collection(db, "boards"));
            dataCol?.forEach((item) => {
                if (item?.data() && item?.data().userId === user?.uid) {
                    arrBoard = [...arrBoard, item.data()] as BoardModel[]
                }
            })
            setBoards(arrBoard)
        }
        readDoc()
    }, [user])

    console.log(boards)
    const addBoardHandle = async () => {
        await addDoc(collection(db, 'boards'), {
            _id: generateId(),
            description: 'This is description',
            favorite: false,
            favoritePosition: 0,
            icon: '',
            position: boards?.length === 0 ? 0 : boards?.length,
            title: 'Untitled',
            userId: user?.uid,
            sections: []
        })
    }

    const onDragEndHandler = async ({ source, destination }: DropResult) => {
        const newList = [...boards]
        const [removed] = newList.splice(source?.index, 1)
        newList.splice(destination?.index || 0, 0, removed)

        try {
            //   await boardApi.updatePosition({ boards: newList })
        } catch (err) {
            console.log(err)
        }
    }

    const handleSignOut = async () => {
        await signOut().then(() => {
            if (!signOutErr) {
                notiDispatch({
                    type: 'REMOVE_ALL_AND_ADD',
                    payload: {
                        content: 'Sign out successfully!',
                        type: 'is-info'
                    }
                })
            }
        })
    }

    if (loading || signOutLoading) {
        return <Loading isLoading={loading} />
    }
    return (
        <StyledContainer>
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
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <AvatarUser photoURL={user?.photoURL || ''} displayName={user?.displayName || ''} />
                            <Typography variant='body2' fontWeight='700' style={{ color: 'white' }}>
                                {user?.displayName || ''}
                            </Typography>
                        </Box>
                        <Tooltip title='Logout'>
                            <IconButton onClick={handleSignOut} sx={{
                                ':hover': {
                                    backgroundColor: 'rgba(243, 236, 236, 0.637) !important'
                                },
                            }}>
                                <LogoutOutlinedIcon fontSize='small' style={{ color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </ListItem>
                <Box sx={{ paddingTop: '10px' }} />
                {/* <FavoriteList /> */}
                <Box sx={{ paddingTop: '10px' }} />
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant='body2' fontWeight='700' style={{ color: 'white' }}>
                            Private
                        </Typography>
                        <Tooltip title="Add board">
                            <IconButton sx={{
                                ':hover': {
                                    backgroundColor: 'rgba(243, 236, 236, 0.637) !important'
                                },
                            }}>
                                <AddBoxOutlinedIcon fontSize='small' style={{ color: 'white' }} onClick={addBoardHandle} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </ListItem>
                {
                    boards && (
                        <DragDropContext onDragEnd={onDragEndHandler}>
                            <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {
                                            boards?.map((item: BoardModel, index: number) => (
                                                <Draggable key={item?._id} draggableId={item._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <ListItemButton
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            selected={router?.pathname?.includes(item?._id)}
                                                            component={Link}
                                                            href={`/boards/${item._id}`}
                                                            sx={{
                                                                pl: '20px',
                                                                transition: 'background-color 0.3s ease-in-out',
                                                                borderBottom: `2px solid ${theme.palette.secondary.main}`,
                                                                ':hover': {
                                                                    backgroundColor: 'rgba(243, 236, 236, 0.637) !important'
                                                                },
                                                                cursor: snapshot.isDragging ? 'grab' : 'pointer !important'
                                                            }}
                                                        >

                                                            <Typography variant='body2'
                                                                fontWeight='700'
                                                                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {item.icon} {item.title}
                                                            </Typography>
                                                        </ListItemButton>
                                                    )}
                                                </Draggable>
                                            ))

                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )
                }
            </List>
        </StyledContainer>
    );
}