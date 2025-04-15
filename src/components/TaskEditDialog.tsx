
import React, { useState, useEffect } from "react";
import { Task, skillCategories } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { useCustomFields } from "@/hooks/useCustomFields";
import { CustomField } from "@/types/customField";
import FormField from "./task-form/FormField";
import DatePickerField from "./task-form/DatePickerField";
import CustomSelectField from "./task-form/CustomSelectField";

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
      
      // Set skill category field
      initialValues["skillCategory"] = task.customFields?.skillCategory || "";
      
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-design-blue">Edit Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <DatePickerField
            date={date}
            onChange={setDate}
            label="Date"
            required={true}
          />
          
          {sortedFields.filter(field => field.id !== "default-date").map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={customFieldValues[field.id]}
              onChange={(value) => handleCustomFieldChange(field.id, value)}
            />
          ))}

          {/* Skill Category Field */}
          <CustomSelectField
            id="skillCategory"
            name="Skill Category"
            value={customFieldValues["skillCategory"] || ""}
            onChange={(value) => handleCustomFieldChange("skillCategory", value)}
            options={skillCategories}
            required={false}
            placeholder="Select skill category"
          />
          
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
