
const PagesLayout = ({ title, actions, children }: { title: string, actions?: React.ReactNode, children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center pb-8 px-4 ">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">{title}</h1>
          {actions && <div>{actions}</div>}
        </div>

        {/* Main content */}
        <div className="w-full p-4 space-y-6 bg-white rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PagesLayout;