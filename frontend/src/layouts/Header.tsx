import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

import Logo from '@src/assets/Logo.svg';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className='bg-indigo-600 h-16 flex justify-between p-2 items-center'>
      <div className='flex items-center cursor-pointer' onClick={goHome}>
        <img className='h-12 w-12' src={Logo} alt='logo' />
        <span className='text-white text-xl font-bold'>Heartbeat</span>
      </div>
      {location.pathname !== '/' && (
        <span className='cursor-pointer' title='Home' onClick={goHome}>
          <HomeIcon className='text-white' />
        </span>
      )}
    </div>
  );
};
export default Header;
