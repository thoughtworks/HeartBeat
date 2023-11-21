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
import {
  NotificationButton,
  NotificationButtonProps,
} from '@src/components/Common/NotificationButton/NotificationButton'

const Header = (props: NotificationButtonProps) => {
  const location = useLocation()
  const navigate = useNavigate()

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
        {shouldShowNotificationIcon() && props && (
          <NotificationIconContainer title='Notification' data-testid='NotificationButton'>
            <NotificationButton {...props} />
          </NotificationIconContainer>
        )}
        {shouldShowHomeIcon() && (
          <HomeIconContainer title='Home' onClick={goHome}>
            <HomeIconElement />
          </HomeIconContainer>
        )}
      </IconContainer>
    </LogoWarp>
  )
}
export default Header
