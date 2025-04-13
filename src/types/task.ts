
export interface Task {
  id: string;
  date: string;
  project: string;
  taskName: string;
  taskType: string;
  timeSpent: number;
  notes: string;
  createdAt: string;
  customFields?: Record<string, any>;
  user_id?: string;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'user_id'>;

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
