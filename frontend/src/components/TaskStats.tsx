import { motion } from "framer-motion"
import type { Task } from "./TaskItem"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  if (totalTasks === 0) return null

  return (
    <motion.div
      className="p-4 bg-surface-elevated border border-border rounded-lg shadow-sm font-poppins"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Progress</h3>
        <span className="text-sm text-muted-foreground">
          {completedTasks} of {totalTasks} completed
        </span>
      </div>
      
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.3,
          }}
        />
      </div>
      
      <motion.div
        className="mt-2 text-xs text-center font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-accent">{Math.round(completionRate)}% Complete</span>
      </motion.div>
    </motion.div>
  )
}