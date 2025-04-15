
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Separator } from "@/components/ui/separator";
import { format, subDays, isWithinInterval, startOfWeek, endOfWeek, subWeeks } from "date-fns";

// Types for skill time tracking
interface SkillLog {
  date: string;
  skill: string;
  duration: number;
}

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Growth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [skillData, setSkillData] = useState<{ name: string; value: number }[]>([]);
  const [weeklyTotals, setWeeklyTotals] = useState<{ week: string; total: number }[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  // Fetch tasks from Supabase
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
        
        setTasks(data);
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

  // Process tasks to extract skill data
  useEffect(() => {
    if (tasks.length === 0) return;

    // Process skill data based on time range
    const processSkillData = () => {
      const now = new Date();
      let startDate: Date;
      
      if (timeRange === 'week') {
        startDate = startOfWeek(now);
      } else {
        startDate = subDays(now, 30);
      }

      // Filter tasks based on date range
      const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.task_date);
        return isWithinInterval(taskDate, { start: startDate, end: now });
      });

      // Aggregate data by skill
      const skillMap = new Map<string, number>();
      
      filteredTasks.forEach(task => {
        // Extract skill category from task, fallback to taskType if no skill specified
        const skill = task.customFields?.skillCategory || task.taskType;
        const duration = task.timeSpent || 0;
        
        if (skill) {
          const current = skillMap.get(skill) || 0;
          skillMap.set(skill, current + duration);
        }
      });

      // Convert to chart data format
      const chartData = Array.from(skillMap.entries()).map(([name, value]) => ({
        name,
        value
      }));

      setSkillData(chartData);

      // Create weekly trend data
      const weeks = Array.from({ length: 4 }, (_, i) => {
        const weekStart = startOfWeek(subWeeks(now, i));
        const weekEnd = endOfWeek(weekStart);
        
        return {
          label: `Week ${i+1}`,
          range: { start: weekStart, end: weekEnd }
        };
      }).reverse();

      const weeklyData = weeks.map(week => {
        const weeklyTasks = tasks.filter(task => {
          const taskDate = new Date(task.task_date);
          return isWithinInterval(taskDate, { 
            start: week.range.start, 
            end: week.range.end 
          });
        });

        // Skills per week data
        const skillsMap = new Map<string, number>();
        weeklyTasks.forEach(task => {
          const skill = task.customFields?.skillCategory || task.taskType;
          const duration = task.timeSpent || 0;
          
          if (skill) {
            const current = skillsMap.get(skill) || 0;
            skillsMap.set(skill, current + duration);
          }
        });

        // Weekly totals
        const totalHours = weeklyTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
        
        return {
          name: week.label,
          total: totalHours,
          ...Object.fromEntries(skillsMap)
        };
      });

      setTrendData(weeklyData);
      
      // Set weekly totals
      setWeeklyTotals(weeklyData.map(week => ({
        week: week.name,
        total: week.total
      })));
    };

    processSkillData();
  }, [tasks, timeRange]);

  // Get under-represented skills to suggest improvements
  const getSuggestedSkills = () => {
    if (skillData.length === 0) return [];
    
    // Sort skills by time spent (ascending)
    const sortedSkills = [...skillData].sort((a, b) => a.value - b.value);
    
    // Return the bottom 2 skills, or all if less than 2
    return sortedSkills.slice(0, Math.min(2, sortedSkills.length));
  };

  const suggestedSkills = getSuggestedSkills();

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Skill Growth Tracker</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Time
                </CardTitle>
                <Select value={timeRange} onValueChange={(val: 'week' | 'month') => setTimeRange(val)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {skillData.reduce((sum, item) => sum + item.value, 0).toFixed(1)} hours
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {skillData.length} different skills
                </p>
              </CardContent>
            </Card>
            
            {suggestedSkills.length > 0 && (
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recommended Skills to Improve
                  </CardTitle>
                  <CardDescription>
                    These skills are getting less attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestedSkills.map((skill) => (
                      <li key={skill.name} className="flex justify-between items-center">
                        <span>{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.value.toFixed(1)} hrs</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {weeklyTotals.length > 0 && (
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>
                    Your time investment trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weeklyTotals.map((week) => (
                      <li key={week.week} className="flex justify-between items-center">
                        <span>{week.week}</span>
                        <span className="text-sm font-semibold">{week.total.toFixed(1)} hrs</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution</CardTitle>
                  <CardDescription>
                    How your time is divided across skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    {skillData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={skillData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {skillData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Time Spent']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          {isLoading ? "Loading data..." : "No skill data available"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                  <CardDescription>
                    Hours invested per skill
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    {skillData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Time Spent']}
                          />
                          <Bar dataKey="value" name="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          {isLoading ? "Loading data..." : "No skill data available"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Skill Progression</CardTitle>
                <CardDescription>
                  Track your skill development over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px]">
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {skillData.map((skill, index) => (
                          <Bar 
                            key={skill.name}
                            dataKey={skill.name} 
                            stackId="a" 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">
                        {isLoading ? "Loading data..." : "No trend data available"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Growth;
