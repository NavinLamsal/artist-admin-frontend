import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { MoveLeft } from "lucide-react";

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
    <Button
      variant={"outline"}
      onClick={handleClick}
      className={` ${className}`}
    >
      <MoveLeft/>{children}
    </Button>
  );
};

export default BackButton;