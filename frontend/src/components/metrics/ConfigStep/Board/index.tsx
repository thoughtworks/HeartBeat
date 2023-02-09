import { InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { BOARD_TYPES } from '@src/constants'
import React, { useState } from 'react'
import { BoardSection, BoardTypeSelections } from '@src/components/metrics/ConfigStep/Board/style'

export const Board = () => {
  const [boardType, setBoardType] = useState<string>(BOARD_TYPES.JIRA)
  const changeBoardType = (event: SelectChangeEvent<typeof boardType>) => {
    const {
      target: { value },
    } = event
    setBoardType(value)
  }
  return (
    <BoardSection>
      <h2>board</h2>
      <BoardTypeSelections variant='standard' required>
        <InputLabel id='board-type-checkbox-label'>board</InputLabel>
        <Select labelId='board-type-checkbox-label' value={boardType} onChange={changeBoardType}>
          {Object.values(BOARD_TYPES).map((data) => (
            <MenuItem key={data} value={data}>
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
      </BoardTypeSelections>
    </BoardSection>
  )
}
