import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { TaskInput } from "../components/TaskInput"
import { TaskList } from "../components/TaskList"
import { TaskStats } from "../components/TaskStats"
import { ClearAllButton } from "../components/ClearAllButton"
import type { Task } from "../components/TaskItem"
import { useToast } from "../hooks/use-toast"

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const { toast } = useToast()

  const addTask = useCallback((taskData: Partial<Task> & { text: string }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: taskData.text,
      completed: false,
      createdAt: new Date(),
      priority: taskData.priority || 'medium',
      category: taskData.category || 'General',
      tags: taskData.tags || [],
      dueDate: taskData.dueDate,
      estimatedTime: taskData.estimatedTime,
      isRecurring: taskData.isRecurring || false,
      recurringPattern: taskData.recurringPattern,
      subtasks: taskData.subtasks || [],
      notes: taskData.notes,
    }
    setTasks(prev => [newTask, ...prev])
    toast({
      title: "Task added!",
      description: "Your new task has been added to the list.",
    })
  }, [toast])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    })
  }, [toast])

  const clearAllTasks = useCallback(() => {
    setTasks([])
    toast({
      title: "All tasks cleared",
      description: "Your task list is now empty.",
    })
  }, [toast])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Task Input */}
        <TaskInput onAddTask={(text) => addTask({ text })} />
        
        {/* Task Statistics */}
        <AnimatePresence>
          {tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TaskStats tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="min-h-[400px]">
          <TaskList 
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>

        {/* Clear All Button */}
        <AnimatePresence>
          {tasks.length > 0 && (
            <ClearAllButton 
              onClearAll={clearAllTasks}
              taskCount={tasks.length}
            />
          )}
        </AnimatePresence>
      </motion.main>

      <Footer />
    </div>
  )
}

export default Index