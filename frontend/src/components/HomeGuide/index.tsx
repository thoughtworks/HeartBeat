import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, ThemeProvider } from '@mui/material/styles';

import theme from '@src/theme';

const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
};
const ImportButton = styled(Button)<ButtonProps>({
  ...basicStyle,
  width: '16rem',
  '&:hover': {
    ...basicStyle,
  },
  '&:active': {
    ...basicStyle,
  },
  '&:focus': {
    ...basicStyle,
  },
});

const HomeGuide = () => {
  return (
    <Stack direction='column' spacing={4} justifyContent='center' alignItems='center' height={'100%'}>
      <ThemeProvider theme={theme}>
        <ImportButton>Import project from file</ImportButton>
        <ImportButton>Create a new project</ImportButton>
      </ThemeProvider>
    </Stack>
  );
};

export default HomeGuide;
