import { styled } from '@mui/material/styles';
import { Autocomplete } from '@mui/material';

export interface ITargetFieldType {
  name: string;
  key: string;
  flag: boolean;
}

export const TypedStyledAutocompleted = styled(Autocomplete<ITargetFieldType, boolean, boolean>)`
  & .MuiAutocomplete-tag {
    background-color: transparent;
    border: 0.05rem solid rgba(0, 0, 0, 0.26);
    font-size: 0.9rem;
  }
`;

export const StyledAutocompleted = styled(Autocomplete)`
  & .MuiAutocomplete-tag {
    background-color: transparent;
    border: 0.05rem solid rgba(0, 0, 0, 0.26);
    font-size: 0.9rem;
  }
`;
