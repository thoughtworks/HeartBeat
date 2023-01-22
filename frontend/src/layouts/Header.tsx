import logo from '../assets/logo.svg';
const Header = () => {
  return (
    <div className='bg-indigo-600 h-16 justify-evenly'>
      <div className='flex'>
        <img className='h-1' src={logo} alt='logo' />
        <title>Heartbeat</title>
      </div>
    </div>
  );
};
export default Header;
