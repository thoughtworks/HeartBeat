import styled from '@emotion/styled'
import { TextField, Typography } from '@mui/material'
import { theme } from '@src/theme'

export const StyledItem = styled.div`
  display: flex;
  align-items: center;
`

export const StyledContent = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: space-between;
`

export const StyledUnit = styled(TextField)`
  position: relative;
  bottom: 0.56rem;

  & .MuiInputBase-input {
    overflow: hidden;
    text-overflow: 'ellipsis';
    font-size: 0.6rem;
  }

  & .MuiInputBase-input.Mui-disabled {
    -webkit-text-fill-color: ${theme.main.secondColor};
  }
`

export const StyledValue = styled(Typography)`
  font-weight: bold;
  width: 100%;
  font-size: 2.5rem;
`

export const StyledSubtitle = styled(TextField)`
  width: 100%;
  & .MuiInputBase-input {
    overflow: hidden;
    text-overflow: 'ellipsis';
    font-size: 0.8rem;
  }
  & .MuiInputBase-input .Mui-disabled {
    -webkit-text-fill-color: ${theme.main.secondColor};
    opacity: 0.65;
  }
`

export const StyledDividingLine = styled.img({
  marginRight: '2.25rem',
})

export const StyledValueSection = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const StyledExtraValue = styled.div({
  width: '100%',
  fontSize: '1rem',
  fontWeight: 400,
  paddingTop: '1rem',
  whiteSpace: 'nowrap',
})
