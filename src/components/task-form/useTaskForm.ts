
import { useState, useEffect } from "react";
import { CustomField } from "@/types/customField";
import { TaskFormData } from "@/types/task";
import { format } from "date-fns";
import { toast } from "sonner";

interface UseTaskFormProps {
  onSaveTask: (task: TaskFormData) => void;
  customFields: CustomField[];
}

export const useTaskForm = ({ onSaveTask, customFields }: UseTaskFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [sortedFields, setSortedFields] = useState<CustomField[]>([]);

  // Sort fields by order
  useEffect(() => {
    const sorted = [...customFields].sort((a, b) => a.order - b.order);
    setSortedFields(sorted);
    
    // Initialize custom field values
    const initialValues: Record<string, any> = {};
    sorted.forEach((field: CustomField) => {
      initialValues[field.id] = field.type === "checkbox" ? false : "";
    });
    setCustomFieldValues(initialValues);
  }, [customFields]);

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const resetForm = () => {
    // Reset form
    const initialValues: Record<string, any> = {};
    sortedFields.forEach((field) => {
      initialValues[field.id] = field.type === "checkbox" ? false : "";
    });
    setCustomFieldValues(initialValues);
    setDate(new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract required field values
    const project = customFieldValues["default-project"] || "";
    const taskName = customFieldValues["default-taskName"] || "";
    const taskType = customFieldValues["default-taskType"] || "";
    const timeSpent = customFieldValues["default-timeSpent"] || "";
    const notes = customFieldValues["default-notes"] || "";

    // Validate required fields
    if (!project || !taskName || !taskType || !timeSpent) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const timeSpentNumber = parseFloat(timeSpent);
    
    if (isNaN(timeSpentNumber) || timeSpentNumber <= 0) {
      toast.error("Please enter a valid time");
      return;
    }

    // Validate other required custom fields
    const requiredFieldsMissing = sortedFields
      .filter(field => field.required)
      .some(field => {
        const value = customFieldValues[field.id];
        return value === "" || value === undefined || value === null;
      });

    if (requiredFieldsMissing) {
      toast.error("Please fill all required custom fields");
      return;
    }
    
    const newTask: TaskFormData = {
      date: format(date, "yyyy-MM-dd"),
      project,
      taskName,
      taskType,
      timeSpent: timeSpentNumber,
      notes,
      customFields: customFieldValues
    };
    
    onSaveTask(newTask);
    resetForm();
    
    toast.success("Task recorded successfully!");
  };

  return {
    date,
    setDate,
    customFieldValues,
    sortedFields,
    handleCustomFieldChange,
    handleSubmit,
  };
};
