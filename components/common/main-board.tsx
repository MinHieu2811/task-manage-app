import { BoardData, SectionModel, TaskModel } from '@/models/board'
import { Box, Button, Typography, useTheme } from '@mui/material'
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
    font-family: 'Roboto', sans-serif;
  }
  color: white;
  margin: 20px 0px;
`

const StyledSectionsWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 20px;
  max-height: 50%;
  overflow: auto;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
`

const StyledSection = styled.div`
  max-width: 150px;
  width: 100%;
  max-height: 300px;
  border: 1px solid red;
  margin: 20px;
  flex-wrap: wrap;
`

const StyledTitleSection = styled.div`
  text-align: center;
  padding: 10px;
  font-size: 1rem;
  color: white;
  border-bottom: 1px solid #0c5203;
`

const StyledTask = styled.div`
  text-align: start;
  padding: 10px;
  font-size: 1rem;
  color: white;
  border-bottom: 1px solid #0c5203;
`

export interface IMainBoardProps {
  board: BoardData
}

export default function MainBoard({ board }: IMainBoardProps) {
  const theme = useTheme()
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
        <Button variant="text" sx={{ color: 'white', fontSize: '1rem' }}>
          Add sections
        </Button>
        <Typography component="p" sx={{ color: 'white', fontSize: '1rem' }}>
          {board?.boardData?.sections?.length}{' '}
          {board?.boardData?.sections?.length > 0 ? 'sections' : 'section'}
        </Typography>
      </Box>
      <StyledLine />
      <StyledSectionsWrapper>
        {board?.boardData?.sections?.length &&
          board?.boardData?.sections?.map(
            (item: SectionModel, index: number) => (
              <div key={index}>
                <Section
                  boardId={item?.boardId}
                  userName={item?.userName}
                  title={item?.title}
                  status={item?.status}
                  tasks={item?.tasks}
                />
              </div>
            ),
          )}
      </StyledSectionsWrapper>
    </Box>
  )
}

function Section(sections: SectionModel) {
  const onDragEndHandler = async ({ source, destination }: DropResult) => {
    const newList = [...sections?.tasks]
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
      <StyledTitleSection>{sections?.title}</StyledTitleSection>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable
          key={'list-board-droppable'}
          droppableId={'list-board-droppable'}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections?.tasks?.map((item: TaskModel, index: number) => (
                <Draggable
                  key={item?.boardId}
                  draggableId={item.boardId}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <StyledTask>{item?.title}</StyledTask>
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
