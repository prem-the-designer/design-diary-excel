
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomTimeFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CustomTimeField: React.FC<CustomTimeFieldProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>
        {name}{required ? "*" : ""}
      </Label>
      <Input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        required={required}
      />
    </div>
  );
};

export default CustomTimeField;
