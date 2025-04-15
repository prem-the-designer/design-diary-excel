
import React, { useState, useEffect } from "react";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import KanbanTask from "@/components/kanban/KanbanTask";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import TaskDetailsDialog from "@/components/kanban/TaskDetailsDialog";

export type KanbanStatus = "backlog" | "progress" | "done";

export interface KanbanTaskItem extends Task {
  status: KanbanStatus;
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask?: (updatedTask: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddTask?: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTaskItem[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeColumn, setActiveColumn] = useState<KanbanStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanTaskItem | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  // Convert tasks to KanbanTasks
  useEffect(() => {
    // Map tasks to KanbanTaskItems with a default or existing status
    const mappedTasks: KanbanTaskItem[] = tasks.map((task) => {
      // If task already has status in kanbanTasks, keep it, otherwise default to "backlog"
      const existingTask = kanbanTasks.find((kt) => kt.id === task.id);
      return {
        ...task,
        status: existingTask?.status || "backlog",
      };
    });
    setKanbanTasks(mappedTasks);
  }, [tasks]);

  const getColumnTasks = (status: KanbanStatus) => {
    return kanbanTasks.filter((task) => task.status === status);
  };

  const handleStatusChange = async (taskId: string, newStatus: KanbanStatus) => {
    try {
      // Update local state
      const updatedTasks = kanbanTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setKanbanTasks(updatedTasks);

      // Update in database if needed (we'll store this in a custom field for now)
      const taskToUpdate = kanbanTasks.find((task) => task.id === taskId);
      if (taskToUpdate && onUpdateTask) {
        const updatedTask: Task = {
          ...taskToUpdate,
          customFields: {
            ...(taskToUpdate.customFields || {}),
            kanbanStatus: newStatus,
          },
        };
        onUpdateTask(updatedTask);
      }

      toast({
        title: "Task updated",
        description: "Task status changed successfully",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async (task: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save tasks",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newTask: Task = {
        ...task,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      // Add kanban status to custom fields
      const taskWithStatus = {
        ...newTask,
        customFields: {
          ...(newTask.customFields || {}),
          kanbanStatus: activeColumn,
        },
      };

      // Call the parent onAddTask handler
      if (onAddTask) {
        onAddTask(taskWithStatus);
      }

      // Add to local kanban tasks too
      setKanbanTasks((prev) => [
        ...prev,
        { ...taskWithStatus, status: activeColumn || "backlog" },
      ]);

      setShowTaskForm(false);
      setActiveColumn(null);

      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error: any) {
      console.error("Error adding task:", error.message);
      toast({
        title: "Error",
        description: `Failed to add task: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleTaskClick = (task: KanbanTaskItem) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleDeleteConfirm = (taskId: string) => {
    if (onDeleteTask) {
      onDeleteTask(taskId);
      setSelectedTask(null);
      setShowTaskDetails(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    if (onUpdateTask) {
      onUpdateTask(updatedTask);
      
      // Also update status if it changed
      if (selectedTask && selectedTask.status !== (updatedTask.customFields?.kanbanStatus as KanbanStatus)) {
        setKanbanTasks(prev => 
          prev.map(task => 
            task.id === updatedTask.id 
              ? { 
                  ...task, 
                  ...updatedTask, 
                  status: (updatedTask.customFields?.kanbanStatus as KanbanStatus) || task.status 
                } 
              : task
          )
        );
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: KanbanStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    if (taskId) {
      handleStatusChange(taskId, status);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Backlog Column */}
        <KanbanColumn 
          title="Backlog" 
          description="Tasks that need to be worked on"
          status="backlog"
          count={getColumnTasks("backlog").length}
          onAddClick={() => {
            setActiveColumn("backlog");
            setShowTaskForm(true);
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "backlog")}
        >
          {getColumnTasks("backlog").map((task) => (
            <KanbanTask 
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </KanbanColumn>

        {/* In Progress Column */}
        <KanbanColumn 
          title="On Progress" 
          description="Tasks currently being worked on"
          status="progress"
          count={getColumnTasks("progress").length}
          onAddClick={() => {
            setActiveColumn("progress");
            setShowTaskForm(true);
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "progress")}
        >
          {getColumnTasks("progress").map((task) => (
            <KanbanTask 
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </KanbanColumn>

        {/* Done Column */}
        <KanbanColumn 
          title="Done" 
          description="Completed tasks"
          status="done"
          count={getColumnTasks("done").length}
          onAddClick={() => {
            setActiveColumn("done");
            setShowTaskForm(true);
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
        >
          {getColumnTasks("done").map((task) => (
            <KanbanTask 
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </KanbanColumn>
      </div>

      {/* Task Creation Modal */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-design-blue">
              Add Task to {activeColumn === "backlog" ? "Backlog" : 
                          activeColumn === "progress" ? "On Progress" : 
                          activeColumn === "done" ? "Done" : ""}
            </DialogTitle>
          </DialogHeader>
          <TaskForm onSaveTask={handleAddTask} />
        </DialogContent>
      </Dialog>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={showTaskDetails}
          onClose={() => setShowTaskDetails(false)}
          task={selectedTask}
          onDelete={handleDeleteConfirm}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
