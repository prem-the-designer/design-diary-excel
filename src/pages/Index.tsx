
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

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isMobile = useIsMobile();

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("designTasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Error loading saved tasks");
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("designTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    setTasks((prevTasks) => [newTask, ...prevTasks]);
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

  return (
    <Layout onExport={handleExport}>
      <div className={`flex flex-col ${!isMobile ? 'md:grid md:grid-cols-2' : ''} gap-6 md:gap-8`}>
        <div className="space-y-6 md:space-y-8 w-full">
          <TaskForm onSaveTask={handleSaveTask} />
          <DailySummary tasks={tasks} />
        </div>
        <div className="w-full">
          <TaskList tasks={tasks} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
