import { motion } from "framer-motion"
import { LogoutButton } from "./LogoutButton"
import AuthService from "../services/auth"
import { useEffect, useState } from "react"
import type { User } from "../types/auth"
import { ThemeToggle } from "./ThemeToggle"


export function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is authenticated and get user info
    const authState = AuthService.getAuthState()
    if (authState.isAuthenticated) {
      setUser(authState.user)
    }
  }, [])

  return (
    <motion.header
      className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 bg-surface-elevated border-b border-border font-poppins"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="flex items-center gap-1"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="w-8 h-8 md:w-10 md:h-10 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow"
          // Remove continuous rotate animation; use a subtle hover rotation instead
          whileHover={{ rotate: 5, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
         
        </motion.div>
        <div>
          <h1 className=" text-xl md:text-2xl font-salsa font-[750] text-yellow-800"><span className=' text-[40px]'>Y</span>ello</h1>
          <p className="text-xs md:text-sm text-yellow-800"></p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-4">
        {user && <LogoutButton user={user} />}
        <ThemeToggle />
      </div>
    </motion.header>
  )
}