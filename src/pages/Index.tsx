
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import TaskForm from "@/components/TaskForm";
import DailySummary from "@/components/DailySummary";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { exportTasksToExcel as exportToExcel } from "@/utils/exportToExcel";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
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
        
        // Convert database records to Task objects
        const formattedTasks: Task[] = data.map((record: any) => ({
          id: record.task_id,
          date: record.task_date || new Date().toISOString(),
          project: record.project || "",
          taskName: record.taskName || "",
          taskType: record.taskType || "",
          timeSpent: record.timeSpent || 0,
          notes: record.notes || "",
          createdAt: record.created_at || new Date().toISOString(),
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

  const handleSaveTask = async (task: Omit<Task, "id">) => {
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
      });

      if (error) throw error;

      setTasks((prevTasks) => [...prevTasks, newTask]);

      toast({
        title: "Success",
        description: "Task saved successfully",
      });
      
      // Navigate to dashboard after creating a task
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error saving task:", error.message);
      toast({
        title: "Error",
        description: `Failed to save task: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      exportToExcel(tasks, "design_tasks");
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

  const today = new Date();
  const todaysTasks = tasks.filter(
    (task) => new Date(task.date).toDateString() === today.toDateString()
  );
  const totalHoursToday = todaysTasks.reduce(
    (total, task) => total + task.timeSpent,
    0
  );

  return (
    <Layout onExport={handleExport}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-3 lg:col-span-2">
          <TaskForm onSave={handleSaveTask} />
        </div>
        
        <div className="md:col-span-3 lg:col-span-1">
          <DailySummary 
            tasks={todaysTasks}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
