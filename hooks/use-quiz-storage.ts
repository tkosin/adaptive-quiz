"use client"

import { useState, useEffect } from "react"
import type { ExamData } from "@/types/exam"

const STORAGE_KEY = "quiz_history"
const MAX_HISTORY = 10

export interface QuizHistoryItem {
  id: string
  title: string
  uploadedAt: string
  data: ExamData
}

export function useQuizStorage() {
  const [history, setHistory] = useState<QuizHistoryItem[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load quiz history:", error)
    }
  }

  const saveQuiz = (data: ExamData) => {
    const newItem: QuizHistoryItem = {
      id: Date.now().toString(),
      title: data.title,
      uploadedAt: new Date().toISOString(),
      data,
    }

    const updatedHistory = [newItem, ...history.slice(0, MAX_HISTORY - 1)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    setHistory(updatedHistory)

    // Also set as current quiz
    localStorage.setItem("customExamData", JSON.stringify(data))
  }

  const loadQuiz = (id: string) => {
    const item = history.find((h) => h.id === id)
    if (item) {
      localStorage.setItem("customExamData", JSON.stringify(item.data))
      return item.data
    }
    return null
  }

  const deleteQuiz = (id: string) => {
    const updatedHistory = history.filter((h) => h.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    setHistory(updatedHistory)
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("customExamData")
    setHistory([])
  }

  return {
    history,
    saveQuiz,
    loadQuiz,
    deleteQuiz,
    clearHistory,
  }
}
