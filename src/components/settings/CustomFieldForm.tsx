
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FieldType, fieldTypes, CustomField } from "@/types/customField";

interface CustomFieldFormProps {
  onAddField: (field: CustomField) => void;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({ onAddField }) => {
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
  });
  const [dropdownOptions, setDropdownOptions] = useState("");

  const handleAddField = () => {
    if (!newField.name) {
      toast.error("Field name is required");
      return;
    }

    const id = `custom-${Date.now()}`;
    const fieldToAdd: CustomField = {
      id,
      name: newField.name || "",
      type: newField.type as FieldType || "text",
      required: !!newField.required,
      order: 0, // Will be set by the parent component
    };

    // Add options for dropdown and radio fields
    if ((fieldToAdd.type === "dropdown" || fieldToAdd.type === "radio") && dropdownOptions) {
      fieldToAdd.options = dropdownOptions
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option);
    }

    onAddField(fieldToAdd);
    setNewField({ name: "", type: "text", required: false });
    setDropdownOptions("");
    toast.success("Custom field added");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Add New Field</h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            placeholder="Enter field name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fieldType">Field Type</Label>
          <div className="flex gap-2">
            <Select
              value={newField.type as string}
              onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
            >
              <SelectTrigger id="fieldType" className="flex-1">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-end space-x-2 " >
          <div className="flex items-end space-x-2">
            <input
              type="checkbox"
              id="requiredField"
              checked={!!newField.required}
              onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="requiredField">Required</Label>
          </div>
        </div>
      </div>

      {(newField.type === "dropdown" || newField.type === "radio") && (
        <div className="space-y-2">
          <Label htmlFor="options">Options (comma-separated)</Label>
          <Input
            id="options"
            value={dropdownOptions}
            onChange={(e) => setDropdownOptions(e.target.value)}
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      <Button onClick={handleAddField} className="mt-2">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Field
      </Button>
    </div>
  );
};

export default CustomFieldForm;
