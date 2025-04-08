
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
import { PlusCircle, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type FieldType = "text" | "textarea" | "dropdown" | "checkbox" | "number";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  order: number;
}

const Settings = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
  });
  const [dropdownOptions, setDropdownOptions] = useState("");
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

    // Add options for dropdown fields
    if (fieldToAdd.type === "dropdown" && dropdownOptions) {
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

  return (
    <Layout onExport={() => {}}>
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
                    <Select
                      value={newField.type as string}
                      onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
                    >
                      <SelectTrigger id="fieldType">
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Single Line Text</SelectItem>
                        <SelectItem value="textarea">Multi-line Text</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
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

                {newField.type === "dropdown" && (
                  <div className="space-y-2">
                    <Label htmlFor="options">Dropdown Options (comma-separated)</Label>
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
                            <TableCell>{field.name}</TableCell>
                            <TableCell>
                              {field.type === "text" && "Single Line Text"}
                              {field.type === "textarea" && "Multi-line Text"}
                              {field.type === "dropdown" && "Dropdown"}
                              {field.type === "checkbox" && "Checkbox"}
                              {field.type === "number" && "Number"}
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
                                  onClick={() => handleDeleteField(field.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
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
