import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { forwardRef } from 'react'
import { ErrorBar } from './style'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorNotification = (props: { message: string }) => {
  return (
    <ErrorBar open={true} autoHideDuration={6000}>
      <Alert severity='error'>{props.message}</Alert>
    </ErrorBar>
  )
}
