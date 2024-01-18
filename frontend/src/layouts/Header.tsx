import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '@src/assets/Logo.svg';

import { PROJECT_NAME } from '@src/constants/commons';
import {
  HomeIconContainer,
  HomeIconElement,
  IconContainer,
  LogoContainer,
  LogoImage,
  LogoTitle,
  LogoWarp,
  StyledHeaderInfo,
  StyledVersion,
} from '@src/layouts/style';
import { useEffect } from 'react';
import { headerClient } from '@src/clients/header/HeaderClient';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { getVersion, saveVersion } from '@src/context/header/headerSlice';
import { useAppSelector } from '@src/hooks';
import { isEmpty } from 'lodash';
import { resetImportedData } from '@src/context/config/configSlice';
import { resetStep } from '@src/context/stepper/StepperSlice';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const version = useAppSelector(getVersion);

  const goHome = () => {
    dispatch(resetStep());
    dispatch(resetImportedData());
    navigate('/');
  };

  const shouldShowHomeIcon = () => {
    return ['/metrics', '/error-page'].includes(location.pathname);
  };

  useEffect(() => {
    if (isEmpty(version)) {
      headerClient.getVersion().then((res) => {
        dispatch(saveVersion(res));
      });
    }
  }, []);

  return (
    <LogoWarp data-test-id={'Header'}>
      <StyledHeaderInfo>
        <LogoContainer onClick={goHome}>
          <LogoImage src={Logo} alt='logo' />
          <LogoTitle title={PROJECT_NAME}>{PROJECT_NAME}</LogoTitle>
        </LogoContainer>
        {version && <StyledVersion>v{version}</StyledVersion>}
      </StyledHeaderInfo>
      <IconContainer>
        {shouldShowHomeIcon() && (
          <HomeIconContainer title='Home' onClick={goHome}>
            <HomeIconElement />
          </HomeIconContainer>
        )}
      </IconContainer>
    </LogoWarp>
  );
};
export default Header;
