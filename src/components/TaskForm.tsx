
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFormData, taskTypes } from "@/types/task";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskFormProps {
  onSaveTask: (task: TaskFormData) => void;
}

interface CustomField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  order: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSaveTask }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [project, setProject] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [notes, setNotes] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const isMobile = useIsMobile();

  // Load custom fields from localStorage
  useEffect(() => {
    const savedFields = localStorage.getItem("designTaskCustomFields");
    if (savedFields) {
      try {
        const fields = JSON.parse(savedFields);
        // Sort fields by order
        fields.sort((a: CustomField, b: CustomField) => a.order - b.order);
        setCustomFields(fields);
        
        // Initialize custom field values
        const initialValues: Record<string, any> = {};
        fields.forEach((field: CustomField) => {
          initialValues[field.id] = field.type === "checkbox" ? false : "";
        });
        setCustomFieldValues(initialValues);
      } catch (error) {
        console.error("Error loading custom fields:", error);
      }
    }
  }, []);

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!project || !taskName || !taskType || !timeSpent) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const timeSpentNumber = parseFloat(timeSpent);
    
    if (isNaN(timeSpentNumber) || timeSpentNumber <= 0) {
      toast.error("Please enter a valid time");
      return;
    }

    // Validate required custom fields
    const requiredFieldsMissing = customFields
      .filter(field => field.required)
      .some(field => {
        const value = customFieldValues[field.id];
        return value === "" || value === undefined || value === null;
      });

    if (requiredFieldsMissing) {
      toast.error("Please fill all required custom fields");
      return;
    }
    
    const newTask: TaskFormData & { customFields?: Record<string, any> } = {
      date: format(date, "yyyy-MM-dd"),
      project,
      taskName,
      taskType,
      timeSpent: timeSpentNumber,
      notes,
      customFields: customFieldValues
    };
    
    onSaveTask(newTask as TaskFormData);
    
    // Reset form
    setProject("");
    setTaskName("");
    setTaskType("");
    setTimeSpent("");
    setNotes("");
    
    // Reset custom field values
    const initialValues: Record<string, any> = {};
    customFields.forEach((field) => {
      initialValues[field.id] = field.type === "checkbox" ? false : "";
    });
    setCustomFieldValues(initialValues);
    
    toast.success("Task recorded successfully!");
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
              id={`custom-${field.id}`}
              checked={!!customFieldValues[field.id]}
              onCheckedChange={(checked) => 
                handleCustomFieldChange(field.id, checked === true)
              }
            />
            <label
              htmlFor={`custom-${field.id}`}
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
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-design-blue text-xl">Record Design Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="project">Project Name*</Label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g., Website Redesign"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="taskName">Task Name*</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Create Homepage Wireframes"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="taskType">Task Type*</Label>
            <Select value={taskType} onValueChange={setTaskType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="timeSpent">Time Spent (hours)*</Label>
            <Input
              id="timeSpent"
              type="number"
              step="0.25"
              min="0.25"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="e.g., 2.5"
              required
              className="w-full"
            />
          </div>

          {/* Render custom fields */}
          {customFields.map((field) => (
            <div key={field.id} className="space-y-2 w-full">
              <Label htmlFor={field.id}>
                {field.name}{field.required ? "*" : ""}
              </Label>
              {renderCustomField(field)}
            </div>
          ))}
          
          <div className="space-y-2 w-full">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about the task..."
              rows={3}
              className="w-full"
            />
          </div>
          
          <Button type="submit" className="w-full mt-2">Save Task</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
