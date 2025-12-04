import { useState, forwardRef } from "react"
import { motion } from "framer-motion"
import { 
  Check, 
  Trash2, 
  Clock, 
  Calendar, 
  Tag, 
  Star, 
  Play, 
  Pause, 
  MoreHorizontal,
  Edit,
  Repeat
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import type { Task } from "../types/task"

interface EnhancedTaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onStartTimer?: (id: string) => void
  onStopTimer?: (id: string) => void
  onEdit?: (id: string) => void
}

export const EnhancedTaskItem = forwardRef<HTMLDivElement, EnhancedTaskItemProps>(
  ({ 
    task, 
    onToggle, 
    onDelete, 
    onStartTimer, 
    onStopTimer,
    onEdit 
  }, ref) => {
    const [isTimerRunning, setIsTimerRunning] = useState(false)

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDate && !task.completed && new Date() > dueDate
    const isDueSoon = dueDate && !task.completed &&
      new Date() <= dueDate &&
      (dueDate.getTime() - new Date().getTime()) <= (24 * 60 * 60 * 1000) // 24 hours

    const priorityColors = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }

    const handleTimerToggle = () => {
      if (isTimerRunning) {
        onStopTimer?.(task.id)
        setIsTimerRunning(false)
      } else {
        onStartTimer?.(task.id)
        setIsTimerRunning(true)
      }
    }

    const completedSubtasks = task.subtasks?.filter(subtask => subtask.completed).length || 0
    const totalSubtasks = task.subtasks?.length || 0
    const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

    return (
      <motion.div
        ref={ref} // <-- forwarded ref to fix warning
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="group"
      >
        <div className={`flex flex-col gap-3 p-4 bg-surface-elevated border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover-lift ${
          isOverdue ? 'border-red-500 shadow-red-100 dark:shadow-red-900/20' :
          isDueSoon ? 'border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/20' :
          'border-border'
        }`}>
          
          {/* Main task row */}
          <div className="flex items-center gap-4">
            {/* Custom Animated Checkbox */}
            <motion.button
              onClick={() => onToggle(task.id)}
              className={`relative w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                task.completed
                  ? "bg-gradient-accent border-accent shadow-glow"
                  : "border-border hover:border-accent"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: task.completed ? 1 : 0,
                  rotate: task.completed ? 0 : 180,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <Check className="w-4 h-4 text-accent-foreground absolute inset-0 m-auto" />
              </motion.div>
            </motion.button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              {/* Main text and priority */}
              <div className="flex items-center gap-2 mb-1">
                <motion.span
                  className={`flex-1 text-sm font-medium transition-all duration-300 ${
                    task.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                  animate={{
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {task.text}
                </motion.span>
                
                {/* Priority badge */}
                <Badge className={`${priorityColors[task.priority]} flex items-center gap-1`}>
                  {task.priority === 'high' && <Star className="w-3 h-3" />}
                  {task.priority}
                </Badge>

                {/* Recurring indicator */}
                {task.isRecurring && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    {task.recurringPattern}
                  </Badge>
                )}
              </div>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {/* Category */}
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {task.category}
                </div>

                {/* Due date */}
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${
                    isOverdue ? 'text-red-600 dark:text-red-400' :
                    isDueSoon ? 'text-yellow-600 dark:text-yellow-400' :
                    ''
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {dueDate?.toLocaleDateString()}
                    {isOverdue && " (Overdue)"}
                    {isDueSoon && " (Due Soon)"}
                  </div>
                )}

                {/* Time estimate */}
                {task.estimatedTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimatedTime}m
                    {task.actualTime && ` / ${task.actualTime}m actual`}
                  </div>
                )}
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Subtasks ({completedSubtasks}/{totalSubtasks})
                    </span>
                    <Progress value={subtaskProgress} className="h-1 flex-1" />
                  </div>
                </div>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  {task.notes}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Timer button */}
              {task.estimatedTime && onStartTimer && onStopTimer && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTimerToggle}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {isTimerRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* More actions menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task.id)}
                        className="w-full justify-start gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Task
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Task
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
)

EnhancedTaskItem.displayName = "EnhancedTaskItem"
