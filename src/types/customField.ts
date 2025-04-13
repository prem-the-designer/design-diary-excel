
export type FieldType = "text" | "textarea" | "dropdown" | "checkbox" | "number" | "radio" | "button" | "date" | "time" | "color" | "range";

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  order: number;
}

export interface EditingField {
  id: string;
  name: string;
  type: FieldType;
  options?: string;
}

export const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "text", label: "Single Line Text" },
  { value: "textarea", label: "Multi-line Text" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "number", label: "Number" },
  { value: "radio", label: "Radio Button" },
  { value: "button", label: "Button" },
  { value: "date", label: "Date Picker" },
  { value: "time", label: "Time Picker" },
  { value: "color", label: "Color Picker" },
  { value: "range", label: "Range Slider" }
];
