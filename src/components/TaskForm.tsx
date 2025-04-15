
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomFields } from "@/hooks/useCustomFields";
import { TaskFormData, skillCategories } from "@/types/task";
import FormField from "./task-form/FormField";
import DatePickerField from "./task-form/DatePickerField";
import TaskFormSubmitButton from "./task-form/TaskFormSubmitButton";
import { useTaskForm } from "./task-form/useTaskForm";
import CustomSelectField from "./task-form/CustomSelectField";

interface TaskFormProps {
  onSaveTask: (task: TaskFormData) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSaveTask }) => {
  const { customFields } = useCustomFields();
  
  const {
    date,
    setDate,
    customFieldValues,
    sortedFields,
    handleCustomFieldChange,
    handleSubmit,
  } = useTaskForm({ onSaveTask, customFields });

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-design-blue text-xl">Record Design Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full">
          {/* Date Picker Field */}
          <DatePickerField
            date={date}
            onChange={setDate}
            label="Date"
            required={true}
          />
          
          {/* Render all custom fields based on their order */}
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
          
          <TaskFormSubmitButton />
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
