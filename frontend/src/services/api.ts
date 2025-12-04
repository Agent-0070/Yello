import { API_BASE_URL } from '../config/environment';
import type{ Task, CreateTaskRequest, UpdateTaskRequest, TaskStats } from '../types/task';
import AuthService from './auth';

// Polyfill for AbortSignal.timeout if not available
if (typeof AbortSignal !== 'undefined' && !AbortSignal.timeout) {
  AbortSignal.timeout = function(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Handle validation errors from express-validator
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const validationErrors = errorData.errors.map((err: any) =>
        `${err.msg}${err.path ? ` (${err.path})` : ''}`
      ).join(', ');
      
      throw new ApiError(response.status,
        errorData.message ? `${errorData.message}: ${validationErrors}` : validationErrors
      );
    }
    
    const errorMessage = errorData.message ||
                        errorData.error ||
                        `HTTP error! status: ${response.status}`;
    throw new ApiError(response.status, errorMessage);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// Retry mechanism for network requests
const withRetry = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        break;
      }
      
      // Exponential backoff
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

const apiClient = {
  async get<T>(url: string): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        credentials: 'include',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
        // Add timeout and better error handling
        signal: AbortSignal.timeout?.(10000) || (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 10000);
          return controller.signal;
        })(),
      });
      
      // Handle network errors
      if (!response) {
        throw new ApiError(0, 'Network error: Failed to fetch');
      }
      
      return handleResponse(response);
    });
  },

  async post<T>(url: string, data?: any): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout?.(15000) || (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 15000);
          return controller.signal;
        })(),
      });
      
      if (!response) {
        throw new ApiError(0, 'Network error: Failed to fetch');
      }
      
      return handleResponse(response);
    });
  },

  async put<T>(url: string, data?: any): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout?.(15000) || (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 15000);
          return controller.signal;
        })(),
      });
      
      if (!response) {
        throw new ApiError(0, 'Network error: Failed to fetch');
      }
      
      return handleResponse(response);
    });
  },

  async delete<T>(url: string): Promise<T> {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
        signal: AbortSignal.timeout?.(10000) || (() => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 10000);
          return controller.signal;
        })(),
      });
      
      if (!response) {
        throw new ApiError(0, 'Network error: Failed to fetch');
      }
      
      return handleResponse(response);
    });
  },
};

export const taskService = {
  // Get all tasks with optional filters
  getTasks: (filters?: { search?: string; priority?: string; category?: string; status?: string; tags?: string[] }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tags?.length) filters.tags.forEach(tag => params.append('tags', tag));

    const queryString = params.toString();
    return apiClient.get<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  // Get single task
  getTask: (id: string) => apiClient.get<Task>(`/tasks/${id}`),

  // Create new task
  createTask: (taskData: CreateTaskRequest) => apiClient.post<Task>('/tasks', taskData),

  // Update task
  updateTask: (id: string, taskData: UpdateTaskRequest) => apiClient.put<Task>(`/tasks/${id}`, taskData),

  // Delete task
  deleteTask: (id: string) => apiClient.delete<{ success: boolean; message: string }>(`/tasks/${id}`),

  // Get task statistics
  getTaskStats: () => apiClient.get<TaskStats>('/tasks/stats'),

  // Start task timer
  startTimer: (id: string) => apiClient.post<Task>(`/tasks/${id}/timer/start`),

  // Stop task timer
  stopTimer: (id: string) => apiClient.post<Task>(`/tasks/${id}/timer/stop`),

  // Clear all tasks
  clearAllTasks: () => apiClient.delete<{ success: boolean; message: string }>('/tasks'),
};

export default apiClient;