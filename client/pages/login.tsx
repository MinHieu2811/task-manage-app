import React, { useEffect } from 'react'
import { Button, Typography, useTheme } from '@mui/material'
import styled from '@emotion/styled'
import { MainLayout } from '@/component/layout/index'
import { useState } from 'react'
import { TextField } from '@mui/material'
import { Helmet } from '@/component/common'
import { Loading } from '@/component/common'
import { useNotiContext } from '@/component/common/notification'
import axiosClient from 'api-client/axios-client'
import { useRouter } from 'next/router'
import {signIn, useSession } from 'next-auth/react'
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
`
const StyledLoginContainer = styled.div`
  width: 50%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: white;
  border: 1px solid props.color;
  border-radius: 5px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0, 0, 0 / 0.1);
`

const StyledTypography = styled(Typography)`
  color: black;
  text-align: center;
  margin: 20px;
`

// const StyledInput = styled(TextField)`
//   width: 100%;
//   border-radius: 5px;
//   outline: none;
//   background-color: white;
//   :focus,
//   :hover {
//     border: 1px solid props.color;
//   }
// `

// const StyledInputGroup = styled.div`
//   width: 100%;
//   margin: 10px 0;
//   position: relative;
// `

const StyledButton = styled(Button)`
  margin: 10px;
  width: 100%;
  color: white;
  :focus,
  :hover {
    background-color: rgba(14, 90, 4, 0.8);
  }
`

export default function LoginPage() {
  const theme = useTheme()
  const router = useRouter()
  const { notiDispatch } = useNotiContext()

  const fetcher = async (url: string) => {
    return await axiosClient.get(url)
  }

  const signInHandler = (key: string) => {
    signIn(key, {redirect: false, callbackUrl: '/'})
  } 

  const { data: session, status } = useSession()
  const loading = status === "loading"
  useEffect(() => {
    if(session && status === 'authenticated') {
      router.replace('/')
    } 
  }, [router, status, session])
  

  return (
    loading ? (<Loading isLoading={loading} />) : (
      <MainLayout>
      <Helmet title="Login" />
      <StyledContainer
        style={{ backgroundColor: `${theme.palette.primary.main}` }}
      >
        <StyledLoginContainer color="secondary">
          <StyledTypography variant="h2">Login</StyledTypography>
          {/* <StyledInputGroup>
            <StyledInput
              color="secondary"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </StyledInputGroup>

          <StyledInputGroup>
            <StyledInput
              color="secondary"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </StyledInputGroup>
          <StyledButton
            variant="contained"
            onClick={signInEmailHandler}
            sx={{ backgroundColor: theme.palette.secondary.main }}
          >
            Log in
          </StyledButton> */}
          <StyledButton
            variant='contained'
            onClick={() => signInHandler('google')}
            sx={{ backgroundColor: theme.palette.secondary.main }}
          >
            <GoogleIcon sx={{marginRight: '5px'}} /> Log in with Google
          </StyledButton>
          <StyledButton
            variant='contained'
            onClick={() => signInHandler('facebook')}
            sx={{ backgroundColor: theme.palette.secondary.main }}
          >
            <FacebookIcon sx={{marginRight: '5px'}} /> Log in with Facebook
          </StyledButton>
          {/* <ButtonBase
            LinkComponent={Button}
            href="/register"
            sx={{
              padding: '10px',
              backgroundColor: 'transparent',
              color: 'black',
            }}
          >
            Dont have an account? Sign up
          </ButtonBase> */}
        </StyledLoginContainer>
      </StyledContainer>
    </MainLayout>
    )
  )
}
