import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { StyledTypeSelections } from '@src/components/Common/ConfigForms';
import { Controller, useFormContext } from 'react-hook-form';

interface IFormSingleSelect {
  name: string;
  options: string[];
  labelText: string;
  labelId?: string;
  selectLabelId?: string;
  selectAriaLabel?: string;
}

export const FormSingleSelect = ({
  name,
  options,
  labelText,
  labelId,
  selectLabelId,
  selectAriaLabel,
}: IFormSingleSelect) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <StyledTypeSelections variant='standard' required>
            <InputLabel id={labelId}>{labelText}</InputLabel>
            <Select {...field} labelId={selectLabelId} aria-label={selectAriaLabel}>
              {options.map((data) => (
                <MenuItem key={data} value={data}>
                  <ListItemText primary={data} />
                </MenuItem>
              ))}
            </Select>
          </StyledTypeSelections>
        );
      }}
    />
  );
};
