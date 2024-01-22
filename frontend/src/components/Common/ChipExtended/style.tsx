import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import { theme } from '@src/theme';

export const StyledChip = styled(Chip)({
  backgroundColor: 'transparent',
  border: `0.0625rem solid ${theme.palette.info.light}`,
  marginBottom: '0.25rem',
  marginRight: '0.25rem',

  '&.with-loading': {
    cursor: 'not-allowed',
    '.MuiCircularProgress-root': {
      cursor: 'not-allowed',

      svg: {
        color: theme.main.alert.info.iconColor,
      },
    },
  },
  '&.with-retry': {
    '.MuiSvgIcon-root': {
      color: theme.main.alert.info.iconColor,
    },
  },
  '&.with-error': {
    color: theme.main.alert.error.iconColor,
    borderColor: theme.main.alert.error.iconColor,
    '.MuiSvgIcon-root': {
      color: theme.main.alert.error.iconColor,
    },
  },
});
