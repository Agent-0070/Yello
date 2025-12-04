import { motion, AnimatePresence } from "framer-motion"
import { TaskItem, type Task } from "./TaskItem"
import { EmptyState } from "./EmptyState"

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.div
      className="space-y-3 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}