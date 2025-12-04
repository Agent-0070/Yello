import { motion } from "framer-motion"
import { Check, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import type { Task } from "../types/task"

export interface SubTask {
  id: string
  text: string
  completed: boolean
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <motion.div
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
      <div className="flex items-center gap-4 p-4 bg-surface-elevated border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover-lift">
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

        {/* Task Text */}
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

        {/* Delete Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export type { Task }
