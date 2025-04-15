
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, MoveUp, MoveDown, Edit } from "lucide-react";

interface FieldActionsProps {
  index: number;
  totalFields: number;
  fieldId: string;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}

const FieldActions: React.FC<FieldActionsProps> = ({
  index,
  totalFields,
  fieldId,
  onEdit,
  onDelete,
  onMove
}) => {
  const isDefaultField = fieldId.startsWith("default-");
  
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onMove("up")}
        disabled={index === 0}
      >
        <MoveUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onMove("down")}
        disabled={index === totalFields - 1}
      >
        <MoveDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4 text-blue-500" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-destructive hover:text-destructive"
        disabled={isDefaultField}
        title={isDefaultField ? "Default fields cannot be deleted" : "Delete field"}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FieldActions;
