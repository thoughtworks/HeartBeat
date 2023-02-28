import { CircularProgress, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, emailRegExp, ZERO, EMAIL, CONFIG_TITLE } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardLoadingDrop,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { changeBoardVerifyState, isBoardVerified } from '@src/features/board/boardSlice'
import { selectBoardFields, updateBoardFields } from '@src/features/config/configSlice'
import { useVerifyBoardState } from '@src/hooks/useVerifyBoardState'
import { ErrorNotification } from '@src/components/ErrorNotifaction'
import { NoDoneCardPop } from '@src/components/Metrics/ConfigStep/NoDoneCardPop'

export const Board = () => {
  const dispatch = useAppDispatch()
  const isVerified = useAppSelector(isBoardVerified)
  const boardFields = useAppSelector(selectBoardFields)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const [isShowNoDoneCard, setIsNoDoneCard] = useState(false)
  const [isShowErrorNotification, setIsShowErrorNotification] = useState(false)
  const { verifyJira, isVerifyLoading } = useVerifyBoardState()
  const [fields, setFields] = useState([
    {
      key: 'board',
      value: boardFields.board,
      isValid: true,
    },
    {
      key: 'boardId',
      value: boardFields.boardId,
      isValid: true,
    },
    {
      key: 'email',
      value: boardFields.email,
      isValid: true,
    },
    {
      key: 'projectKey',
      value: boardFields.projectKey,
      isValid: true,
    },
    {
      key: 'site',
      value: boardFields.site,
      isValid: true,
    },
    {
      key: 'token',
      value: boardFields.token,
      isValid: true,
    },
  ])

  useEffect(() => {
    if (isShowErrorNotification)
      setTimeout(() => {
        setIsShowErrorNotification(false)
      }, 2000)
  }, [isShowErrorNotification])

  const initBoardFields = () => {
    const newFields = fields.map((field, index) => {
      field.value = index === ZERO ? BOARD_TYPES.JIRA : ''
      return field
    })
    setFields(newFields)
    dispatch(changeBoardVerifyState(false))
  }

  const checkFiledValid = (type: string, value: string): boolean =>
    type === EMAIL ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (index: number, value: string) => {
    if (index === ZERO) {
      const newFieldsValue = fields.map((field, index) => {
        if (index !== ZERO) field.value = ''
        return field
      })
      setFields(newFieldsValue)
      dispatch(changeBoardVerifyState(false))
      return
    }
    const newFieldsValue = fields.map((field, fieldIndex) => {
      if (fieldIndex === index) {
        field.value = value
        field.isValid = checkFiledValid(fields[index].key, value)
      }
      return field
    })
    setIsDisableVerifyButton(!newFieldsValue.every((field) => field.isValid && field.value != ''))
    setFields(newFieldsValue)
  }

  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      updateBoardFields({
        board: fields[0].value,
        boardId: fields[1].value,
        email: fields[2].value,
        projectKey: fields[3].value,
        site: fields[4].value,
        token: fields[5].value,
      })
    )
    await verifyJira().then((res) => {
      if (res) {
        dispatch(changeBoardVerifyState(res.isBoardVerify))
        dispatch(updateBoardFields(res.response))
        setIsNoDoneCard(res.isNoDoneCard)
        setIsShowErrorNotification(res.isShowErrorNotification)
      }
    })
  }

  const handleResetBoardFields = () => {
    initBoardFields()
    setIsDisableVerifyButton(true)
    dispatch(changeBoardVerifyState(false))
  }

  return (
    <BoardSection>
      <NoDoneCardPop isOpen={isShowNoDoneCard} onClose={() => setIsNoDoneCard(false)} />
      {isShowErrorNotification && <ErrorNotification message={'Jira verify failed'} />}
      {isVerifyLoading && (
        <BoardLoadingDrop open={isVerifyLoading} data-testid='circularProgress'>
          <CircularProgress size='8rem' />
        </BoardLoadingDrop>
      )}
      <BoardTitle>{CONFIG_TITLE.BOARD}</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)} onReset={handleResetBoardFields}>
        {fields.map((filed, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={index}>
              <InputLabel id='board-type-checkbox-label'>board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={filed.value}
                onChange={(e) => {
                  onFormUpdate(index, e.target.value)
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
              label={filed.key}
              variant='standard'
              value={filed.value}
              onChange={(e) => {
                onFormUpdate(index, e.target.value)
              }}
              error={!filed.isValid}
              helperText={!filed.isValid ? `${filed.key} is required` : ''}
            />
          )
        )}
        <BoardButtonGroup>
          {isVerified && !isVerifyLoading ? (
            <VerifyButton>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isVerifyLoading}>
              Verify
            </VerifyButton>
          )}

          {isVerified && !isVerifyLoading && <ResetButton type='reset'>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
