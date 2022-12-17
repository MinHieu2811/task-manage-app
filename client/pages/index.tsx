import type { NextPage } from 'next'
import styled from '@emotion/styled'
import { Box, Button } from '@mui/material'
import { Sidebar } from '@/component/common/sidebar'
import { Helmet } from '@/component/common'
import { generateId } from '@/utils/generateId'
import { useBoard } from '@/hooks/use-board'
import axiosClient from 'api-client/axios-client'

const StyledContainer = styled(Box)`
  display: flex;
  margin: 0;
  max-width: 100vw;
  align-items: center;
  padding: 0px;
`
const Home: NextPage = () => {
  const fetcher = async (url: string) => {
    return await axiosClient.get(url)
  }
  const { addBoard } = useBoard({url: `/board`, fetcher})

  const addBoardHandle = async () => {
    const genId = generateId()
    await addBoard('/board',{
      boardId: genId,
      boardData: {
        _id: genId,
        description: 'This is description',
        favorite: false,
        position: 0,
        favoritePosition: 0,
        icon: '',
        title: 'Untitled',
        userId: '',
      }
    })
  }
  return (
    <StyledContainer>
      <Helmet title='Taskido' />
      <Sidebar />
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
    </StyledContainer>
  )
}

export default Home