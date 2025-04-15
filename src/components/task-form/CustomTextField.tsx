
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CustomTextFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isMultiline?: boolean;
  placeholder?: string;
  rows?: number;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  isMultiline = false,
  placeholder,
  rows = 3,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>
        {name}{required ? "*" : ""}
      </Label>
      {isMultiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${name.toLowerCase()}`}
          rows={rows}
          required={required}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${name.toLowerCase()}`}
          required={required}
        />
      )}
    </div>
  );
};

export default CustomTextField;
