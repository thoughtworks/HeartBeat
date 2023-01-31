import { createTheme } from '@mui/material/styles'
import { indigo } from '@mui/material/colors'
import { FIVE_HUNDRED } from '@src/constants'

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
