import type { NextPage } from 'next'
import styled from '@emotion/styled'
import { Box, Button } from '@mui/material'
import { Sidebar } from '@/component/common/sidebar'
import { Helmet } from '@/component/common'
import { generateId } from '@/utils/generateId'
import { useBoard } from '@/hooks/use-board'
import axiosClient from 'api-client/axios-client'
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next/types'
import axios from 'axios'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { sessionOptions, validateToken } from '@/utils/sessions'
import { BoardModel, User } from '../models'
import Cookies from 'cookies'

const StyledContainer = styled(Box)`
  display: flex;
  margin: 0;
  max-width: 100vw;
  align-items: center;
  padding: 0px;
`

interface Props {
  board: BoardModel[]
  user: User
}
const Home = ({board, user}: Props) => {
  console.log(board, user)
  const fetcher = async (url: string) => {
    return await axiosClient.get(url)
  }
  const { addBoard } = useBoard({ url: `/board`, fetcher })

  const addBoardHandle = async () => {
    const genId = generateId()
    // await addBoard('/board',{
    //   boardId: genId,
    //   boardData: {
    //     _id: genId,
    //     description: 'This is description',
    //     favorite: false,
    //     position: 0,
    //     favoritePosition: 0,
    //     icon: '',
    //     title: 'Untitled',
    //     userId: '',
    //   }
    // })
  }
  return (
    <StyledContainer>
      <Helmet title="Taskido" />
      <Sidebar />
      <Box
        sx={{
          width: 'calc(100vw - 250px)',
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1c1b22',
        }}
      >
        <Button variant="outlined" color="success" onClick={addBoardHandle}>
          Click here to create your first board
        </Button>
      </Box>
    </StyledContainer>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    const cookies = new Cookies(context?.req, context?.res)
    const authCookies = cookies.get('auth-token')
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCookies}`
      }
    }
    
    let resProps: Props = {
      board: [{}],
      user: {
        id: '',
        email: '',
        username: '',
      },
    }
    const user = context?.req.session?.user
    if (authCookies && validateToken(authCookies || '')) {
      const board = await axios.get('http://localhost:3000/api/board', config).then((res) => res.data)
      resProps['user'] = user || {
        id: '',
        email: '',
        username: ''
      }
      resProps['board'] = board?.data

      return board?.data?.length > 0 ? {
        redirect: {
          permanent: false,
          destination: `/boards/${board?.data[0]?._id}`,
        },
        props: resProps,
      } : {
        props: resProps
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
        props: {},
      }
    }
  }

export default Home
