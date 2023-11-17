import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '@src/assets/Logo.svg'

import { METRICS_STEPS, PROJECT_NAME } from '@src/constants'
import { useAppSelector } from '@src/hooks/useAppDispatch'
import { selectStepNumber } from '@src/context/stepper/StepperSlice'
import {
  HomeIconContainer,
  HomeIconElement,
  IconContainer,
  LogoContainer,
  LogoImage,
  LogoTitle,
  LogoWarp,
  NotificationIconContainer,
} from '@src/layouts/style'
import {
  NotificationButton,
  NotificationButtonProps,
} from '@src/components/Common/NotificationButton/NotificationButton'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const activeStep = useAppSelector(selectStepNumber)

  const goHome = () => {
    navigate('/')
  }

  const notificationProps = (value: number): NotificationButtonProps => {
    switch (value) {
      case METRICS_STEPS.REPORT:
        return { title: 'The file needs to be exported within thirty minutes, otherwise it will expire.', open: true }
      case METRICS_STEPS.CONFIG:
      case METRICS_STEPS.METRICS:
      default:
        return { title: '', open: false }
    }
  }

  const shouldShowHomeIcon = () => {
    return !['/', '/index.html'].includes(location.pathname)
  }

  const shouldShowNotificationIcon = () => {
    return ['/metrics'].includes(location.pathname)
  }

  return (
    <LogoWarp>
      <LogoContainer onClick={goHome}>
        <LogoImage src={Logo} alt='logo' />
        <LogoTitle title={PROJECT_NAME}>{PROJECT_NAME}</LogoTitle>
      </LogoContainer>
      <IconContainer>
        {shouldShowNotificationIcon() && (
          <NotificationIconContainer title='Notification'>
            <NotificationButton {...notificationProps(activeStep)} />
          </NotificationIconContainer>
        )}
        {shouldShowHomeIcon() && (
          <IconContainer title='Home' onClick={goHome}>
            <HomeIconElement />
          </IconContainer>
        )}
      </IconContainer>
    </LogoWarp>
  )
}
export default Header
