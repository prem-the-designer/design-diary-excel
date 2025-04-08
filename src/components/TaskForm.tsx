
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFormData, taskTypes } from "@/types/task";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskFormProps {
  onSaveTask: (task: TaskFormData) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSaveTask }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [project, setProject] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [notes, setNotes] = useState("");
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!project || !taskName || !taskType || !timeSpent) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const timeSpentNumber = parseFloat(timeSpent);
    
    if (isNaN(timeSpentNumber) || timeSpentNumber <= 0) {
      toast.error("Please enter a valid time");
      return;
    }
    
    const newTask: TaskFormData = {
      date: format(date, "yyyy-MM-dd"),
      project,
      taskName,
      taskType,
      timeSpent: timeSpentNumber,
      notes
    };
    
    onSaveTask(newTask);
    
    // Reset form
    setProject("");
    setTaskName("");
    setTaskType("");
    setTimeSpent("");
    setNotes("");
    
    toast.success("Task recorded successfully!");
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-design-blue text-xl">Record Design Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="project">Project Name*</Label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g., Website Redesign"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="taskName">Task Name*</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Create Homepage Wireframes"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="taskType">Task Type*</Label>
            <Select value={taskType} onValueChange={setTaskType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="timeSpent">Time Spent (hours)*</Label>
            <Input
              id="timeSpent"
              type="number"
              step="0.25"
              min="0.25"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="e.g., 2.5"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 w-full">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about the task..."
              rows={3}
              className="w-full"
            />
          </div>
          
          <Button type="submit" className="w-full mt-2">Save Task</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
