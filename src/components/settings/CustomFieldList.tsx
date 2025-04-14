
import React, { useState } from "react";
import { 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Edit, 
  Check, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { CustomField, EditingField, FieldType, fieldTypes } from "@/types/customField";

interface CustomFieldListProps {
  customFields: CustomField[];
  onUpdateFields: (fields: CustomField[]) => void;
}

const CustomFieldList: React.FC<CustomFieldListProps> = ({ 
  customFields, 
  onUpdateFields 
}) => {
  const [editingField, setEditingField] = useState<EditingField | null>(null);

  const handleDeleteField = (id: string) => {
    const updatedFields = customFields.filter((field) => field.id !== id);
    onUpdateFields(updatedFields);
    toast.success("Field deleted");
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === customFields.length - 1)
    ) {
      return;
    }

    const newFields = [...customFields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap the items
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    
    // Update order values
    newFields.forEach((field, idx) => {
      field.order = idx;
    });
    
    onUpdateFields(newFields);
  };

  const startEditing = (field: CustomField) => {
    setEditingField({
      id: field.id,
      name: field.name,
      type: field.type,
      options: field.options?.join(", ")
    });
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const saveEditing = () => {
    if (!editingField) return;

    const updatedFields = customFields.map((field) => {
      if (field.id === editingField.id) {
        const updatedField = {
          ...field,
          name: editingField.name,
          type: editingField.type,
        };

        // Update options for dropdown and radio fields
        if ((editingField.type === "dropdown" || editingField.type === "radio") && editingField.options) {
          updatedField.options = editingField.options
            .split(",")
            .map((option) => option.trim())
            .filter((option) => option);
        } else if (editingField.type !== "dropdown" && editingField.type !== "radio") {
          // Remove options if field type is not dropdown or radio
          delete updatedField.options;
        }

        return updatedField;
      }
      return field;
    });

    onUpdateFields(updatedFields);
    setEditingField(null);
    toast.success("Field updated");
  };

  if (customFields.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground bg-muted rounded-md">
        No fields added yet
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customFields.map((field, index) => (
            <TableRow key={field.id}>
              {editingField && editingField.id === field.id ? (
                <>
                  <TableCell>
                    <Input
                      value={editingField.name}
                      onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                      placeholder="Field name"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editingField.type}
                      onValueChange={(value) => setEditingField({ ...editingField, type: value as FieldType })}
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
                        onChange={(e) => setEditingField({ ...editingField, options: e.target.value })}
                        placeholder="Option 1, Option 2, Option 3"
                      />
                    )}
                  </TableCell>
                  <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={saveEditing}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>
                    {fieldTypes.find(t => t.value === field.type)?.label || field.type}
                  </TableCell>
                  <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveField(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveField(index, "down")}
                        disabled={index === customFields.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(field)}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteField(field.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomFieldList;
