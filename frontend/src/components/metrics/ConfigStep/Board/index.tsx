import { InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_FIELDS, BOARD_TYPES, emailRegExp, ZERO, INIT_BOARD_BOARD_STATE, EMAIL } from '@src/constants'
import React, { useEffect, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/metrics/ConfigStep/Board/style'

export const Board = () => {
  const [boardField, setBoardField] = useState(INIT_BOARD_BOARD_STATE)
  const fields = Object.values(boardField)

  const checkFiledValid = (type: string, value: string): boolean =>
    type === EMAIL ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (key: string, value: string) => {
    const isError = !checkFiledValid(key, value)
    setBoardField({
      ...boardField,
      [key]: {
        value,
        isError,
        helpText: isError ? ` ${key} is required` : '',
      },
    })
  }

  useEffect(() => {
    setBoardField({
      ...boardField,
      boardId: INIT_BOARD_BOARD_STATE.boardId,
      email: INIT_BOARD_BOARD_STATE.email,
      projectKey: INIT_BOARD_BOARD_STATE.projectKey,
      site: INIT_BOARD_BOARD_STATE.site,
      token: INIT_BOARD_BOARD_STATE.token,
    })
  }, [boardField.board])

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
          <ResetButton onClick={() => setBoardField(INIT_BOARD_BOARD_STATE)}>Reset</ResetButton>
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
