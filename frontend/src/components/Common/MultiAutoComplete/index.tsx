import { Checkbox, createFilterOptions, TextField } from '@mui/material'
import React from 'react'
import { StyledAutocompleted } from './styles'

type Props = {
  optionList: string[]
  selectedOption: string[]
  // There is an any because m-ui strictly define its type, but the parameters are not that strict. Maybe because of version diff
  onChangeHandler: any
  isSelectAll: boolean
  textFieldLabel: string
  isError: boolean
  testId?: string
}
const MultiAutoComplete = ({
  optionList,
  selectedOption,
  onChangeHandler,
  isSelectAll,
  textFieldLabel,
  isError,
  testId,
}: Props) => {
  const filter = createFilterOptions()

  return (
    <StyledAutocompleted
      multiple
      data-testid={testId}
      options={optionList}
      disableCloseOnSelect
      value={selectedOption}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        return ['All', ...filtered]
      }}
      getOptionLabel={(option) => option as string}
      onChange={onChangeHandler}
      renderOption={(props, option, { selected }) => {
        const selectAllProps = option === 'All' ? { checked: isSelectAll } : {}
        return (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} {...selectAllProps} />
            {option as string}
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
