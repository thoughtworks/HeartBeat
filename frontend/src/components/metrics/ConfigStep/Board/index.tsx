import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_FIELDS, BOARD_TYPES, emailRegExp, ZERO } from '@src/constants'
import React, { useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  VerifyButton,
} from '@src/components/metrics/ConfigStep/Board/style'

export const Board = () => {
  const [boardField, seBoardField] = useState({
    board: { value: BOARD_TYPES.JIRA, isError: false, helpText: '' },
    boardId: { value: '', isError: false, helpText: '' },
    email: { value: '', isError: false, helpText: '' },
    projectKey: { value: '', isError: false, helpText: '' },
    site: { value: '', isError: false, helpText: '' },
    token: { value: '', isError: false, helpText: '' },
  })
  const fields = Object.values(boardField)

  const checkFiledValid = (type: string, value: string): boolean =>
    type === BOARD_FIELDS[2] ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (key: string, value: string) => {
    const isError = !checkFiledValid(key, value)
    seBoardField({
      ...boardField,
      [key]: {
        value,
        isError,
        helpText: isError ? ` ${key} is required` : '',
      },
    })
  }

  return (
    <BoardSection>
      <BoardTitle>board</BoardTitle>
      <BoardForm>
        {BOARD_FIELDS.map((filedTitle, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={fields[index].value}>
              <InputLabel id='board-type-checkbox-label'>board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={boardField.board.value}
                onChange={(e) => {
                  onFormUpdate('board', e.target.value)
                }}
              >
                {Object.values(BOARD_TYPES).map((data) => (
                  <MenuItem key={data} value={data}>
                    <ListItemText primary={data} />
                  </MenuItem>
                ))}
              </Select>
            </BoardTypeSelections>
          ) : (
            <BoardTextField
              key={index}
              required
              label={filedTitle}
              variant='standard'
              value={fields[index].value}
              onChange={(e) => {
                onFormUpdate(filedTitle, e.target.value)
              }}
              error={fields[index].isError}
              helperText={fields[index].helpText}
            />
          )
        )}
        <BoardButtonGroup>
          <VerifyButton type='submit'>Verify</VerifyButton>
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
