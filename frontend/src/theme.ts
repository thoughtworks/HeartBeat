import { createTheme } from '@mui/material/styles';
import { indigo, grey } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    main: {
      backgroundColor: string;
      color: string;
      fontSize: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    main: {
      backgroundColor: string;
      color: string;
      fontSize: string;
    };
  }
}

const theme = createTheme({
  main: {
    backgroundColor: indigo[500],
    color: grey.A100,
    fontSize: '1rem',
  },
});

export default theme;
