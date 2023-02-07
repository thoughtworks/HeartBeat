import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import React, { useState } from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR, REQUIRE_DATA } from '@src/constants'

export const ConfigStep = () => {
  const [projectName, setProjectName] = useState<string>('')
  const [isEmptyProjectName, setIsEmptyProjectName] = useState<boolean>(false)

  const [requireData, setRequireData] = useState<string[]>([])
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)
  const changeRequireData = (event: SelectChangeEvent<typeof requireData>) => {
    const {
      target: { value },
    } = event
    setRequireData(value as string[])
    if (value.length === 0) {
      setIsEmptyProjectData(true)
    } else {
      setIsEmptyProjectData(false)
    }
  }

  return (
    <>
      <TextField
        sx={{ m: 1, minWidth: 150, maxWidth: 500 }}
        required
        label='Project Name'
        variant='standard'
        value={projectName}
        onChange={(e) => {
          setProjectName(e.target.value)
          setIsEmptyProjectName(e.target.value === '')
        }}
        error={isEmptyProjectName}
        helperText={isEmptyProjectName ? 'Project Name is required' : ''}
        inputProps={{ 'data-testid': 'testProjectName' }}
      />

      <h3>Collection Date</h3>
      <RadioGroup defaultValue={REGULAR_CALENDAR}>
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
      <FormControl variant='standard' required sx={{ m: 1, minWidth: 150, maxWidth: 500 }} error={isEmptyRequireData}>
        <InputLabel id='demo-multiple-checkbox-label'>Require Data</InputLabel>
        <Select
          labelId='demo-multiple-checkbox-label'
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
      </FormControl>
    </>
  )
}
