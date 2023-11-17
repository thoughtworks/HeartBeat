import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '@src/assets/Logo.svg'

import { PROJECT_NAME } from '@src/constants'
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
import { NotificationButton } from '@src/components/Common/NotificationButton/NotificationButton'
import { useNotificationContext } from '@src/hooks/useNotificationContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const notificationContext = useNotificationContext()

  const goHome = () => {
    navigate('/')
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
            <NotificationButton {...notificationContext} />
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
