import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { REQUIRED_DATAS } from '@src/constants'
import React, { useState } from 'react'
import { RequireDataSelections } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox/style'
import { Board } from '@src/components/Metrics/ConfigStep/Board'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { selectRequiredData, updateRequiredData } from '@src/features/config/configSlice'

export const MetricsTypeCheckbox = () => {
  const dispatch = useAppDispatch()
  const requireData = useAppSelector(selectRequiredData)
  const [isShowBoard, setIsShowBoard] = useState(false)
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)
  const [isShowPipelineTool, setIsShowPipelineTool] = useState(false)

  const handleRequireDataChange = (event: SelectChangeEvent<typeof requireData>) => {
    const {
      target: { value },
    } = event
    dispatch(updateRequiredData(value))
    value.length === 0 ? setIsEmptyProjectData(true) : setIsEmptyProjectData(false)
    setIsShowBoard(
      value.includes(REQUIRED_DATAS[0]) || value.includes(REQUIRED_DATAS[1]) || value.includes(REQUIRED_DATAS[2])
    )
    setIsShowPipelineTool(
      value.includes(REQUIRED_DATAS[3]) ||
        value.includes(REQUIRED_DATAS[4]) ||
        value.includes(REQUIRED_DATAS[5]) ||
        value.includes(REQUIRED_DATAS[6])
    )
  }
  return (
    <>
      <RequireDataSelections variant='standard' required error={isEmptyRequireData}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required Data</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={requireData}
          onChange={handleRequireDataChange}
          renderValue={(selected) => selected.join(',')}
        >
          {REQUIRED_DATAS.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={requireData.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyRequireData && <FormHelperText>Metrics is required</FormHelperText>}
      </RequireDataSelections>
      {isShowBoard && <Board />}
      {isShowPipelineTool && <PipelineTool />}
    </>
  )
}
