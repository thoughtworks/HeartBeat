import { BACK } from '@src/constants/resources';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';
import React from 'react';
interface Property {
  onBack: () => void;
}

const StyledDiv = styled('div')`
  display: flex;
  align-items: center;
  width: max-content;
  z-index: 2;
  margin-bottom: 2.5rem;
  color: ${theme.main.button.disabled.color};
  cursor: pointer;
  font-size: 1rem;
`;

const StyledArrowBack = styled(ArrowBack)`
  width: 1.5rem;
  margin-right: 0.5rem;
`;

export const withGoBack =
  <P extends Property>(Child: React.ComponentType<P>) =>
  (prop: P) => (
    <>
      <StyledDiv onClick={prop.onBack}>
        <StyledArrowBack />
        {BACK}
      </StyledDiv>
      <Child {...prop} />
    </>
  );
