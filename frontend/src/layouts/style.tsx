import { Z_INDEX } from '@src/constants/commons';
import HomeIcon from '@mui/icons-material/Home';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const LogoWarp = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 1rem',
  alignItems: 'center',
  backgroundColor: theme.main.backgroundColor,
  fontFamily: 'Times',
  zIndex: Z_INDEX.STICKY,
  position: 'sticky',
  top: 0,
});

export const LogoTitle = styled.span({
  color: theme.main.color,
  fontWeight: 'bold',
  fontSize: '1.5rem',
});

export const LogoImage = styled.img({
  height: '4rem',
  width: '4rem',
});

export const LogoContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: theme.main.color,
  marginRight: '1rem',
});

export const StyledHeaderInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: theme.main.color,
});

export const StyledVersion = styled.div({
  color: '#ddd',
  fontSize: '0.8rem',
  paddingTop: '0.5rem',
});

export const IconContainer = styled.div({
  display: 'inherit',
  color: theme.main.color,
});

export const HomeIconContainer = styled.span`
  cursor: pointer;
`;

export const HomeIconElement = styled(HomeIcon)`
  color: ${theme.main.color};
`;

export const NotificationIconContainer = styled.span({
  left: 0,
});

export const ellipsisProps: { [key: string]: string | number } = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};
