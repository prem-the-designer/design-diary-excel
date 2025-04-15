
import React from "react";
import { TableCell } from "@/components/ui/table";
import { CustomField, fieldTypes } from "@/types/customField";
import FieldActions from "./FieldActions";

interface DisplayFieldRowProps {
  field: CustomField;
  index: number;
  totalFields: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}

const DisplayFieldRow: React.FC<DisplayFieldRowProps> = ({
  field,
  index,
  totalFields,
  onEdit,
  onDelete,
  onMove
}) => {
  return (
    <>
      <TableCell>{field.name}</TableCell>
      <TableCell>
        {fieldTypes.find(t => t.value === field.type)?.label || field.type}
      </TableCell>
      <TableCell>{field.required ? "Yes" : "No"}</TableCell>
      <TableCell className="text-right">
        <FieldActions
          index={index}
          totalFields={totalFields}
          fieldId={field.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      </TableCell>
    </>
  );
};

export default DisplayFieldRow;
