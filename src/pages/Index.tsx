
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { v4 as uuidv4 } from "uuid";
import { KanbanStatus } from "@/components/kanban/KanbanBoard";
import { exportTasksToExcel } from "@/utils/exportToExcel";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("desk_table")
          .select("*")
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        const formattedTasks: Task[] = data.map((record: any) => ({
          id: record.task_id,
          date: record.task_date || new Date().toISOString(),
          project: record.project || "",
          taskName: record.taskName || "",
          taskType: record.taskType || "",
          timeSpent: record.timeSpent || 0,
          notes: record.notes || "",
          createdAt: record.created_at || new Date().toISOString(),
          customFields: record.custom_fields || {},
        }));
        
        setTasks(formattedTasks);
      } catch (error: any) {
        console.error("Error fetching tasks:", error.message);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [user, toast]);

  const handleSaveTask = async (task: any) => {
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

      const { error } = await supabase.from("desk_table").insert({
        task_id: newTask.id,
        user_id: user.id,
        task_date: newTask.date,
        project: newTask.project,
        taskName: newTask.taskName,
        taskType: newTask.taskType,
        timeSpent: newTask.timeSpent,
        notes: newTask.notes,
        custom_fields: newTask.customFields || {},
      });

      if (error) throw error;

      setTasks((prevTasks) => [...prevTasks, newTask]);

      toast({
        title: "Success",
        description: "Task saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving task:", error.message);
      toast({
        title: "Error",
        description: `Failed to save task: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const { error } = await supabase
        .from("desk_table")
        .update({
          task_date: updatedTask.date,
          project: updatedTask.project,
          taskName: updatedTask.taskName,
          taskType: updatedTask.taskType,
          timeSpent: updatedTask.timeSpent,
          notes: updatedTask.notes,
          custom_fields: updatedTask.customFields || {},
        })
        .eq("task_id", updatedTask.id);
        
      if (error) throw error;
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating task:", error.message);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("desk_table")
        .delete()
        .eq("task_id", taskId);
        
      if (error) throw error;
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting task:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      exportTasksToExcel(tasks, "design_tasks");
      toast({
        title: "Success",
        description: "Tasks exported to Excel successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export tasks to Excel",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Loading tasks...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onExport={handleExport}>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Activity Board</h1>
        <KanbanBoard 
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleSaveTask}
        />
      </div>
    </Layout>
  );
};

export default Index;
