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
  margin: '1rem 0 0.375rem',
});

export const AdvancedForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginTop: '1rem',
  marginBottom: '1rem',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
});
