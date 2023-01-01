import styled from '@emotion/styled'
import { Box, Button } from '@mui/material'
import { Sidebar } from '@/component/common/sidebar'
import { Helmet } from '@/component/common'
import { generateId } from '@/utils/generateId'
import { useBoard } from '@/hooks/use-board'
import axiosClient from 'api-client/axios-client'
import { BoardModel, User } from '../models'
import Cookies from 'cookies'
import { getSession } from 'next-auth/react'
import { validateToken } from '@/utils/sessions'
import jwt from 'jsonwebtoken'

const StyledContainer = styled(Box)`
  display: flex;
  margin: 0;
  max-width: 100vw;
  align-items: center;
  padding: 0px;
`

const Home = () => {
  const fetcher = async (url: string) => {
    return await axiosClient.get(url)
  }
  // const { dataRes, addBoard } = useBoard({ url: `/board`, fetcher })
  const addBoardHandle = async () => {
    const session = await getSession()
    console.log(session)
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

// export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
//     const cookies = new Cookies(context?.req, context?.res)
//     const authCookies = cookies.get('auth-token')
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authCookies}`
//       }
//     }
    
//     let resProps: Props = {
//       board: [{}],
//       user: {
//         id: '',
//         email: '',
//         username: '',
//       },
//     }
//     const user = context?.req.session?.user
//     if (authCookies && validateToken(authCookies || '')) {
//       try {
//         const board = await axios.get('http://localhost:3000/api/board', config).then((res) => res.data)
//       resProps['user'] = user || {
//         id: '',
//         email: '',
//         username: ''
//       }
//       console.log(board?.response?.status);

//       if(board?.response?.status === 401) {
//         return {
//           redirect: {
//             permanent: false,
//             destination: '/login',
//           },
//           props: {},
//         }
//       }
//       resProps['board'] = board?.data

//       return board?.data?.length > 0 ? {
//         redirect: {
//           permanent: false,
//           destination: `/boards/${board?.data[0]?._id}`,
//         },
//         props: resProps,
//       } : {
//         props: resProps
//       }
//       } catch (error) {
//         return {
//           redirect: {
//             permanent: false,
//             destination: '/login',
//           },
//           props: {error},
//         }
//       }
//     } else {
//       return {
//         redirect: {
//           permanent: false,
//           destination: '/login',
//         },
//         props: {},
//       }
//     }
//   }

export default Home
