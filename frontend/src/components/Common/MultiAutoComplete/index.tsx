import { Checkbox, createFilterOptions, TextField } from '@mui/material'
import React from 'react'
import { StyledAutocompleted } from './styles'

type Props = {
  optionList: string[]
  selectedOption: string[]
  onChangeHandler: (event: React.SyntheticEvent, value: string[], reason?: string, details?: string) => void
  isSelectAll: boolean
  textFieldLabel: string
  isError: boolean
}
const MultiAutoComplete = ({
  optionList,
  selectedOption,
  onChangeHandler,
  isSelectAll,
  textFieldLabel,
  isError,
}: Props) => {
  const filter = createFilterOptions()

  return (
    <StyledAutocompleted
      multiple
      options={optionList}
      disableCloseOnSelect
      value={selectedOption}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        return ['All', ...filtered]
      }}
      getOptionLabel={(option: string) => option}
      onChange={onChangeHandler}
      renderOption={(props, option, { selected }) => {
        const selectAllProps =
          option === 'All' // To control the state of 'select-all' checkbox
            ? { checked: isSelectAll }
            : {}
        return (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} {...selectAllProps} />
            {option}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField {...params} required error={isError} variant='standard' label={textFieldLabel} />
      )}
    />
  )
}

export default MultiAutoComplete
