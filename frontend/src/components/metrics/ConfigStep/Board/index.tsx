import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { BOARD_TYPE } from '@src/constants'
import React, { useState } from 'react'
import { BoardSection, BoardTypeSelections } from '@src/components/metrics/ConfigStep/Board/style'

export const Board = () => {
  const [boardType, setBoardType] = useState<string[]>(['Jira'])
  const [isEmptyBoardType, setIsEmptyBoardType] = useState<boolean>(false)
  const changeBoardType = (event: SelectChangeEvent<typeof boardType>) => {
    const {
      target: { value },
    } = event
    setBoardType(value as string[])
    if (value.length === 0) {
      setIsEmptyBoardType(true)
    } else {
      setIsEmptyBoardType(false)
    }
  }
  return (
    <BoardSection>
      <h2>board</h2>
      <BoardTypeSelections variant='standard' required error={isEmptyBoardType}>
        <InputLabel id='require-data-multiple-checkbox-label'>board</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={boardType}
          onChange={changeBoardType}
          renderValue={(selected) => selected.join(',')}
        >
          {BOARD_TYPE.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={boardType.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyBoardType && <FormHelperText>Metrics is required</FormHelperText>}
      </BoardTypeSelections>
    </BoardSection>
  )
}
