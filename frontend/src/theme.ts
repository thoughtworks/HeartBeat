import { FIVE_HUNDRED } from '@src/constants/commons';
import { createTheme } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import '@fontsource/roboto';

declare module '@mui/material/styles' {
  //eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends ThemeOptions {}
  // allow configuration using `createTheme`
  interface ThemeOptions {
    main: {
      backgroundColor: string;
      color: string;
      secondColor: string;
      fontSize: string;
      boxShadow: string;
      cardShadow: string;
      cardBorder: string;
      font: {
        primary: string;
        secondary: string;
      };
      button: {
        disabled: {
          backgroundColor: string;
          color: string;
        };
      };
      loading: {
        backgroundColor: string;
      };
      errorMessage: {
        color: string;
      };
      alert: {
        title: {
          color: string;
        };
        error: {
          iconColor: string;
          backgroundColor: string;
          borderColor: string;
        };
        success: {
          iconColor: string;
          backgroundColor: string;
          borderColor: string;
        };
        warning: {
          iconColor: string;
          backgroundColor: string;
          borderColor: string;
        };
        info: {
          iconColor: string;
          backgroundColor: string;
          borderColor: string;
        };
      };
    };
  }

  interface Components {
    errorMessage: {
      color: string;
      paddingBottom: string;
    };
    waringMessage: {
      color: string;
    };
    tip: {
      color: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: indigo[FIVE_HUNDRED],
    },
    secondary: {
      main: indigo[FIVE_HUNDRED],
      dark: '#f7f7f7',
      contrastText: '#000000A6',
    },
    info: {
      main: '#3498db',
      light: '#b9c4cc',
    },
  },
  main: {
    backgroundColor: indigo[FIVE_HUNDRED],
    color: '#fff',
    secondColor: 'black',
    fontSize: '1rem',
    boxShadow:
      '0 0.2rem 0.1rem -0.1rem rgb(0 0 0 / 20%), 0 0.1rem 0.1rem 0 rgb(0 0 0 / 14%), 0 0.1rem 0.3rem 0 rgb(0 0 0 / 12%)',
    cardShadow: '0 0.013rem 1rem 0 rgba(0, 0, 0, 0.08);',
    cardBorder: '0.07rem solid rgba(0, 0, 0, 0.10);',
    font: {
      primary: 'Roboto',
      secondary: 'sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Arial',
    },
    button: {
      disabled: {
        backgroundColor: '#E0E0E0',
        color: '#929292',
      },
    },
    errorMessage: {
      color: '#A2A2A2',
    },
    loading: {
      backgroundColor: 'rgba(199,199,199,0.43)',
    },
    alert: {
      title: {
        color: '#000000D9',
      },
      error: {
        iconColor: '#D74257',
        backgroundColor: '#FFE7EA',
        borderColor: '#F3B6BE',
      },
      success: {
        iconColor: '#5E9E66',
        backgroundColor: '#EFFFF1',
        borderColor: '#CFE2D1',
      },
      warning: {
        iconColor: '#D78D20',
        backgroundColor: '#FFF4E3',
        borderColor: '#F3D5A9',
      },
      info: {
        iconColor: '#4050B5',
        backgroundColor: '#E9ECFF',
        borderColor: '#939DDA',
      },
    },
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
    tip: {
      color: '#ED6D03CC',
    },
  },
});
