import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"

interface ClearAllButtonProps {
  onClearAll: () => void
  taskCount: number
}

export function ClearAllButton({ onClearAll, taskCount }: ClearAllButtonProps) {
  if (taskCount === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: 0.4 }}
      className="flex justify-center"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-4 h-4" />
          Clear All Tasks
        </motion.div>
      </Button>
    </motion.div>
  )
}