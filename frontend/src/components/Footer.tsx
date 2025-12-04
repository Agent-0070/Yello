import { motion } from "framer-motion"
import { Heart, Zap } from "lucide-react"

export function Footer() {
  const motivationalQuotes = [
    "Small steps lead to big changes",
    "Progress, not perfection",
    "You've got this!",
    "One task at a time",
    "Making it happen"
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <motion.footer
      className="mt-auto p-6 bg-surface-elevated border-t border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center gap-2 mb-2"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">{randomQuote}</span>
          <Zap className="w-4 h-4 text-accent" />
        </motion.div>
        
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>Made with</span>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-3 h-3 text-destructive" fill="currentColor" />
          </motion.div>
          <span className='font-salsa'>by iNote</span>
        </div>
        <div className='flex flex-row gap-3'>
          <a href="https://github.com/agent-0070" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://twitter.com/kingdrake0" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="mailto:getlitgotlit@gmail.com" target="_blank" rel="noopener noreferrer">
            Gmail
          </a>
        </div>
      </div>
    </motion.footer>
  )
}