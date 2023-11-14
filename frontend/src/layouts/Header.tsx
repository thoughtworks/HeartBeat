import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '@src/assets/Logo.svg'

import { PROJECT_NAME } from '@src/constants'
import { useAppSelector } from '@src/hooks/useAppDispatch'
import { selectStepNumber } from '@src/context/stepper/StepperSlice'
import {
  AlertIconElement,
  HomeIconContainer,
  HomeIconElement,
  IconContainer,
  LogoContainer,
  LogoImage,
  LogoTitle,
  LogoWarp,
} from '@src/layouts/style'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const activeStep = useAppSelector(selectStepNumber)

  const goHome = () => {
    navigate('/')
  }

  const onNotificationClick = () => {
    // todo
  }

  const shouldShowHomeIcon = () => {
    return !['/', '/index.html'].includes(location.pathname)
  }

  const shouldShowNotificationIcon = () => {
    return activeStep == 2 && ['/metrics'].includes(location.pathname)
  }

  return (
    <LogoWarp>
      <LogoContainer onClick={goHome}>
        <LogoImage src={Logo} alt='logo' />
        <LogoTitle title={PROJECT_NAME}>{PROJECT_NAME}</LogoTitle>
      </LogoContainer>
      <IconContainer>
        {shouldShowNotificationIcon() && (
          <HomeIconContainer title='Notification' onClick={onNotificationClick}>
            <AlertIconElement />
          </HomeIconContainer>
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
