import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { Dispatch, forwardRef, SetStateAction } from 'react'
import { ErrorBar } from './style'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorNotification = (props: {
  message: string
  closeErrorNotification: Dispatch<SetStateAction<boolean>>
}) => {
  const { message, closeErrorNotification } = props
  const handleClose = () => {
    closeErrorNotification(false)
  }
  return (
    <ErrorBar open={true} autoHideDuration={2000} onClose={handleClose}>
      <Alert severity='error'>{message}</Alert>
    </ErrorBar>
  )
}
