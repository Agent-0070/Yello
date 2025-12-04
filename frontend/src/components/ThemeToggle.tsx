import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-secondary border border-border p-1 transition-colors duration-200 hover:bg-secondary-hover"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-gradient-primary shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Sun className="w-4 h-4 text-primary-foreground" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}