import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material'

export const CollectionDateContainer = styled('div')`
  display: flex;
  align-items: flex-end;
  margin: 2rem auto 0;
`
styled('strong')`
  margin-left: 0.25rem;
  font-size: 0.875rem;
`
export const TextBox = styled(Paper)`
  width: 2.5rem;
  height: 1.25rem;
  padding: 0.75rem;
  border: 0 solid #ccc;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const GreyTransitionBox = styled('div')`
  width: 10rem;
  height: 2.8rem;
  background-color: rgba(204, 204, 204, 0.28);
  border: 0;
  border-radius: 0;
`
export const StartColoredTopArea = styled('div')`
  width: 100%;
  height: 0.625rem;
  background-color: #b9c4cc;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
`

export const EndColoredTopArea = styled('div')`
  width: 100%;
  height: 10px;
  background-color: #3498db;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
`

export const StartTitle = styled('div')`
  font-size: 0.625rem;
  color: #b9c4cc;
  font-family: Georgia, serif;
  letter-spacing: 0.1em;
  text-align: center;
  padding: 0.25rem 0;
  font-weight: bold;
  margin-bottom: 0.125rem;
`
export const EndTitle = styled('div')`
  font-size: 0.625rem;
  color: #3498db;
  text-align: center;
  font-family: Georgia, serif;
  letter-spacing: 0.1em;
  padding: 0.25rem 0;
  font-weight: bold;
  margin-bottom: 0.125rem;
`

export const DateText = styled('div')`
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  font-family: monospace;
`

export const MonthYearText = styled('div')`
  font-size: 0.625rem;
  margin-bottom: 0.125rem;
  font-family: monospace;
`
