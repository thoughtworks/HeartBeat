import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { BOARD_TYPES, REQUIRED_DATA_LIST, SOURCE_CONTROL_TYPES } from '@src/constants'
import React, { useState } from 'react'
import { RequireDataSelections } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox/style'
import { Board } from '@src/components/Metrics/ConfigStep/Board'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { selectMetrics, updateBoard, updateMetrics, updateSourceControlFields } from '@src/context/config/configSlice'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import { updateBoardVerifyState } from '@src/context/board/boardSlice'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'
import { updateSourceControlVerifyState } from '@src/context/sourceControl/sourceControlSlice'

export const MetricsTypeCheckbox = () => {
  const dispatch = useAppDispatch()
  const requireData = useAppSelector(selectMetrics)
  const [isShowBoard, setIsShowBoard] = useState(false)
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)
  const [isShowPipelineTool, setIsShowPipelineTool] = useState(false)
  const [isShowSourceControl, setIsShowSourceControl] = useState(false)

  const handleRequireDataChange = (event: SelectChangeEvent<typeof requireData>) => {
    const {
      target: { value },
    } = event
    dispatch(updateBoardVerifyState(false))
    dispatch(
      updateBoard({
        type: BOARD_TYPES.JIRA,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
    dispatch(updateSourceControlFields({ sourceControl: SOURCE_CONTROL_TYPES.GIT_HUB, token: '' }))
    dispatch(updateSourceControlVerifyState(false))
    dispatch(updateMetrics(value))
    value.length === 0 ? setIsEmptyProjectData(true) : setIsEmptyProjectData(false)
    setIsShowBoard(
      value.includes(REQUIRED_DATA_LIST[0]) ||
        value.includes(REQUIRED_DATA_LIST[1]) ||
        value.includes(REQUIRED_DATA_LIST[2])
    )
    setIsShowPipelineTool(
      value.includes(REQUIRED_DATA_LIST[3]) ||
        value.includes(REQUIRED_DATA_LIST[4]) ||
        value.includes(REQUIRED_DATA_LIST[5]) ||
        value.includes(REQUIRED_DATA_LIST[6])
    )
    setIsShowSourceControl(value.includes(REQUIRED_DATA_LIST[3]))
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
          {REQUIRED_DATA_LIST.map((data) => (
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
      {isShowSourceControl && <SourceControl />}
    </>
  )
}
