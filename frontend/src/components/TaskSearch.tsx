
import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import type { Task } from "../components/TaskItem"

export interface FilterOptions {
  searchText: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  status?: 'all' | 'completed' | 'pending' | 'overdue'
  tags: string[]
}

interface TaskSearchProps {
  onFilterChange: (filters: FilterOptions) => void
  tasks: Task[]
}

export function TaskSearch({ onFilterChange, tasks }: TaskSearchProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    tags: []
  })

  const categories = Array.from(new Set(tasks.map(task => task.category).filter(cat => cat && cat.trim() !== '')))
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)))

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  const clearFilters = () => {
    const cleared: FilterOptions = { searchText: '', tags: [] }
    setFilters(cleared)
    onFilterChange(cleared)
  }

  const hasActiveFilters = filters.searchText || filters.priority || filters.category || filters.status || filters.tags.length > 0

  return (
    <div className="space-y-4 bg-surface-elevated border border-border rounded-lg p-4 font-poppins">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search tasks..."
          value={filters.searchText}
          onChange={(e) => updateFilters({ searchText: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-2">
        {/* Priority filter */}
        <Select value={filters.priority || 'all'} onValueChange={(value) => updateFilters({ priority: value === 'all' ? undefined : value as any })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className='bg-gray-900 text-white'>
            <SelectItem value="all" className="">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Select value={filters.category || 'all'} onValueChange={(value) => updateFilters({ category: value === 'all' ? undefined : value })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className='bg-gray-900 text-white'>
            <SelectItem value="all" className="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={filters.status || 'all'} onValueChange={(value) => updateFilters({ status: value as any })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className='bg-gray-900 text-white' >
            <SelectItem value="all" className="">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Tags {filters.tags.length > 0 && `(${filters.tags.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-900 text-white">
            <div className="space-y-2">
              <h4 className="font-medium">Filter by tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newTags = filters.tags.includes(tag)
                        ? filters.tags.filter(t => t !== tag)
                        : [...filters.tags, tag]
                      updateFilters({ tags: newTags })
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchText && (
            <Badge variant="secondary">Search: "{filters.searchText}"</Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary">Priority: {filters.priority}</Badge>
          )}
          {filters.category && (
            <Badge variant="secondary">Category: {filters.category}</Badge>
          )}
          {filters.status && filters.status !== 'all' && (
            <Badge variant="secondary">Status: {filters.status}</Badge>
          )}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary">Tag: {tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}
