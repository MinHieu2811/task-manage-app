import { Box, Drawer, IconButton, Link, List, ListItem, ListItemButton, Typography } from '@mui/material';
import * as React from 'react'
// import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import styled from '@emotion/styled'
import { BoardModel } from '@/models/index';
import { useRouter } from 'next/router'
import { Loading } from './loading'
import Button from '@mui/material/Button'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'config/firebase';
import AvatarUser from './avatar';

const StyledContainer = styled.div`
    position: relative;
    max-width:250px; 
`

export function Sidebar() {
    const [user, loading, error] = useAuthState(auth)
    const [activeIndex, setActiveIndex] = React.useState(0)
    const router = useRouter()

    // const onDragEndHandler = async ({ source, destination }: DropResult) => {
    //     const newList = [...data]
    //     const [removed] = newList.splice(source?.index, 1)
    //     newList.splice(destination?.index || 0, 0, removed)

    //     const activeItem = newList.findIndex(e => e.id === router.query)
    //     setActiveIndex(activeItem)

    //     try {
    //         //   await boardApi.updatePosition({ boards: newList })
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    if (loading) {
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
                                {user?.displayName}
                            </Typography>
                        </Box>
                        <IconButton>
                            <LogoutOutlinedIcon fontSize='small' style={{ color: 'white' }} />
                        </IconButton>
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
                        <IconButton>
                            <AddBoxOutlinedIcon fontSize='small' style={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                </ListItem>
                {/* {
                    data && (
                        <DragDropContext onDragEnd={onDragEndHandler}>
                            <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {
                                            data.data?.map((item: BoardModel, index: number) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <ListItemButton
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            selected={index === activeIndex}
                                                            component={Link}
                                                            href={`/boards/${item.id}`}
                                                            sx={{
                                                                pl: '20px',
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
                } */}
            </List>
        </StyledContainer>
    );
}