import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const StyledItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  overflow: 'hidden',
});

export const StyledContent = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
});

export const StyledWrapper = styled('div')({
  width: '100%',
});

export const StyledValue = styled(Typography)({
  fontSize: '2rem',
  lineHeight: '2.5rem',
  fontStyle: 'normal',
  fontWeight: 500,
  wordWrap: 'break-word',
  [theme.breakpoints.down('lg')]: {
    fontSize: '1.8rem',
  },
});

export const StyledSubtitle = styled('div')({
  width: '90%',
  maxWidth: 'max-content',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingRight: '0.5rem',
  marginTop: '0.5rem',
  fontSize: '0.8rem',
  fontStyle: 'normal',
  color: theme.main.secondColor,
  opacity: 0.65,
});

export const StyledDividingLine = styled.img({
  marginRight: '2rem',
  width: 'max-content',
  height: '4rem',
  [theme.breakpoints.down('lg')]: {
    marginRight: '1.5rem',
  },
});

export const StyledValueSection = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const StyledExtraValue = styled.div({
  width: '100%',
  fontSize: '1rem',
  fontWeight: 400,
  paddingTop: '0.4rem',
  marginLeft: '0.8rem',
  whiteSpace: 'nowrap',
});
