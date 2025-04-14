import React, { useState } from "react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportTasksToExcel } from "@/utils/exportToExcel";
import { taskTypes } from "@/types/task";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DailySummary from "@/components/DailySummary";
import { FileDown, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("designTasks");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
      }
    }
    return [];
  });
  
  const [filter, setFilter] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    taskType: "",
    project: "",
  });
  
  const [activeTab, setActiveTab] = useState("today");
  const isMobile = useIsMobile();
  
  const projects = Array.from(new Set(tasks.map(task => task.project)));
  
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    
    if (filter.startDate && taskDate < filter.startDate) return false;
    if (filter.endDate) {
      const endOfDay = new Date(filter.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (taskDate > endOfDay) return false;
    }
    
    if (filter.taskType && task.taskType !== filter.taskType) return false;
    
    if (filter.project && task.project !== filter.project) return false;
    
    return true;
  });
  
  const totalHours = filteredTasks.reduce((total, task) => total + task.timeSpent, 0);
  
  const handleExportFiltered = () => {
    if (filteredTasks.length === 0) {
      toast.error("No tasks to export");
      return;
    }
    
    try {
      let filename = "design-tasks";
      if (filter.startDate) {
        filename += `-from-${format(filter.startDate, "yyyy-MM-dd")}`;
      }
      if (filter.endDate) {
        filename += `-to-${format(filter.endDate, "yyyy-MM-dd")}`;
      }
      if (filter.taskType) {
        filename += `-${filter.taskType}`;
      }
      if (filter.project) {
        filename += `-${filter.project}`;
      }
      
      exportTasksToExcel(filteredTasks, filename);
      toast.success("Filtered tasks exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting tasks");
    }
  };
  
  const handleExportToGoogleSheets = () => {
    const headers = ["Date", "Project", "Task Name", "Task Type", "Time Spent (hours)", "Notes"];
    const csvRows = [headers];
    
    filteredTasks.forEach(task => {
      csvRows.push([
        format(new Date(task.date), "yyyy-MM-dd"),
        task.project,
        task.taskName,
        task.taskType,
        task.timeSpent.toString(),
        task.notes
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQPwexX/create?usp=sharing`;
    
    window.open(googleSheetsUrl, '_blank');
    
    toast.success("Opening Google Sheets. Please import the downloaded CSV file.");
    
    const a = document.createElement('a');
    a.href = url;
    a.download = "design-tasks-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const resetFilters = () => {
    setFilter({
      startDate: undefined,
      endDate: undefined,
      taskType: "",
      project: "",
    });
    setActiveTab("today");
    toast.info("Filters reset");
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    switch (value) {
      case "today":
        setFilter(prev => ({
          ...prev,
          startDate: today,
          endDate: today
        }));
        break;
      case "week":
        setFilter(prev => ({
          ...prev,
          startDate: startOfWeek,
          endDate: today
        }));
        break;
      case "month":
        setFilter(prev => ({
          ...prev,
          startDate: startOfMonth,
          endDate: today
        }));
        break;
      case "year":
        setFilter(prev => ({
          ...prev,
          startDate: startOfYear,
          endDate: today
        }));
        break;
      case "custom":
        break;
    }
  };
  
  return (
    <Layout onExport={handleExportFiltered}>
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-design-blue">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full" style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '100%', minHeight: '300px' }}>
                <DailySummary tasks={filteredTasks} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-design-blue">Task Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="year">This Year</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="custom" className="pt-4">
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filter.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filter.startDate ? format(filter.startDate, "PP") : "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
                          <Calendar
                            mode="single"
                            selected={filter.startDate}
                            onSelect={(date) => setFilter(prev => ({ ...prev, startDate: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filter.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filter.endDate ? format(filter.endDate, "PP") : "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className={`w-auto p-0 ${isMobile ? 'max-w-[280px]' : ''}`}>
                          <Calendar
                            mode="single"
                            selected={filter.endDate}
                            onSelect={(date) => setFilter(prev => ({ ...prev, endDate: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
                <div className="space-y-2">
                  <Label>Task Type</Label>
                  <Select 
                    value={filter.taskType}
                    onValueChange={(value) => setFilter(prev => ({ ...prev, taskType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Task Types</SelectItem>
                      {taskTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select 
                    value={filter.project}
                    onValueChange={(value) => setFilter(prev => ({ ...prev, project: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Projects</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project} value={project}>{project}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between flex-wrap gap-3">
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleExportToGoogleSheets}
                    className="flex items-center gap-2"
                  >
                    <FileDown size={18} />
                    Export to Google Sheets
                  </Button>
                  <Button onClick={handleExportFiltered}>Export to Excel</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>Total Records: <span className="font-medium">{filteredTasks.length}</span></p>
                  <p>Total Hours: <span className="font-medium">{totalHours.toFixed(1)}</span></p>
                </div>
              </div>
              
              {filteredTasks.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{format(new Date(task.date), "PP")}</TableCell>
                          <TableCell>{task.project}</TableCell>
                          <TableCell>{task.taskName}</TableCell>
                          <TableCell>{task.taskType}</TableCell>
                          <TableCell className="text-right">{task.timeSpent.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No tasks match your filter criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
