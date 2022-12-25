import styled from '@emotion/styled';
import { Box } from '@mui/material';
import * as React from 'react';

export interface ILoadingProps {
    isLoading: boolean,
}

const StyledContainer = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`

const StyledLoadingContainer = styled.div`
    width: 40px;
    height: 40px;
    position: relative;
    animation: sk-chase 2.5s infinite linear both;
`

const StyledLoadingDot = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; 
    animation: sk-chase-dot 2.0s infinite ease-in-out both; 
    :before {
        content: '';
        display: block;
        width: 25%;
        height: 25%;
        background-color: #fff;
        border-radius: 100%;
        animation: sk-chase-dot-before 2.0s infinite ease-in-out both; 
    }
    :nth-of-type(1) { animation-delay: -1.1s; }
    :nth-of-type(2) { animation-delay: -1.0s; }
    :nth-of-type(3) { animation-delay: -0.9s; }
    :nth-of-type(4) { animation-delay: -0.8s; }
    :nth-of-type(5) { animation-delay: -0.7s; }
    :nth-of-type(6) { animation-delay: -0.6s; }
    :nth-of-type(1):before { animation-delay: -1.1s; }
    :nth-of-type(2):before { animation-delay: -1.0s; }
    :nth-of-type(3):before { animation-delay: -0.9s; }
    :nth-of-type(4):before { animation-delay: -0.8s; }
    :nth-of-type(5):before { animation-delay: -0.7s; }
    :nth-of-type(6):before { animation-delay: -0.6s; }
    @keyframes sk-chase {
        100% { transform: rotate(360deg); } 
    }
    @keyframes sk-chase-dot {
        80%, 100% { transform: rotate(360deg); } 
    }
    @keyframes sk-chase-dot-before {
    50% {
        transform: scale(0.4); 
    } 100%, 0% {
        transform: scale(1.0); 
    } 
    }
`

export function Loading({ isLoading }: ILoadingProps) {
    return (
        isLoading ? (
            <StyledContainer>
                <StyledLoadingContainer>
                    <StyledLoadingDot />
                    <StyledLoadingDot />
                    <StyledLoadingDot />
                    <StyledLoadingDot />
                    <StyledLoadingDot />
                    <StyledLoadingDot />
                </StyledLoadingContainer>
            </StyledContainer>
        ) : (
            <></>
        )
    );
}