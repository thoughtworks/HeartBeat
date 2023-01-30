import { createTheme } from '@mui/material/styles'
import { indigo } from '@mui/material/colors'

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

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
  },
  main: {
    backgroundColor: indigo[500],
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

export default theme
