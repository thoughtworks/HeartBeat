import { styled } from '@mui/material/styles'
import { Autocomplete } from '@mui/material'

export const StyledAutocompleted = styled(Autocomplete)`
  & .MuiAutocomplete-tag {
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.26);
    font-size: 10.5pt;
  }
`
