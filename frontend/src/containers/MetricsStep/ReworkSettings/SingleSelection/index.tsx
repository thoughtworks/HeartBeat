import { Autocomplete, TextField } from '@mui/material';
import { Z_INDEX } from '@src/constants/commons';
import { FormControlWrapper } from './style';
import React from 'react';

interface Props {
  options: string[];
  label: string;
  value: string | null;
  onValueChange: (value: string) => void;
}

export const SingleSelection = ({ options, label, value, onValueChange }: Props) => {
  const labelId = `rework-single-selection-${label.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <FormControlWrapper variant='standard' required>
      <Autocomplete
        disableClearable
        data-testid={labelId}
        options={options}
        value={value as string | undefined}
        onChange={(event, newValue: string) => onValueChange(newValue)}
        renderInput={(params) => <TextField required {...params} label={label} variant='standard' />}
        slotProps={{
          popper: {
            sx: {
              zIndex: Z_INDEX.DROPDOWN,
            },
          },
        }}
      />
    </FormControlWrapper>
  );
};
