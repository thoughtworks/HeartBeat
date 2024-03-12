import styled from '@emotion/styled';
import { Link } from '@mui/material';
import { theme } from '@src/theme';

export const StyledLink = styled(Link)({
  alignItems: 'center',
  display: 'flex',
  gap: '0.25rem',
});

export const ReworkHeaderWrapper = styled('div')({
  display: 'flex',
  gap: '1rem',
});

export const ReworkSettingsWrapper = styled('div')`
  position: relative;
  width: 100%;
  border: ${theme.main.cardBorder};
  box-shadow: none;
  margin-bottom: 1rem;
  line-height: '2rem';
  boarder-radius: 0.25rem;
  padding: 2.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
