import RotateRightIcon from '@mui/icons-material/RotateRight';

export const Loading = () => {
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <span className='flex flex-col items-center'>
        <RotateRightIcon className='animate-spin text-lg' />
        <span>Loading...</span>
      </span>
    </div>
  );
};
