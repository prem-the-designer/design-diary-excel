
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { PlusCircle, Trash2, MoveUp, MoveDown, Command, Plus, Edit, Check, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Command as CommandPrimitive } from "cmdk";

type FieldType = "text" | "textarea" | "dropdown" | "checkbox" | "number" | "radio" | "button" | "date" | "time" | "color" | "range";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  order: number;
}

interface EditingField {
  id: string;
  name: string;
  type: FieldType;
  options?: string;
}

const Settings = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
  });
  const [dropdownOptions, setDropdownOptions] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load custom fields from localStorage
    const savedFields = localStorage.getItem("designTaskCustomFields");
    if (savedFields) {
      try {
        setCustomFields(JSON.parse(savedFields));
      } catch (error) {
        console.error("Error loading custom fields:", error);
      }
    }
  }, []);

  // Save fields to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("designTaskCustomFields", JSON.stringify(customFields));
  }, [customFields]);

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
      order: customFields.length,
    };

    // Add options for dropdown and radio fields
    if ((fieldToAdd.type === "dropdown" || fieldToAdd.type === "radio") && dropdownOptions) {
      fieldToAdd.options = dropdownOptions
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option);
    }

    setCustomFields([...customFields, fieldToAdd]);
    setNewField({ name: "", type: "text", required: false });
    setDropdownOptions("");
    toast.success("Custom field added");
  };

  const handleDeleteField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
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
    
    setCustomFields(newFields);
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

    setCustomFields(updatedFields);
    setEditingField(null);
    toast.success("Field updated");
  };

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: "text", label: "Single Line Text" },
    { value: "textarea", label: "Multi-line Text" },
    { value: "dropdown", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
    { value: "number", label: "Number" },
    { value: "radio", label: "Radio Button" },
    { value: "button", label: "Button" },
    { value: "date", label: "Date Picker" },
    { value: "time", label: "Time Picker" },
    { value: "color", label: "Color Picker" },
    { value: "range", label: "Range Slider" }
  ];

  // Command menu for adding fields like Notion
  const handleFieldTypeSelection = (type: FieldType) => {
    if (editingField) {
      setEditingField({ ...editingField, type });
    } else {
      setNewField({ ...newField, type });
    }
    setCommandOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-design-blue">Form Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Field</h3>
                
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
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
                      
                      <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Command className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72" align="end">
                          <CommandPrimitive className="rounded-lg border shadow-md">
                            <CommandPrimitive.Input 
                              placeholder="Search field type..." 
                              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <CommandPrimitive.List className="max-h-[300px] overflow-y-auto p-1">
                              <CommandPrimitive.Empty>No field type found.</CommandPrimitive.Empty>
                              {fieldTypes.map(type => (
                                <CommandPrimitive.Item
                                  key={type.value}
                                  value={type.value}
                                  onSelect={() => handleFieldTypeSelection(type.value)}
                                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                  {type.label}
                                </CommandPrimitive.Item>
                              ))}
                            </CommandPrimitive.List>
                          </CommandPrimitive>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <div className="flex items-center space-x-2">
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Custom Fields</h3>
                
                {customFields.length > 0 ? (
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
                ) : (
                  <div className="text-center py-10 text-muted-foreground bg-muted rounded-md">
                    No custom fields added yet
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
