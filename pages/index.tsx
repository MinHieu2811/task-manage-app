import type { NextPage } from 'next'
import styled from '@emotion/styled'
import { Box } from '@mui/material'
import { Sidebar } from '@/component/common/sidebar'
import BoardWrapper from '@/component/common/board'

const StyledContainer = styled(Box)`
  display: flex;
  margin: 0;
  max-width: 100vw;
  align-items: center;
  padding: 0px;
`
const Home: NextPage = () => {
  return (
    <StyledContainer>
      <Sidebar />
      <BoardWrapper />
    </StyledContainer>
  )
}

export default Home
