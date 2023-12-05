import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '@src/assets/Logo.svg'

import { PROJECT_NAME } from '@src/constants/commons'
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
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'

const Header = (props: useNotificationLayoutEffectInterface) => {
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
    <LogoWarp data-test-id={'Header'}>
      <LogoContainer onClick={goHome}>
        <LogoImage src={Logo} alt='logo' />
        <LogoTitle title={PROJECT_NAME}>{PROJECT_NAME}</LogoTitle>
      </LogoContainer>
      <IconContainer>
        {shouldShowNotificationIcon() && (
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
