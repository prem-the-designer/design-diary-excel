import React, { useState, useEffect } from "react";
import { Task, TaskFormData } from "@/types/task";
import Layout from "@/components/Layout";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import DailySummary from "@/components/DailySummary";
import { exportTasksToExcel } from "@/utils/exportToExcel";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load tasks from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("desk_table")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Transform data to match our Task interface
        const formattedTasks: Task[] = data.map((task: any) => ({
          id: task.task_id || task.id,
          date: task.task_date || "",
          project: task.project || "",
          taskName: task.taskName || "",
          taskType: task.taskType || "",
          timeSpent: task.timeSpent || 0,
          notes: task.notes || "",
          createdAt: task.created_at || new Date().toISOString(),
          customFields: task.customFields || {},
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Error loading tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleSaveTask = async (taskData: TaskFormData) => {
    if (!user) {
      toast.error("You must be logged in to save tasks");
      return;
    }
    
    try {
      const taskId = uuidv4();
      const newTask: Task = {
        ...taskData,
        id: taskId,
        createdAt: new Date().toISOString(),
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from("desk_table")
        .insert({
          task_id: taskId,
          user_id: user.id,
          project: taskData.project,
          taskName: taskData.taskName,
          taskType: taskData.taskType,
          timeSpent: taskData.timeSpent,
          notes: taskData.notes,
          customFields: taskData.customFields,
          created_at: new Date().toISOString(),
          task_date: taskData.date
        });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      toast.success("Task saved successfully");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (!user) {
      toast.error("You must be logged in to update tasks");
      return;
    }
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from("desk_table")
        .update({
          task_date: updatedTask.date,
          project: updatedTask.project,
          taskName: updatedTask.taskName,
          taskType: updatedTask.taskType,
          timeSpent: updatedTask.timeSpent,
          notes: updatedTask.notes,
          customFields: updatedTask.customFields
        })
        .eq("task_id", updatedTask.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleExport = () => {
    if (tasks.length === 0) {
      toast.error("No tasks to export");
      return;
    }
    
    try {
      exportTasksToExcel(tasks, `design-tasks-${new Date().toISOString().split('T')[0]}`);
      toast.success("Tasks exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting tasks");
    }
  };

  if (loading || authLoading) {
    return (
      <Layout onExport={handleExport}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading tasks...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onExport={handleExport}>
      <div className={`flex flex-col ${!isMobile ? 'md:grid md:grid-cols-2' : ''} gap-6 md:gap-8`}>
        <div className="space-y-6 md:space-y-8 w-full">
          <TaskForm onSaveTask={handleSaveTask} />
          <DailySummary tasks={tasks} />
        </div>
        <div className="w-full">
          <TaskList 
            tasks={tasks} 
            onUpdateTask={handleUpdateTask}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
