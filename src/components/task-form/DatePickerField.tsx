
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface DatePickerFieldProps {
  date: Date;
  onChange: (date: Date) => void;
  label: string;
  required?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  date, 
  onChange, 
  label, 
  required = false 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="date-picker">
        {label}{required ? "*" : ""}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
            )}
            id="date-picker"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && onChange(date)}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
