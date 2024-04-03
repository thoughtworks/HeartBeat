import { StyledButton } from '@src/components/Common/AddButtonOneLine/style';
import { ButtonProps } from '@mui/material';
import { Add } from '@mui/icons-material';
import React, { ReactNode } from 'react';

interface IAddButtonProps {
  onClick: () => void;
  text: ReactNode;
}

export const AddButton = ({ text, onClick, ...restProps }: IAddButtonProps & ButtonProps) => {
  return (
    <StyledButton {...restProps} startIcon={<Add />} onClick={onClick}>
      {text}
    </StyledButton>
  );
};
