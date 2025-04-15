
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomRangeFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CustomRangeField: React.FC<CustomRangeFieldProps> = ({
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
        type="range"
        min="0"
        max="100"
        value={value || "50"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        required={required}
      />
    </div>
  );
};

export default CustomRangeField;
