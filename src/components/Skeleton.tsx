const Skeleton: React.FC = () => {
    return (
      <div className="animate-pulse p-4 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-5/6"></div>
      </div>
    );
  };
  
  export default Skeleton;
  