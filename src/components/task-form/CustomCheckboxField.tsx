
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomCheckboxFieldProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

const CustomCheckboxField: React.FC<CustomCheckboxFieldProps> = ({
  id,
  name,
  checked,
  onChange,
  required = false,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>
        {name}{required ? "*" : ""}
      </Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Yes
        </label>
      </div>
    </div>
  );
};

export default CustomCheckboxField;
