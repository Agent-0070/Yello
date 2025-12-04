
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, Tag, Clock, Star, Repeat } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar as CalendarComponent } from "../components/ui/calendar"
import type { Task } from "../types/task"

interface EnhancedTaskInputProps {
  onAddTask: (taskData: Partial<Task> & { text: string }) => void
}

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
]

const categories = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Home']

export function EnhancedTaskInput({ onAddTask }: EnhancedTaskInputProps) {
  const [text, setText] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('General')
  const [dueDate, setDueDate] = useState<Date>()
  const [estimatedTime, setEstimatedTime] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted, text:', text.trim())
    if (text.trim()) {
      console.log('Adding task with data:', {
        text: text.trim(),
        priority,
        category,
        dueDate,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
        tags,
        isRecurring,
        recurringPattern: isRecurring ? recurringPattern : undefined,
        notes: notes.trim() || undefined,
      })
      onAddTask({
        text: text.trim(),
        priority,
        category,
        dueDate,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
        tags,
        isRecurring,
        recurringPattern: isRecurring ? recurringPattern : undefined,
        notes: notes.trim() || undefined,
      })
      
      // Reset form
      setText("")
      setNotes("")
      setEstimatedTime("")
      setNewTag("")
      setTags([])
      setDueDate(undefined)
      setIsExpanded(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const priorityConfig = priorities.find(p => p.value === priority)

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-surface-elevated border border-border rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Main input row */}
      <div className="flex gap-3 p-6">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-background border-border focus:ring-accent focus:border-accent transition-all duration-200"
          onFocus={() => setIsExpanded(true)}
        />
        
        {/* Quick priority indicator */}
        <div className="flex items-center gap-2">
          {priorityConfig && (
            <Badge className={priorityConfig.color}>
              {priority === 'high' && <Star className="w-3 h-3 mr-1" />}
              {priorityConfig.label}
            </Badge>
          )}
        </div>

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
      </div>

      {/* Expanded options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border px-6 pb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          {p.value === 'high' && <Star className="w-3 h-3 text-red-500" />}
                          {p.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-glass text-black dark:text-white">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {dueDate ? dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  {/* Fixed width popover so calendar doesn't compress on small screens */}
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-background text-black dark:text-white">
                    <CalendarComponent
                      mode="single"
                      numberOfMonths={1}
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="p-3"
                      disabled={false}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Estimated Time */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Estimated Time (min)
                </Label>
                <Input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="30"
                  min="1"
                />
              </div>

              {/* Recurring */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Recurring
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded"
                    aria-label="Recurring task"
                    title="Recurring task"
                  />
                  {isRecurring && (
                    <Select value={recurringPattern} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setRecurringPattern(value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 mt-4">
              <Label>Tags</Label>
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 mt-4">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4 ">
              <Button className='cursor-pointer'
                type="button" 
                variant="outline" 
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button className='cursor-pointer border border-primary' type="submit" disabled={!text.trim()}>
                Add Task
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}
