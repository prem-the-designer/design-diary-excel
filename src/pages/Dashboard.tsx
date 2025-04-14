import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import TaskList from "@/components/TaskList";
import { Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutDashboard, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import { v4 as uuidv4 } from "uuid";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Load tasks from Supabase
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
        
        // Count unique projects
        const uniqueProjects = new Set(formattedTasks.map(task => task.project));
        setProjectCount(uniqueProjects.size);
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
      setShowTaskForm(false);

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
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowTaskForm(true);
    }
  };
  
  // Add event listener for Enter key
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-design-blue">
              <div className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Projects
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total unique projects
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-600">
              <div className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Add New Task
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowTaskForm(true)} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Create Task
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Press <kbd className="px-1 py-0.5 text-xs border rounded bg-gray-100">Enter</kbd> key to access task form
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <TaskList 
          tasks={tasks} 
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-design-blue">Record Design Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSaveTask={handleSaveTask} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
