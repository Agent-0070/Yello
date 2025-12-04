export interface Task {
  _id?: string;
  id: string;
  title?: string;
  text: string;
  completed: boolean;
  createdAt: Date | string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  dueDate?: Date | string;
  estimatedTime?: number;
  actualTime?: number;
  timeStarted?: Date | string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  subtasks: SubTask[];
  notes?: string;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  totalEstimatedTime?: number;
  totalActualTime?: number;
}

export interface CreateTaskRequest {
  text: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  dueDate?: Date | string;
  estimatedTime?: number;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  subtasks?: Partial<SubTask>[];
  notes?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed?: boolean;
}