import confetti from 'canvas-confetti'

export const triggerConfetti = {
  // Celebration for completing a task
  taskComplete: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#059669', '#047857'] // Green shades
    })
  },

  // Bigger celebration for completing all tasks
  allTasksComplete: () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 }
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#10B981', '#059669', '#047857', '#F59E0B', '#D97706']
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  },

  // Streak milestone celebration
  streakMilestone: (streak: number) => {
    const particleCount = Math.min(streak * 10, 300)
    
    confetti({
      particleCount,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6']
    })

    // Add text effect for major milestones
    if (streak % 7 === 0) { // Weekly milestone
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#EF4444', '#DC2626', '#B91C1C']
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3B82F6', '#2563EB', '#1D4ED8']
        })
      }, 200)
    }
  },

  // Priority task completion
  highPriorityComplete: () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#DC2626', '#B91C1C', '#F59E0B', '#D97706'],
      shapes: ['star']
    })
  }
}