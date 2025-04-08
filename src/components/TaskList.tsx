
import React, { useState } from "react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskEditDialog from "@/components/TaskEditDialog";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask?: (updatedTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const displayTasks = [...tasks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const isMobile = useIsMobile();

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }
    setIsEditDialogOpen(false);
    setSelectedTask(null);
  };

  if (displayTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-design-blue">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tasks recorded yet. Add your first task to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group tasks by date
  const tasksByDate = displayTasks.reduce((groups, task) => {
    const date = format(parseISO(task.date), "MMM dd, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-design-blue">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(tasksByDate).map(([date, dateTasks], groupIndex) => (
              <div key={date} className="mb-6">
                <div className="font-medium text-lg text-design-darkgray mb-3">{date}</div>
                <div className={`relative ${!isMobile ? 'pl-6' : 'pl-4'}`}>
                  {!isMobile && (
                    <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-design-lightblue"></div>
                  )}
                  <div className="space-y-4">
                    {dateTasks.map((task, index) => (
                      <div key={task.id} className={`relative animate-fade-in ${!isMobile ? 'pl-6' : 'pl-4'}`}>
                        {!isMobile && (
                          <div className="absolute -left-6 top-2 h-4 w-4 rounded-full bg-design-blue border-2 border-white z-10"></div>
                        )}
                        {isMobile && (
                          <div className="absolute -left-0 top-2 h-3 w-3 rounded-full bg-design-blue border-2 border-white z-10"></div>
                        )}
                        <div className="task-card group">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-design-darkgray">{task.project}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{task.taskType}</Badge>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 opacity-60 hover:opacity-100"
                                  onClick={() => handleEditClick(task)}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  <span className="sr-only">Edit task</span>
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{task.taskName}</p>
                            <div className="flex justify-between items-center mt-1 text-sm">
                              <span className="text-muted-foreground">{format(parseISO(task.date), "h:mm a")}</span>
                              <span className="font-medium">{task.timeSpent.toFixed(1)} hrs</span>
                            </div>
                            {task.notes && (
                              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                {task.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        {index < dateTasks.length - 1 && isMobile && (
                          <div className="absolute top-2 bottom-0 left-1.5 w-px bg-design-lightblue -z-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {groupIndex < Object.keys(tasksByDate).length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {selectedTask && (
        <TaskEditDialog 
          task={selectedTask} 
          isOpen={isEditDialogOpen} 
          onClose={handleEditClose}
          onUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
};

export default TaskList;
