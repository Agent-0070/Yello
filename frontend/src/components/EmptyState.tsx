import { motion } from "framer-motion"
import { CheckCircle2, Sparkles } from "lucide-react"

export function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      }}
    >
      <motion.div
        className="relative mb-6"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <CheckCircle2 className="w-24 h-24 text-accent opacity-20" />
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CheckCircle2 className="w-24 h-24 text-accent" />
          </motion.div>
        </div>
        
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6 text-warning" />
        </motion.div>
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        No tasks yet!
      </motion.h3>
      
      <motion.p
        className="text-muted-foreground max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Create your first task above and start getting things done with style ✨
      </motion.p>
    </motion.div>
  )
}