import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  onClick?: () => void; 
  className?: string; 
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  onClick,
  className = "",
  children = "Back",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50 focus:ring focus:ring-indigo-200 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default BackButton;