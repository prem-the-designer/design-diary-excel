
import React from "react";
import { Task } from "@/types/task";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const displayTasks = [...tasks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-design-blue">Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
              {displayTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{format(parseISO(task.date), "MMM dd")}</TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>{task.taskName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.taskType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{task.timeSpent.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
