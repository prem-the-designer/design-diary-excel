
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { KanbanTaskItem, KanbanStatus } from "@/components/kanban/KanbanBoard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarClock, MoreHorizontal } from "lucide-react";

interface KanbanTaskProps {
  task: KanbanTaskItem;
  onClick: () => void;
  onStatusChange: (taskId: string, status: KanbanStatus) => void;
}

const KanbanTask: React.FC<KanbanTaskProps> = ({ task, onClick, onStatusChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card 
      className={`shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`} 
      style={{ 
        borderLeftColor: task.status === "backlog" 
          ? "#94a3b8" 
          : task.status === "progress" 
            ? "#3b82f6" 
            : "#22c55e" 
      }}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {task.taskType}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {task.status !== "backlog" && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, "backlog");
                  }}>
                    Move to Backlog
                  </DropdownMenuItem>
                )}
                {task.status !== "progress" && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, "progress");
                  }}>
                    Move to On Progress
                  </DropdownMenuItem>
                )}
                {task.status !== "done" && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, "done");
                  }}>
                    Mark as Done
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="font-medium text-sm">{task.project}</div>
          <p className="text-sm text-gray-700">{task.taskName}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />
              <span>{format(parseISO(task.date), "MMM dd")}</span>
            </div>
            <span>{task.timeSpent.toFixed(1)} hrs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanTask;
