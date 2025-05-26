"use client"

import { useState, useEffect } from "react"

export interface QuizFile {
  id: string
  name: string
  data: any
}

export function useQuizFiles() {
  const [quizFiles, setQuizFiles] = useState<QuizFile[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  // โหลดรายการไฟล์ข้อสอบจาก localStorage
  useEffect(() => {
    try {
      const storedFiles = localStorage.getItem("quizFiles")
      if (storedFiles) {
        setQuizFiles(JSON.parse(storedFiles))
      }
    } catch (error) {
      console.error("Error loading quiz files:", error)
    }
  }, [])

  // บันทึกไฟล์ข้อสอบใหม่
  const saveQuizFile = (name: string, data: any) => {
    try {
      const id = `quiz_${Date.now()}`
      const newFile = { id, name, data }

      const updatedFiles = [...quizFiles, newFile]
      setQuizFiles(updatedFiles)
      localStorage.setItem("quizFiles", JSON.stringify(updatedFiles))

      return id
    } catch (error) {
      console.error("Error saving quiz file:", error)
      return null
    }
  }

  // ใช้ข้อสอบที่เลือก
  const useSelectedQuiz = (id: string) => {
    try {
      const selectedQuiz = quizFiles.find((file) => file.id === id)
      if (selectedQuiz) {
        localStorage.setItem("customExamData", JSON.stringify(selectedQuiz.data))
        setSelectedQuizId(id)
        return true
      }
      return false
    } catch (error) {
      console.error("Error using selected quiz:", error)
      return false
    }
  }

  // ลบไฟล์ข้อสอบ
  const deleteQuizFile = (id: string) => {
    try {
      const updatedFiles = quizFiles.filter((file) => file.id !== id)
      setQuizFiles(updatedFiles)
      localStorage.setItem("quizFiles", JSON.stringify(updatedFiles))

      // ถ้าลบไฟล์ที่กำลังใช้อยู่ ให้ล้าง customExamData
      if (selectedQuizId === id) {
        localStorage.removeItem("customExamData")
        setSelectedQuizId(null)
      }

      return true
    } catch (error) {
      console.error("Error deleting quiz file:", error)
      return false
    }
  }

  return {
    quizFiles,
    selectedQuizId,
    saveQuizFile,
    useSelectedQuiz,
    deleteQuizFile,
    setSelectedQuizId,
  }
}
