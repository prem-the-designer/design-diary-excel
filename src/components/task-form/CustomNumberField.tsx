
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomNumberFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

const CustomNumberField: React.FC<CustomNumberFieldProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  placeholder,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>
        {name}{required ? "*" : ""}
      </Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${name.toLowerCase()}`}
        required={required}
      />
    </div>
  );
};

export default CustomNumberField;
