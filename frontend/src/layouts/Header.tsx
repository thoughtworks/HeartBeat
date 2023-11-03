import { useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'

import Logo from '@src/assets/Logo.svg'
import styled from '@emotion/styled'
import { theme } from '@src/theme'
import { PROJECT_NAME } from '@src/constants'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  const shouldShowHomeIcon = () => {
    return !['/', '/index.html'].includes(location.pathname)
  }

  const LogoWarp = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 1rem',
    alignItems: 'center',
    backgroundColor: theme.main.backgroundColor,
    fontFamily: 'Times',
  })

  const LogoTitle = styled.span({
    color: theme.main.color,
    fontWeight: 'bold',
    fontSize: '1.5rem',
  })

  const LogoImage = styled.img({
    height: '4rem',
    width: '4rem',
  })

  const LogoContainer = styled.div({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: theme.main.color,
  })

  const HomeIconContainer = styled.span`
    cursor: pointer;
  `

  const HomeIconElement = styled(HomeIcon)`
    color: ${theme.main.color};
  `

  return (
    <LogoWarp>
      <LogoContainer onClick={goHome}>
        <LogoImage src={Logo} alt='logo' />
        <LogoTitle title={PROJECT_NAME}>{PROJECT_NAME}</LogoTitle>
      </LogoContainer>
      {shouldShowHomeIcon() && (
        <HomeIconContainer title='Home' onClick={goHome}>
          <HomeIconElement />
        </HomeIconContainer>
      )}
    </LogoWarp>
  )
}
export default Header
