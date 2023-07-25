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
      boxShadow: string
    }
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    main: {
      backgroundColor: string
      color: string
      secondColor: string
      fontSize: string
      boxShadow: string
    }
  }

  interface Components {
    errorMessage: {
      color: string
      paddingBottom: string
    }
    waringMessage: {
      color: string
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
    boxShadow:
      '0 0.2rem 0.1rem -0.1rem rgb(0 0 0 / 20%), 0 0.1rem 0.1rem 0 rgb(0 0 0 / 14%), 0 0.1rem 0.3rem 0 rgb(0 0 0 / 12%)',
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  components: {
    errorMessage: {
      color: '#ff0000',
      paddingBottom: '1rem',
    },
    waringMessage: {
      color: '#cd5e32',
    },
  },
})
