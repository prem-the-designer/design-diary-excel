
export interface Task {
  id: string;
  date: string;
  project: string;
  taskName: string;
  taskType: string;
  timeSpent: number;
  notes: string;
  createdAt: string;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt'>;

export const taskTypes = [
  "UI Design",
  "UX Research",
  "Wireframing",
  "Prototyping",
  "User Testing",
  "Design Review",
  "Design System",
  "Meetings",
  "Documentation",
  "Other"
];
