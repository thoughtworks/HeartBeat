import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { forwardRef } from 'react'
import { ErrorBar } from './style'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorNotification = (props: { message: string }) => {
  const { message } = props
  return (
    <ErrorBar open={true}>
      <Alert severity='error'>{message}</Alert>
    </ErrorBar>
  )
}
