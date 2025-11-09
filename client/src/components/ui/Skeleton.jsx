const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 bg-gray-200 rounded',
    text: 'h-4 bg-gray-200 rounded',
    circular: 'h-12 w-12 bg-gray-200 rounded-full',
    rectangular: 'h-32 bg-gray-200 rounded',
  };

  return (
    <div
      className={`${variants[variant]} animate-pulse ${className}`}
    />
  );
};

export default Skeleton;




