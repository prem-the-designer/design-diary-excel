
import React, { useState, useEffect } from "react";
import { Task, taskTypes } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCustomFields } from "@/hooks/useCustomFields";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomField } from "@/types/customField";

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const isMobile = useIsMobile();
  const { customFields } = useCustomFields();
  const [sortedFields, setSortedFields] = useState<CustomField[]>([]);

  useEffect(() => {
    if (task) {
      // Set date
      setDate(parseISO(task.date));
      
      // Initialize custom field values with task data
      const initialValues: Record<string, any> = {};
      
      // Set standard fields
      initialValues["default-project"] = task.project;
      initialValues["default-taskName"] = task.taskName;
      initialValues["default-taskType"] = task.taskType;
      initialValues["default-timeSpent"] = task.timeSpent.toString();
      initialValues["default-notes"] = task.notes || "";
      
      // Set custom fields from task
      if (task.customFields) {
        Object.entries(task.customFields).forEach(([key, value]) => {
          initialValues[key] = value;
        });
      }
      
      setCustomFieldValues(initialValues);
    }
  }, [task]);

  useEffect(() => {
    // Sort fields by order
    const sorted = [...customFields].sort((a, b) => a.order - b.order);
    setSortedFields(sorted);
  }, [customFields]);

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract required field values
    const project = customFieldValues["default-project"] || "";
    const taskName = customFieldValues["default-taskName"] || "";
    const taskType = customFieldValues["default-taskType"] || "";
    const timeSpent = customFieldValues["default-timeSpent"] || "";
    const notes = customFieldValues["default-notes"] || "";
    
    if (!project || !taskName || !taskType || !timeSpent) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const timeSpentNumber = parseFloat(timeSpent);
    
    if (isNaN(timeSpentNumber) || timeSpentNumber <= 0) {
      toast.error("Please enter a valid time");
      return;
    }
    
    const updatedTask: Task = {
      ...task,
      date: format(date, "yyyy-MM-dd"),
      project,
      taskName,
      taskType,
      timeSpent: timeSpentNumber,
      notes,
      customFields: customFieldValues
    };
    
    onUpdate(updatedTask);
  };

  const renderCustomField = (field: CustomField) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            value={customFieldValues[field.id] || ""}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={customFieldValues[field.id] || ""}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            rows={3}
            required={field.required}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={customFieldValues[field.id] || ""}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`edit-custom-${field.id}`}
              checked={!!customFieldValues[field.id]}
              onCheckedChange={(checked) => 
                handleCustomFieldChange(field.id, checked === true)
              }
            />
            <label
              htmlFor={`edit-custom-${field.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Yes
            </label>
          </div>
        );
      case "dropdown":
      case "radio":
        return (
          <Select
            value={customFieldValues[field.id] || ""}
            onValueChange={(value) => handleCustomFieldChange(field.id, value)}
            required={field.required}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !customFieldValues[field.id] && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customFieldValues[field.id] ? 
                  format(new Date(customFieldValues[field.id]), "PPP") : 
                  <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
              <Calendar
                mode="single"
                selected={customFieldValues[field.id] ? new Date(customFieldValues[field.id]) : undefined}
                onSelect={(date) => date && handleCustomFieldChange(field.id, format(date, "yyyy-MM-dd"))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "color":
        return (
          <Input
            type="color"
            value={customFieldValues[field.id] || "#000000"}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            className="h-10 w-full"
            required={field.required}
          />
        );
      case "range":
        return (
          <Input
            type="range"
            min="0"
            max="100"
            value={customFieldValues[field.id] || "50"}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            className="w-full"
            required={field.required}
          />
        );
      case "time":
        return (
          <Input
            type="time"
            value={customFieldValues[field.id] || ""}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            className="w-full"
            required={field.required}
          />
        );
      default:
        return (
          <Input
            value={customFieldValues[field.id] || ""}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-design-blue">Edit Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {sortedFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`edit-${field.id}`}>
                {field.name}{field.required ? "*" : ""}
              </Label>
              {renderCustomField(field)}
            </div>
          ))}
          
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
