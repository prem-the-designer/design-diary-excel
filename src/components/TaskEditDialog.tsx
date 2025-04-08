
import React, { useState, useEffect } from "react";
import { Task, taskTypes } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [project, setProject] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [notes, setNotes] = useState("");
  const isMobile = useIsMobile();

  // Initialize form with task data when opened
  useEffect(() => {
    if (task) {
      setDate(parseISO(task.date));
      setProject(task.project);
      setTaskName(task.taskName);
      setTaskType(task.taskType);
      setTimeSpent(task.timeSpent.toString());
      setNotes(task.notes || "");
    }
  }, [task]);

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
    
    const updatedTask: Task = {
      ...task,
      date: format(date, "yyyy-MM-dd"),
      project,
      taskName,
      taskType,
      timeSpent: timeSpentNumber,
      notes
    };
    
    onUpdate(updatedTask);
    toast.success("Task updated successfully!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-design-blue">Edit Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="edit-date"
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
          
          <div className="space-y-2">
            <Label htmlFor="edit-project">Project Name*</Label>
            <Input
              id="edit-project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g., Website Redesign"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-taskName">Task Name*</Label>
            <Input
              id="edit-taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Create Homepage Wireframes"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-taskType">Task Type*</Label>
            <Select value={taskType} onValueChange={setTaskType} required>
              <SelectTrigger id="edit-taskType">
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
          
          <div className="space-y-2">
            <Label htmlFor="edit-timeSpent">Time Spent (hours)*</Label>
            <Input
              id="edit-timeSpent"
              type="number"
              step="0.25"
              min="0.25"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="e.g., 2.5"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about the task..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
