import { Box, Stack } from '@mui/material';
import { LayoutProps } from '@/models/index';
import * as React from 'react';

export function MainLayout({ children }: LayoutProps) {

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Stack>
            <Box component="main" flexGrow="1">
                <Box>
                    {children}
                </Box>
            </Box>
        </Stack>
    );
}