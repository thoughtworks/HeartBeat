import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const AdvancedTitleContainer = styled.div({
  fontSize: '1rem',
  lineHeight: '1.25rem',
  fontWeight: '600',
  marginRight: '1rem',
});

export const AdvancedContainer = styled('div')({
  display: 'flex',
  margin: '1rem 0 1.25rem',
});

export const AdvancedForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginBottom: '1rem',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
});

export const AdvancedWrapper = styled('div')`
  position: relative;
  width: 100%;
  border: ${theme.main.cardBorder};
  box-shadow: none;
  margin-bottom: 1rem;
  line-height: 2rem;
  boarder-radius: 0.25rem;
  padding: 2.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
