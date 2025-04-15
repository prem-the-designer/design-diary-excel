
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { EditingField, FieldType, fieldTypes } from "@/types/customField";

interface EditingFieldRowProps {
  editingField: EditingField;
  onFieldChange: (field: EditingField) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditingFieldRow: React.FC<EditingFieldRowProps> = ({
  editingField,
  onFieldChange,
  onSave,
  onCancel
}) => {
  return (
    <>
      <TableCell>
        <Input
          value={editingField.name}
          onChange={(e) => onFieldChange({ ...editingField, name: e.target.value })}
          placeholder="Field name"
        />
      </TableCell>
      <TableCell>
        <Select
          value={editingField.type}
          onValueChange={(value) => onFieldChange({ ...editingField, type: value as FieldType })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(editingField.type === "dropdown" || editingField.type === "radio") && (
          <Input
            className="mt-2"
            value={editingField.options || ""}
            onChange={(e) => onFieldChange({ ...editingField, options: e.target.value })}
            placeholder="Option 1, Option 2, Option 3"
          />
        )}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={editingField.required}
          onCheckedChange={(checked) => onFieldChange({ ...editingField, required: checked === true })}
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </>
  );
};

export default EditingFieldRow;
