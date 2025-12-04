import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/api';
import type { CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import { useToast } from '../hooks/use-toast';

export const useTasks = (filters?: { search?: string; priority?: string; category?: string; status?: string; tags?: string[] }) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      try {
        const data = await taskService.getTasks(filters);
        // Handle the actual API response format - object with data property
        if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
          return (data as any).data;
        }
        return data as any;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof Error && 'status' in error && (error as any).status >= 400 && (error as any).status < 500) {
        return false;
      }
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: ['task-stats'],
    queryFn: taskService.getTaskStats,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (taskData: CreateTaskRequest) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      toast({
        title: 'Task added!',
        description: 'Your new task has been added to the list.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) => taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask._id] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      if (updatedTask.completed) {
        toast({
          title: 'Task completed!',
          description: 'Great job on completing your task!',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      toast({
        title: 'Task deleted',
        description: 'The task has been removed from your list.',
        variant: 'destructive',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useStartTimer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => taskService.startTimer(id),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task._id] });
      
      toast({
        title: 'Timer started',
        description: 'Task timer is now running.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to start timer',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useStopTimer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => taskService.stopTimer(id),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task._id] });
      
      toast({
        title: 'Timer stopped',
        description: 'Time has been recorded for this task.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to stop timer',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useClearAllTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => taskService.clearAllTasks(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      toast({
        title: 'All tasks cleared',
        description: 'Your task list is now empty.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to clear tasks',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};