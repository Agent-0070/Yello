import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

interface TaskInputProps {
  onAddTask: (text: string) => void
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAddTask(text.trim())
      setText("")
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-3 p-6 bg-surface-elevated border border-border rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-background border-border focus:ring-accent focus:border-accent transition-all duration-200"
      />
      <Button
        type="submit"
        size="icon"
        className="bg-gradient-accent hover:bg-accent-hover shadow-glow transition-all duration-200"
        disabled={!text.trim()}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-5 h-5" />
        </motion.div>
      </Button>
    </motion.form>
  )
}