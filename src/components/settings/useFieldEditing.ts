
import { useState } from "react";
import { CustomField, EditingField } from "@/types/customField";
import { toast } from "sonner";

export function useFieldEditing(
  customFields: CustomField[],
  onUpdateFields: (fields: CustomField[]) => void
) {
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
      options: field.options?.join(", "),
      required: field.required
    });
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const updateEditingField = (updatedEditingField: EditingField) => {
    setEditingField(updatedEditingField);
  };

  const saveEditing = () => {
    if (!editingField) return;

    const updatedFields = customFields.map((field) => {
      if (field.id === editingField.id) {
        const updatedField = {
          ...field,
          name: editingField.name,
          type: editingField.type,
          required: editingField.required
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

  return {
    editingField,
    handleDeleteField,
    moveField,
    startEditing,
    cancelEditing,
    updateEditingField,
    saveEditing
  };
}
