import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { REQUIRE_DATA } from '@src/constants'
import React, { useState } from 'react'
import { RequireDataSelections } from '@src/components/metrics/ConfigStep/MetricsTypeCheckbox/style'
interface MetricsTypeCheckboxProps {
  onHandleRequireData: (value: string[]) => void
}

export const MetricsTypeCheckbox: React.FC<MetricsTypeCheckboxProps> = (props) => {
  const { onHandleRequireData } = props
  const [requireData, setRequireData] = useState<string[]>([])
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)
  const changeRequireData = (event: SelectChangeEvent<typeof requireData>) => {
    const {
      target: { value },
    } = event
    onHandleRequireData([...value])
    setRequireData(value as string[])
    if (value.length === 0) {
      setIsEmptyProjectData(true)
    } else {
      setIsEmptyProjectData(false)
    }
  }
  return (
    <RequireDataSelections variant='standard' required error={isEmptyRequireData}>
      <InputLabel id='require-data-multiple-checkbox-label'>Required Data</InputLabel>
      <Select
        labelId='require-data-multiple-checkbox-label'
        multiple
        value={requireData}
        onChange={changeRequireData}
        renderValue={(selected) => selected.join(',')}
      >
        {REQUIRE_DATA.map((data) => (
          <MenuItem key={data} value={data}>
            <Checkbox checked={requireData.indexOf(data) > -1} />
            <ListItemText primary={data} />
          </MenuItem>
        ))}
      </Select>
      {isEmptyRequireData && <FormHelperText>Metrics is required</FormHelperText>}
    </RequireDataSelections>
  )
}
