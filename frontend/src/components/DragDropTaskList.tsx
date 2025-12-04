import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { motion, AnimatePresence } from "framer-motion"
import { TaskItem, type Task } from "./TaskItem"
import { EmptyState } from "./EmptyState"

interface DragDropTaskListProps {
  tasks: Task[]
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onReorderTasks: (draggedId: string, hoveredId: string) => void
}

interface DraggableTaskItemProps {
  task: Task
  index: number
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onReorderTasks: (draggedId: string, hoveredId: string) => void
}

const ItemType = 'TASK'

function DraggableTaskItem({
  task,
  index,
  onToggleTask,
  onDeleteTask,
  onReorderTasks
}: DraggableTaskItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.id !== task.id) {
        onReorderTasks(draggedItem.id, task.id)
      }
    },
  })

  const opacity = isDragging ? 0.5 : 1

  return (
    <div ref={(node) => { drop(node); drag(node); }} style={{ opacity }}>
      <TaskItem
        task={task}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
      />
    </div>
  )
}

export function DragDropTaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onReorderTasks
}: DragDropTaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <DraggableTaskItem
                task={task}
                index={index}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
                onReorderTasks={onReorderTasks}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </DndProvider>
  )
}