
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomColorFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CustomColorField: React.FC<CustomColorFieldProps> = ({
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
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full"
        required={required}
      />
    </div>
  );
};

export default CustomColorField;
