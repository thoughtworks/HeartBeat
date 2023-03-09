import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Divider } from '@src/components/Metrics/MetricsStep/Crews/style'

interface crewsProps {
  options: string[]
  title: string
  label: string
}
export const Crews = ({ options, title, label }: crewsProps) => {
  const [isEmptyCrewData, setIsEmptyCrewData] = useState<boolean>(false)
  const [selectedCrews, setSelectedCrews] = useState(options)
  const isAllSelected = options.length > 0 && selectedCrews.length === options.length

  useEffect(() => {
    setIsEmptyCrewData(selectedCrews.length === 0)
  }, [selectedCrews])

  const handleCrewChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    if (value[value.length - 1] === 'All') {
      setSelectedCrews(selectedCrews.length === options.length ? [] : options)
      return
    }
    setSelectedCrews([...value])
  }
  return (
    <>
      <Divider>
        <span>{title}</span>
      </Divider>
      <FormControl variant='standard' required error={isEmptyCrewData}>
        <InputLabel id='crew-data-multiple-checkbox-label'>{label}</InputLabel>
        <Select
          labelId='crew-data-multiple-checkbox-label'
          multiple
          value={selectedCrews}
          onChange={handleCrewChange}
          renderValue={(selectedCrews: string[]) => selectedCrews.join(',')}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {options.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={selectedCrews.includes(data)} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyCrewData && <FormHelperText>{label} is required</FormHelperText>}
      </FormControl>
    </>
  )
}