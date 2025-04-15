
import React from "react";
import { CustomField } from "@/types/customField";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import CustomTextField from "./CustomTextField";
import CustomNumberField from "./CustomNumberField";
import CustomSelectField from "./CustomSelectField";
import CustomCheckboxField from "./CustomCheckboxField";
import CustomColorField from "./CustomColorField";
import CustomRangeField from "./CustomRangeField";
import CustomTimeField from "./CustomTimeField";

interface FormFieldProps {
  field: CustomField;
  value: any;
  onChange: (value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
  const isMobile = useIsMobile();
  
  switch (field.type) {
    case "text":
      return (
        <CustomTextField
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          required={field.required}
        />
      );
    case "textarea":
      return (
        <CustomTextField
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          required={field.required}
          isMultiline={true}
        />
      );
    case "number":
      return (
        <CustomNumberField
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          required={field.required}
        />
      );
    case "checkbox":
      return (
        <CustomCheckboxField
          id={field.id}
          name={field.name}
          checked={!!value}
          onChange={onChange}
          required={field.required}
        />
      );
    case "dropdown":
    case "radio":
      return (
        <CustomSelectField
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          options={field.options || []}
          required={field.required}
        />
      );
    case "date":
      return (
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">
            {field.name}{field.required ? "*" : ""}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? 
                  format(new Date(value), "PPP") : 
                  <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    case "color":
      return (
        <CustomColorField
          id={field.id}
          name={field.name}
          value={value || "#000000"}
          onChange={onChange}
          required={field.required}
        />
      );
    case "range":
      return (
        <CustomRangeField
          id={field.id}
          name={field.name}
          value={value || "50"}
          onChange={onChange}
          required={field.required}
        />
      );
    case "time":
      return (
        <CustomTimeField
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          required={field.required}
        />
      );
    default:
      return (
        <CustomTextField
          id={field.id}
          name={field.name}
          value={value || ""}
          onChange={onChange}
          required={field.required}
        />
      );
  }
};

export default FormField;
