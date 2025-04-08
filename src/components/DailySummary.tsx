
import React, { useMemo } from "react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts";

interface DailySummaryProps {
  tasks: Task[];
}

const COLORS = [
  "#0EA5E9", "#38BDF8", "#7DD3FC", "#BAE6FD",
  "#0284C7", "#0369A1", "#075985", "#0C4A6E"
];

const DailySummary: React.FC<DailySummaryProps> = ({ tasks }) => {
  // Get only today's tasks
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.date === today);
  
  const totalHours = useMemo(() => {
    return todaysTasks.reduce((sum, task) => sum + task.timeSpent, 0);
  }, [todaysTasks]);
  
  const taskTypeData = useMemo(() => {
    const tasksByType: Record<string, number> = {};
    
    todaysTasks.forEach(task => {
      if (tasksByType[task.taskType]) {
        tasksByType[task.taskType] += task.timeSpent;
      } else {
        tasksByType[task.taskType] = task.timeSpent;
      }
    });
    
    return Object.entries(tasksByType).map(([name, value]) => ({
      name,
      value,
    }));
  }, [todaysTasks]);
  
  const projectData = useMemo(() => {
    const tasksByProject: Record<string, number> = {};
    
    todaysTasks.forEach(task => {
      if (tasksByProject[task.project]) {
        tasksByProject[task.project] += task.timeSpent;
      } else {
        tasksByProject[task.project] = task.timeSpent;
      }
    });
    
    return Object.entries(tasksByProject).map(([name, value]) => ({
      name,
      value,
    }));
  }, [todaysTasks]);

  if (todaysTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-design-blue">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tasks recorded for today yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-design-blue">Today's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="section-title mb-2">Time by Task Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {taskTypeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} hrs`, "Time Spent"]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="section-title mb-2">Time by Project</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {projectData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} hrs`, "Time Spent"]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center p-4 bg-design-lightblue rounded-lg">
          <p className="text-lg font-medium">Total time tracked today: <span className="font-bold text-design-blue">{totalHours.toFixed(2)} hours</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
