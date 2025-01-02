'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle } from 'lucide-react'

interface Task {
  task: string
  description: string
}

interface TaskDisplayProps {
  tasks: Task[]
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ tasks }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (currentTaskIndex < tasks.length) {
      const timer = setTimeout(() => {
        setCurrentTaskIndex((prevIndex) => prevIndex + 1)
      }, 3000) // Adjust this value to change the duration of each task
      return () => clearTimeout(timer)
    } else {
      setIsCompleted(true)
    }
  }, [currentTaskIndex, tasks.length])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 font-mono">
      {tasks.map((task, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-4 border-black rounded-none p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold uppercase">{task.task}</h3>
            {index < currentTaskIndex ? (
              <CheckCircle className="text-green-500 h-8 w-8 stroke-[3]" />
            ) : index === currentTaskIndex ? (
              <Loader2 className="animate-spin text-blue-500 h-8 w-8 stroke-[3]" />
            ) : (
              <div className="h-8 w-8" /> // Placeholder for alignment
            )}
          </div>
          {index <= currentTaskIndex && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-black font-medium mt-2 p-2 bg-yellow-200 border-2 border-black"
            >
              {task.description}
            </motion.p>
          )}
        </motion.div>
      ))}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-bold text-white mt-6 p-4 bg-green-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          Goal Achieved!
        </motion.div>
      )}
    </div>
  )
}

export default TaskDisplay

