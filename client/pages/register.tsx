import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled'
import { MainLayout } from '@/component/layout'
import { useState } from 'react';
import { TextField } from '@mui/material';
import { ButtonBase } from '@mui/material';
import { Helmet } from '@/component/common';
import { Loading } from '@/component/common';
import { useNotiContext } from '@/component/common/notification';
import { NotiProvider } from '@/component/common/notification/noti-context';
import axiosClient from 'api-client/axios-client';
import { useAuth } from '@/hooks/index';

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
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0, 0, 0 / 0.1);
`

const StyledTypography = styled(Typography)`
    color: black;
    text-align: center;
    margin: 20px;
`

const StyledInput = styled(TextField)`
    width: 100%;
    border-radius: 5px;
    outline: none;
    background-color: white;
    :focus, :hover {
        border: 1px solid props.color;
    }
`

const StyledInputGroup = styled.div`
    width: 100%;
    margin: 10px 0;
    position: relative;
`

const StyledButton = styled(Button)`
    margin: 10px;
    width: 100%;
    color: white;
    :focus, :hover {
        background-color: rgba(14, 90, 4, 0.8);
    }
`

export default function RegisterPage() {
    const theme = useTheme()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUserName] = useState<string>('')
    const { notiDispatch } = useNotiContext()

    const fetcher = async (url: string) => {
        return await axiosClient.get(url)
    }

    const { register } = useAuth({url: 'auth/user', fetcher})

    const registerEmailHandler = async () => {
        await register({email, username, password})
    }
    return (
        <MainLayout>
            <NotiProvider>
                <Helmet title='Login' />
                <StyledContainer style={{ backgroundColor: `${theme.palette.primary.main}` }}>
                    <Loading isLoading={true} />
                    <StyledLoginContainer color='secondary'>
                        <StyledTypography variant='h2'>Register</StyledTypography>
                        <StyledInputGroup>
                            <StyledInput color='secondary' type="username" placeholder='Username' value={username} onChange={(e) => setUserName(e.target.value)} />
                        </StyledInputGroup>
                        <StyledInputGroup>
                            <StyledInput color='secondary' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </StyledInputGroup>

                        <StyledInputGroup>
                            <StyledInput color='secondary' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </StyledInputGroup>
                        <StyledButton variant="contained" onClick={registerEmailHandler} sx={{ backgroundColor: theme.palette.secondary.main }}>
                            Register
                        </StyledButton>
                        <ButtonBase
                            LinkComponent={Button}
                            href='/login'
                            sx={{
                                padding: '10px',
                                backgroundColor: 'transparent',
                                color: 'black',
                            }}
                        >
                            Already have an account? Sign in
                        </ButtonBase>
                    </StyledLoginContainer>
                </StyledContainer>
            </NotiProvider>
        </MainLayout>
    );
}