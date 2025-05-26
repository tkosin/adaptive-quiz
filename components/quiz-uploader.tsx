"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileJson, CheckCircle, XCircle, HelpCircle, Save } from "lucide-react"
import { useQuizFiles } from "@/hooks/use-quiz-files"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuizUploaderProps {
  onUploadSuccess?: () => void
}

export function QuizUploader({ onUploadSuccess }: QuizUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedData, setUploadedData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showExample, setShowExample] = useState(false)
  const { quizFiles, saveQuizFile, useSelectedQuiz, selectedQuizId, setSelectedQuizId } = useQuizFiles()

  // Update the validateExamData function to be more flexible and provide better error messages:
  function validateExamData(data: any): { valid: boolean; error?: string } {
    try {
      // Check for title
      if (!data.title || typeof data.title !== "string") {
        return { valid: false, error: "Missing or invalid title field" }
      }

      // Check for questions array
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        return { valid: false, error: "Missing or empty questions array" }
      }

      // Validate each question
      for (let i = 0; i < data.questions.length; i++) {
        const question = data.questions[i]

        // Check required fields
        if (!question.question || typeof question.question !== "string") {
          return { valid: false, error: `Question at index ${i} is missing question text` }
        }

        // Check options
        if (!question.options || typeof question.options !== "object" || Object.keys(question.options).length === 0) {
          return { valid: false, error: `Question at index ${i} has invalid options format` }
        }

        // Check answer
        if (!question.answer) {
          return { valid: false, error: `Question at index ${i} is missing an answer` }
        }

        // Ensure the answer exists in options
        const optionKeys = Object.keys(question.options)
        if (!optionKeys.includes(question.answer)) {
          return { valid: false, error: `Question at index ${i} has an answer that doesn't match any option` }
        }

        // If id is missing, assign one
        if (!question.id) {
          question.id = i + 1
          console.log(`Assigned ID ${question.id} to question at index ${i}`)
        }
      }

      // If totalQuestions is missing, set it
      if (!data.totalQuestions) {
        data.totalQuestions = data.questions.length
        console.log(`Set totalQuestions to ${data.totalQuestions}`)
      }

      // If createdDate is missing, set it to today
      if (!data.createdDate) {
        data.createdDate = new Date().toISOString().split("T")[0]
        console.log(`Set createdDate to ${data.createdDate}`)
      }

      return { valid: true }
    } catch (error) {
      console.error("Validation error:", error)
      return { valid: false, error: "Unexpected error during validation" }
    }
  }

  // Add console logging to help debug the upload process
  const handleFile = async (file: File) => {
    setError(null)
    setSuccess(false)
    setUploadedData(null)

    if (!file.name.endsWith(".json")) {
      setError("Please upload a JSON file")
      return
    }

    try {
      const text = await file.text()
      console.log("File content length:", text.length)

      let data
      try {
        data = JSON.parse(text)
        console.log("Successfully parsed JSON")
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        setError("Failed to parse JSON file. The file may be corrupted or not in valid JSON format.")
        return
      }

      console.log("Validating data structure...")
      const validationResult = validateExamData(data)

      if (!validationResult.valid) {
        setError(`Invalid quiz data format: ${validationResult.error}`)
        return
      }

      console.log("Data validation successful")
      // Store in localStorage for later use, but don't activate it yet
      localStorage.setItem("uploadedQuizData", JSON.stringify(data))
      setSuccess(true)
      setFile(file)
      setUploadedData(data)

      // Show success message with quiz details
      console.log(`Successfully uploaded quiz: "${data.title}" with ${data.questions.length} questions`)

      // Notify parent component
      if (onUploadSuccess) {
        setTimeout(onUploadSuccess, 1000)
      }
    } catch (err) {
      console.error("Error processing file:", err)
      setError("Failed to process the file. Please try again.")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleSaveQuiz = () => {
    if (uploadedData && file) {
      const quizName = file.name.replace(".json", "")
      const quizId = saveQuizFile(quizName, uploadedData)
      if (quizId) {
        setSelectedQuizId(quizId)
        alert(`บันทึกข้อสอบ "${uploadedData.title}" เรียบร้อยแล้ว`)
      }
    }
  }

  const handleUseSelectedQuiz = () => {
    if (selectedQuizId) {
      useSelectedQuiz(selectedQuizId)
    }
  }

  useEffect(() => {
    if (selectedQuizId) {
      window.location.reload()
    }
  }, [selectedQuizId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">อัปโหลดข้อสอบ</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            setShowExample(!showExample)
          }}
          className="h-8 w-8"
          title="Toggle example format"
        >
          <HelpCircle className="h-5 w-5 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />

          <div className="flex flex-col items-center space-y-4">
            {success ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-green-600 font-medium">อัปโหลดข้อสอบสำเร็จ!</p>
                {file && <p className="text-sm text-gray-600">{file.name}</p>}
                {uploadedData && (
                  <div className="text-sm text-gray-700">
                    <p>ชื่อข้อสอบ: {uploadedData.title}</p>
                    <p>จำนวนข้อ: {uploadedData.questions.length}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveQuiz()
                  }}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> บันทึกข้อสอบนี้
                </Button>
              </>
            ) : error ? (
              <>
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="text-red-600">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setError(null)
                  }}
                >
                  ลองใหม่
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-gray-600">ลากและวางไฟล์ข้อสอบ JSON ที่นี่</p>
                  <p className="text-sm text-gray-500 mt-1">หรือคลิกเพื่อเลือกไฟล์</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FileJson className="h-4 w-4" />
                  <span>เฉพาะไฟล์ JSON เท่านั้น</span>
                </div>
              </>
            )}
          </div>
        </div>

        {quizFiles.length > 0 && (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-700">ข้อสอบที่บันทึกไว้</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedQuizId || ""} onValueChange={setSelectedQuizId}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกข้อสอบ" />
                </SelectTrigger>
                <SelectContent>
                  {quizFiles.map((quizFile) => (
                    <SelectItem key={quizFile.id} value={quizFile.id}>
                      {quizFile.name} ({quizFile.data.questions.length} ข้อ)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleUseSelectedQuiz}
                disabled={!selectedQuizId}
                className="bg-green-600 hover:bg-green-700"
              >
                ใช้ข้อสอบที่เลือก
              </Button>
            </div>
          </div>
        )}

        {showExample && (
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">รูปแบบ JSON ตัวอย่าง:</p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {`{
  "title": "ชื่อข้อสอบ",
  "totalQuestions": 5,
  "createdDate": "2025-01-01",
  "questions": [
    {
      "id": 1,
      "category": "หมวดหมู่",
      "question": "คำถาม?",
      "options": {
        "1": "ตัวเลือก A",
        "2": "ตัวเลือก B",
        "3": "ตัวเลือก C",
        "4": "ตัวเลือก D"
      },
      "answer": "1",
      "explanation": "คำอธิบาย"
    }
  ]
}`}
            </pre>
            <p className="mt-2 text-xs text-gray-500">
              หมายเหตุ: ไฟล์ต้องเป็น JSON ที่ถูกต้อง โดยมีฟิลด์ title และ questions เป็นอย่างน้อย
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
