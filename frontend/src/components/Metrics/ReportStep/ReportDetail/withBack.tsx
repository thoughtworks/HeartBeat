import React from 'react';
import { styled } from '@mui/material/styles';
import { ArrowBack } from '@mui/icons-material';
import { BACK } from '@src/constants/resources';
interface Property {
  onBack: () => void;
}

const StyledDiv = styled('div')`
  display: flex;
  align-items: center;
  width: max-content;
  z-index: 2;
  margin-bottom: 2.5rem;
  color: #595959;
  cursor: pointer;
  font-size: 1rem;
`;

const StyledArrowBack = styled(ArrowBack)`
  width: 1.5rem;
  margin-right: 0.5rem;
`;

export const withGoBack =
  <P extends Property>(Child: React.ComponentType<P>) =>
  (prop: P) =>
    (
      <>
        <StyledDiv onClick={prop.onBack}>
          <StyledArrowBack />
          {BACK}
        </StyledDiv>
        <Child {...prop} />
      </>
    );
