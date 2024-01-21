import { Avatar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledAvatar = styled(Avatar)({
  width: '1.25rem',
  height: '1.25rem',
  marginRight: '0.25rem',
});

export const EmojiWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const StyledTypography = styled(Typography)({
  fontSize: '0.88rem',
});
