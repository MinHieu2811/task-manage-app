import styled from '@emotion/styled';
import { Avatar, Box, Tooltip } from '@mui/material';
import * as React from 'react';

export interface IAvatarProps {
    displayName?: string,
    photoURL: string
}

const StyledBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
`

const StyledAvatar = styled(Avatar)`
    margin: 5px 10px 5px 0px;
`

export default function AvatarUser({ displayName, photoURL }: IAvatarProps) {
    return (
        <Tooltip title={`${displayName}`}>
            <StyledBox>
                {photoURL ? <StyledAvatar src={photoURL} /> : <StyledAvatar>
                    {displayName && displayName.substring(0, 1).toUpperCase()}
                </StyledAvatar>}
            </StyledBox>
        </Tooltip>
    );
}
