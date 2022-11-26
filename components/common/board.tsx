import { Button } from '@mui/material';
import { Box } from '@mui/material';
import * as React from 'react';

export default function BoardWrapper () {
  return (
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
        >
          Click here to create your first board
        </Button>
      </Box>
  );
}