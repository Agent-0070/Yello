import { useMemo } from "react"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, Target, Award, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import type { Task } from "../types/task"

interface ProductivityDashboardProps {
  tasks: Task[]
}

export function ProductivityDashboard({ tasks }: ProductivityDashboardProps) {
  // Helper function to ensure date is a Date object
  const ensureDate = (dateValue: Date | string | undefined): Date | null => {
    if (!dateValue) return null;
    return typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  };

  const stats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Basic stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.completed).length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Time-based stats with proper date handling
    const todayTasks = tasks.filter(task => {
      const taskCreatedAt = ensureDate(task.createdAt);
      const taskDueDate = ensureDate(task.dueDate);
      
      return (
        (taskCreatedAt && taskCreatedAt >= today) ||
        (taskDueDate && taskDueDate >= today && taskDueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000))
      )
    })
    const todayCompleted = todayTasks.filter(task => task.completed).length
    const todayCompletionRate = todayTasks.length > 0 ? (todayCompleted / todayTasks.length) * 100 : 0

    const weekTasks = tasks.filter(task => {
      const taskCreatedAt = ensureDate(task.createdAt);
      return taskCreatedAt && taskCreatedAt >= thisWeek
    })
    const weekCompleted = weekTasks.filter(task => task.completed).length

    const monthTasks = tasks.filter(task => {
      const taskCreatedAt = ensureDate(task.createdAt);
      return taskCreatedAt && taskCreatedAt >= thisMonth
    })
    const monthCompleted = monthTasks.filter(task => task.completed).length

    // Overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (task.completed) return false;
      const taskDueDate = ensureDate(task.dueDate);
      return taskDueDate && taskDueDate < now
    }).length

    // Priority distribution
    const highPriorityCompleted = tasks.filter(task => task.priority === 'high' && task.completed).length
    const highPriorityTotal = tasks.filter(task => task.priority === 'high').length

    // Category performance
    const categoryStats = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 }
      }
      acc[task.category].total++
      if (task.completed) acc[task.category].completed++
      return acc
    }, {} as Record<string, { total: number; completed: number }>)

    const topCategory = Object.entries(categoryStats)
      .map(([category, stats]) => {
        const categoryStatsTyped = stats as { total: number; completed: number };
        return {
          category,
          completionRate: categoryStatsTyped.total > 0 ? (categoryStatsTyped.completed / categoryStatsTyped.total) * 100 : 0,
          total: categoryStatsTyped.total
        }
      })
      .sort((a, b) => b.completionRate - a.completionRate)[0]

    // Productivity streak (consecutive days with completed tasks)
    const daysWithTasks = Array.from(new Set(
      tasks.filter(task => task.completed)
        .map(task => {
          const createdAt = ensureDate(task.createdAt);
          return createdAt ? createdAt.toDateString() : '';
        })
        .filter(Boolean) // Filter out any empty strings
    )).sort()

    let currentStreak = 0
    let tempStreak = 0
    const todayString = now.toDateString()
    
    for (let i = daysWithTasks.length - 1; i >= 0; i--) {
      if (i === daysWithTasks.length - 1 && daysWithTasks[i] === todayString) {
        tempStreak = 1
      } else if (i < daysWithTasks.length - 1) {
        const current = new Date(daysWithTasks[i + 1])
        const previous = new Date(daysWithTasks[i])
        const dayDiff = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
        
        if (Math.abs(dayDiff) === 1) {
          tempStreak++
        } else {
          break
        }
      }
    }
    currentStreak = tempStreak

    return {
      totalTasks,
      completedTasks,
      completionRate,
      todayTasks: todayTasks.length,
      todayCompleted,
      todayCompletionRate,
      weekCompleted,
      monthCompleted,
      overdueTasks,
      highPriorityCompleted,
      highPriorityTotal,
      topCategory,
      currentStreak
    }
  }, [tasks])

  const statCards = [
    {
      title: "Overall Progress",
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      subtitle: `${stats.completionRate.toFixed(1)}% completed`,
      icon: Target,
      progress: stats.completionRate,
      color: "text-accent"
    },
    {
      title: "Today's Progress",
      value: `${stats.todayCompleted}/${stats.todayTasks}`,
      subtitle: `${stats.todayCompletionRate.toFixed(1)}% completed`,
      icon: Calendar,
      progress: stats.todayCompletionRate,
      color: "text-primary"
    },
    {
      title: "Productivity Streak",
      value: `${stats.currentStreak}`,
      subtitle: stats.currentStreak === 1 ? "day" : "days",
      icon: Zap,
      color: "text-warning"
    },
    {
      title: "High Priority Tasks",
      value: `${stats.highPriorityCompleted}/${stats.highPriorityTotal}`,
      subtitle: "completed",
      icon: Award,
      progress: stats.highPriorityTotal > 0 ? (stats.highPriorityCompleted / stats.highPriorityTotal) * 100 : 0,
      color: "text-error"
    }
  ]

  return (
    <div className="space-y-6 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                {stat.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-poppins">
        {/* Weekly overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[16px]">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              Weekly Overview
            </CardTitle>
            <CardDescription>Your productivity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className='font-salse'>Tasks completed</span>
                <Badge variant="secondary">{stats.weekCompleted}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Monthly completed</span>
                <Badge variant="secondary">{stats.monthCompleted}</Badge>
              </div>
              {stats.overdueTasks > 0 && (
                <div className="flex justify-between">
                  <span>Overdue tasks</span>
                  <Badge variant="destructive">{stats.overdueTasks}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top performing category */}
        {stats.topCategory && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Category
              </CardTitle>
              <CardDescription>Your most productive category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stats.topCategory.category}</span>
                  <Badge className="bg-gradient-accent">
                    {stats.topCategory.completionRate.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={stats.topCategory.completionRate} className="h-2" />
                <p className="text-sm text-muted-foreground font-poppins">
                  {stats.topCategory.total} tasks in this category
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}