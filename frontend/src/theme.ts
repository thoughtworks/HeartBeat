import { createTheme, styled } from '@mui/material/styles'
import { indigo } from '@mui/material/colors'
import { FIVE_HUNDRED } from '@src/constants'
import { Backdrop, Button } from '@mui/material'

declare module '@mui/material/styles' {
  interface Theme {
    main: {
      backgroundColor: string
      color: string
      secondColor: string
      fontSize: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    main: {
      backgroundColor: string
      color: string
      secondColor: string
      fontSize: string
    }
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: indigo[FIVE_HUNDRED],
    },
  },
  main: {
    backgroundColor: indigo[FIVE_HUNDRED],
    color: '#fff',
    secondColor: 'black',
    fontSize: '1rem',
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
})

export const LoadingDrop = styled(Backdrop)({
  position: 'absolute',
  zIndex: '999',
  backgroundColor: 'rgba(199,199,199,0.43)',
  color: theme.main.backgroundColor,
})

export const VerifyButton = styled(Button)({
  width: '3rem',
  fontSize: '0.8rem',
  fontWeight: '550',
})
export const ResetButton = styled(Button)({
  width: '3rem',
  fontSize: '0.8rem',
  fontWeight: '550',
  color: '#f44336',
})
