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