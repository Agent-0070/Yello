import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { EnhancedTaskInput } from "../components/EnhancedTaskInput"

import { EnhancedTaskItem } from "../components/EnhancedTaskItem"
import { TaskSearch, type  FilterOptions } from "../components/TaskSearch"
import { ProductivityDashboard } from "../components/ProductivityDashboard"
import { TaskStats } from "../components/TaskStats"
import { ClearAllButton } from "../components/ClearAllButton"
import { EmptyState } from "../components/EmptyState"
import type{ Task } from "../types/task"
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts"

import { useTheme } from "../components/ThemeProvider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { BarChart3, List, Settings } from "lucide-react"
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useStartTimer,
  useStopTimer,
  useClearAllTasks
} from "../hooks/useTasks"
import { EditTaskDialog } from "../components/EditTaskDialog"
import { BrowserCompatibility } from "../components/BrowserCompatibility"

const EnhancedIndex = () => {
  const { data: tasks = [], isLoading, error } = useTasks()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const startTimerMutation = useStartTimer()
  const stopTimerMutation = useStopTimer()
  const clearAllTasksMutation = useClearAllTasks()

  const [filters, setFilters] = useState<FilterOptions>({ searchText: '', tags: [] })

  const [activeTab, setActiveTab] = useState("tasks")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { toggleTheme } = useTheme()

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    
    return tasks.filter((task: { text: string; category: string; tags: string[]; priority: string; dueDate: string | number | Date; completed: any }) => {
      // Text search
      if (filters.searchText && !task.text.toLowerCase().includes(filters.searchText.toLowerCase()) &&
          !task.category.toLowerCase().includes(filters.searchText.toLowerCase()) &&
          !task.tags.some(tag => tag.toLowerCase().includes(filters.searchText.toLowerCase()))) {
        return false
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false
      }

      // Category filter
      if (filters.category && task.category !== filters.category) {
        return false
      }

      // Status filter
      if (filters.status) {
        const now = new Date()
        const dueDate = task.dueDate ? new Date(task.dueDate) : null
        switch (filters.status) {
          case 'completed':
            if (!task.completed) return false
            break
          case 'pending':
            if (task.completed) return false
            break
          case 'overdue':
            if (task.completed || !dueDate || dueDate >= now) return false
            break
        }
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => task.tags.includes(tag))) {
        return false
      }

      return true
    })
  }, [tasks, filters])

  const addTask = useCallback((taskData: Partial<Task> & { text: string }) => {
    createTaskMutation.mutate(taskData)
  }, [createTaskMutation])

  const toggleTask = useCallback((id: string) => {
    const task = tasks?.find((t: { id: string; _id: string }) => t.id === id || t._id === id)
    if (task) {
      updateTaskMutation.mutate({
        id: task._id || task.id,
        data: { completed: !task.completed }
      })
    }
  }, [updateTaskMutation, tasks])

  const deleteTask = useCallback((id: string) => {
    const task = tasks?.find((t: { id: string; _id: string }) => t.id === id || t._id === id)
    if (task) {
      deleteTaskMutation.mutate(task._id || task.id)
    }
  }, [deleteTaskMutation, tasks])

  const clearAllTasks = useCallback(() => {
    clearAllTasksMutation.mutate()
  }, [clearAllTasksMutation])

  const startTimer = useCallback((id: string) => {
    const task = tasks?.find((t: { id: string; _id: string }) => t.id === id || t._id === id)
    if (task) {
      startTimerMutation.mutate(task._id || task.id)
    }
  }, [startTimerMutation, tasks])

  const stopTimer = useCallback((id: string) => {
    const task = tasks?.find((t: { id: string; _id: string }) => t.id === id || t._id === id)
    if (task) {
      stopTimerMutation.mutate(task._id || task.id)
    }
  }, [stopTimerMutation, tasks])

  const editTask = useCallback((id: string) => {
    const task = tasks?.find((t: { id: string; _id: string }) => t.id === id || t._id === id)
    if (task) {
      setEditingTask(task)
      setIsEditDialogOpen(true)
    }
  }, [tasks])

  const handleSaveEdit = useCallback((taskData: Partial<Task>) => {
    if (editingTask) {
      updateTaskMutation.mutate({
        id: editingTask._id || editingTask.id,
        data: taskData
      })
      setIsEditDialogOpen(false)
      setEditingTask(null)
    }
  }, [updateTaskMutation, editingTask])

  const selectAllTasks = useCallback(() => {
    // Selection state not tracked in this build — no-op placeholder
  }, [])

  const focusNewTask = useCallback(() => {
    const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement
    input?.focus()
  }, [])

  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
    searchInput?.focus()
  }, [])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: focusNewTask,
    onSearch: focusSearch,
    onToggleTheme: toggleTheme,
    onClearAll: clearAllTasks,
    onSelectAll: selectAllTasks
  })

  const stats = useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, pending: 0, overdue: 0 }
    
    const total = tasks.length
    const completed = tasks.filter((task: { completed: any }) => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter((task: { completed: any; dueDate: string | number | Date }) => {
      if (task.completed || !task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate < new Date()
    }).length

    return { total, completed, pending, overdue }
  }, [tasks])

  // Handle offline state
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Browser compatibility check */}
      <BrowserCompatibility />
      
      {/* Offline indicator */}
      {!isOnline && (
        <motion.div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium">
            ⚠️ You are currently offline. Some features may be limited.
          </p>
        </motion.div>
      )}

      {/* Error boundary for task operations */}
      {error && (
        <motion.div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium font-poppins">
            ❌ Failed to load tasks. {error.message || 'Please try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </motion.div>
      )}

      <motion.main
        className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Task Input */}
        <EnhancedTaskInput onAddTask={addTask} />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks" className="flex items-center gap-2 font-poppins">
              <List className="w-4 h-4" />
              Tasks {stats.total > 0 && `(${stats.total})`}
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2 font-poppins">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 font-poppins">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto font-poppins"></div>
                <p className="text-muted-foreground mt-2">Loading tasks...</p>
              </div>
            )}

            {/* Search and Filters */}
            {tasks && tasks.length > 0 && (
              <TaskSearch
                onFilterChange={setFilters}
                tasks={tasks}
              />
            )}

            {/* Task Statistics */}
            <AnimatePresence>
              {tasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskStats tasks={filteredTasks} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task List */}
            <div className="min-h-[400px]">
              {!isLoading && !error && (
                <>
                  {filteredTasks.length === 0 && tasks.length > 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No tasks match your current filters.</p>
                      <Button
                        variant="outline"
                        onClick={() => setFilters({ searchText: '', tags: [] })}
                        className="mt-2"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {filteredTasks.map((task: Task) => (
                          <EnhancedTaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onStartTimer={startTimer}
                            onStopTimer={stopTimer}
                            onEdit={editTask}
                          />
                        ))}
                      </AnimatePresence>
                      
                      {filteredTasks.length === 0 && tasks.length === 0 && <EmptyState />}
                    </div>
                  )}
                </>
              )}
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
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <ProductivityDashboard tasks={tasks} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-surface-elevated border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>New Task</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + N</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Search</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle Theme</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + D</kbd>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Clear All</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + Shift + Del</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Select All</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + A</kbd>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.main>

      <Footer />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
        isLoading={updateTaskMutation.isPending}
      />
    </div>
  )
}

export default EnhancedIndex