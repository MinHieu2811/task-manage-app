import { BoardData, SectionData, TaskData } from '@/models/board'
import { Box, Button, Typography } from '@mui/material'
import * as React from 'react'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import styled from '@emotion/styled'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from 'config/firebase'
import { useSelector } from 'react-redux'
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import {
  addSection,
  removeSection,
  setSection,
} from 'redux/features/sectionSlice'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { generateId } from '@/utils/generateId'
import { useSection } from '@/hooks/use-section'
import axiosClient from 'api-client/axios-client'
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
  height: 100px;
  max-height: 500px;
  resize: vertical;
  padding: 10px 15px;
  font-size: 20px;
  outline: none;
  background: transparent;
  &::placeholder {
    color: white;
    font-family: 'Roboto', sans-serif;
  }
  color: white;
  margin: 20px 0px;
`

const StyledSectionsWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 20px;
  max-height: 50%;
  overflow: auto;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
`

const StyledSection = styled.div`
  max-width: 150px;
  min-height: 100px;
  width: 100%;
  max-height: 300px;
  margin: 20px;
  flex-wrap: wrap;
`

const StyledTitleSection = styled.div`
  text-align: start;
  padding: 10px;
  font-size: 1rem;
  color: white;
`

const StyledHeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #0c5203;
`

const StyledTask = styled.div`
  text-align: start;
  padding: 10px;
  font-size: 1rem;
  color: white;
  background-color: #2f2752;
  margin: 5px 0px;
`

export interface IMainBoardProps {
  board: BoardData
}

export default function MainBoard({ board }: IMainBoardProps) {
  const [user, loading, error] = useAuthState(auth)
  const sectionArr = useSelector((state: any) => state?.section?.value)

  const fetcher = async (url: string) => {
    return await axiosClient.get(url)
  }

  const { data, isLoading, error: fetchError, addSection} = useSection({url: `/section/${board?.boardId}`, fetcher})
  const initialSection = {
    sectionId: generateId(),
    sectionData: {
      boardId: board?.boardId,
      description: 'This is description',
      userId: user?.uid,
      title: 'Untitled',
      status: '',
      tasks: [],
    },
  }
  console.log(data)

  const handleAddSection = async () => {
    const genId = generateId()
    // await setDoc(doc(db, 'section', genId), initialSection)
    // dispatch(addSection(initialSection))
    await addSection(`/section`,{
      sectionId: genId,
      sectionData: {
        boardId: board?.boardId,
        description: 'This is description',
        userId: user?.uid as string,
        title: 'Untitled',
        status: '',
        tasks: [],
    },
    })
  }
  return (
    <Box
      sx={{
        width: 'calc(100vw - 250px)',
        height: '100vh',
        backgroundColor: '#160e36',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <Button variant="text">
          <StarBorderOutlinedIcon
            sx={{
              fontSize: '30px',
              color: 'white',
              transition: 'color 0.8s ease in out',
              margin: '0 10px',
              ':hover': {
                color: 'yellow',
              },
            }}
          />
        </Button>

        <Button variant="text">
          <DeleteOutlineOutlinedIcon
            sx={{
              fontSize: '30px',
              color: 'white',
              transition: 'color 0.8s ease in out',
              margin: '0 10px',
              ':hover': {
                color: 'red',
              },
            }}
          />
        </Button>
      </Box>
      <StyledInputTitle name="title" placeholder={board?.boardData?.title} />
      <StyledInputDesc
        name="desc"
        placeholder={board?.boardData?.description}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0px 10px',
        }}
      >
        <Button
          variant="text"
          sx={{ color: 'white', fontSize: '1rem' }}
          onClick={handleAddSection}
        >
          Add sections
        </Button>
        <Typography component="p" sx={{ color: 'white', fontSize: '1rem' }}>
          {sectionArr?.length} {sectionArr?.length > 0 ? 'sections' : 'section'}
        </Typography>
      </Box>
      <StyledLine />
      <StyledSectionsWrapper>
        {sectionArr.length > 0 ? (
          sectionArr?.map((item: SectionData) => (
            <div key={item?.sectionId}>
              <Section
                sectionId={item?.sectionId}
                sectionData={item?.sectionData}
              />
            </div>
          ))
        ) : (
          <></>
        )}
      </StyledSectionsWrapper>
    </Box>
  )
}

function Section({ sectionId, sectionData }: SectionData) {
  const dispatch = useDispatch()
  const handleDelete = async () => {
    await deleteDoc(doc(db, 'section', sectionId))
    dispatch(removeSection(sectionId))
  }

  const onDragEndHandler = async ({ source, destination }: DropResult) => {
    const newList = [...sectionData?.tasks]
    const [removed] = newList.splice(source?.index, 1)
    newList.splice(destination?.index || 0, 0, removed)

    try {
      //   await boardApi.updatePosition({ boards: newList })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <StyledSection>
      <StyledHeaderSection>
        <StyledTitleSection>{sectionData?.title}</StyledTitleSection>
        <Box sx={{ display: 'flex' }}>
          <AddOutlinedIcon
            sx={{
              fontSize: '15px',
              color: 'white',
              transition: 'color 0.8s ease in out',
              margin: '0 5px',
              ':hover': {
                color: 'red',
              },
              cursor: 'pointer',
            }}
          />
          <DeleteOutlineOutlinedIcon
            sx={{
              fontSize: '15px',
              color: 'white',
              transition: 'color 0.8s ease in out',
              margin: '0 5px',
              ':hover': {
                color: 'red',
              },
              cursor: 'pointer',
            }}
            onClick={handleDelete}
          />
        </Box>
      </StyledHeaderSection>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable
          key={'list-board-droppable'}
          droppableId={'list-board-droppable'}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sectionData?.tasks?.map((item: TaskData, index: number) => (
                <Draggable
                  key={item?.taskData?.boardId}
                  draggableId={item.taskData?.boardId}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <StyledTask>{item?.taskData?.title}</StyledTask>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </StyledSection>
  )
}
