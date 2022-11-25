import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
export const theme = createTheme({
  palette: {
    primary: {
      main: '#160438',
    },
    secondary: {
      main: '#0c5203',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthSm: {
          maxWidth: '680px',

          '@media (min-width: 600px)': {
            maxWidth: '680px'
          }
        },
        maxWidthMd: {
          maxWidth: '860px',

          '@media (min-width: 900px)': {
            maxWidth: '860px'
          }
        },
      },
      defaultProps: {
        maxWidth: 'md'
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          color: 'black',

          '&:hover,' : {
            color: '#FFFFFF'
          }
        }
      }
    }
  }
});