
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomSelectFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>
        {name}{required ? "*" : ""}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        required={required}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder || `Select ${name.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelectField;
