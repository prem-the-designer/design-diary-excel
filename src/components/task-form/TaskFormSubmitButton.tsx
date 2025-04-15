
import React from "react";
import { Button } from "@/components/ui/button";

interface TaskFormSubmitButtonProps {
  text?: string;
  className?: string;
}

const TaskFormSubmitButton: React.FC<TaskFormSubmitButtonProps> = ({ 
  text = "Save Task", 
  className = "w-full mt-2" 
}) => {
  return (
    <Button type="submit" className={className}>
      {text}
    </Button>
  );
};

export default TaskFormSubmitButton;
