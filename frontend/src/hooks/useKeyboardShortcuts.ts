import { useEffect } from 'react'

interface KeyboardShortcuts {
  onNewTask?: () => void
  onSearch?: () => void
  onToggleTheme?: () => void
  onClearAll?: () => void
  onSelectAll?: () => void
}

export function useKeyboardShortcuts({
  onNewTask,
  onSearch,
  onToggleTheme,
  onClearAll,
  onSelectAll
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Check for modifier keys
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      const isShift = e.shiftKey

      // Keyboard shortcuts
      if (isCtrlOrCmd && e.key === 'n') {
        e.preventDefault()
        onNewTask?.()
      } else if (isCtrlOrCmd && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
      } else if (isCtrlOrCmd && e.key === 'd') {
        e.preventDefault()
        onToggleTheme?.()
      } else if (isCtrlOrCmd && isShift && e.key === 'Delete') {
        e.preventDefault()
        onClearAll?.()
      } else if (isCtrlOrCmd && e.key === 'a') {
        e.preventDefault()
        onSelectAll?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onNewTask, onSearch, onToggleTheme, onClearAll, onSelectAll])
}