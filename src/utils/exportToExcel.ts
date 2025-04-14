
import * as XLSX from 'xlsx';
import { Task } from '@/types/task';

export const exportTasksToExcel = (tasks: Task[], filename = 'design-tasks'): void => {
  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(
    tasks.map(task => ({
      Date: task.date,
      Project: task.project,
      'Task Name': task.taskName,
      'Task Type': task.taskType,
      'Time Spent (hours)': task.timeSpent,
      Notes: task.notes,
    }))
  );
  
  // Set column widths
  const columnWidths = [
    { wch: 12 },  // Date
    { wch: 20 },  // Project
    { wch: 30 },  // Task Name
    { wch: 15 },  // Task Type
    { wch: 10 },  // Time Spent
    { wch: 40 },  // Notes
  ];
  
  worksheet['!cols'] = columnWidths;
  
  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
  
  // Generate an xlsx file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// For backward compatibility
export const exportToExcel = exportTasksToExcel;
