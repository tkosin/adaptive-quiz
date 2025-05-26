"use client"

import { useState } from "react"
import { ExamOverview } from "@/components/exam-overview"
import { ExamDetails } from "@/components/exam-details"
import { QuizContainer } from "@/components/quiz-container"
import { QuizUploader } from "@/components/quiz-uploader"
import { useExamData } from "@/hooks/use-exam-data"
import { Loader2, RotateCcw, FileCheck, X, Bug, Upload } from "lucide-react"
import { QuizStatusIndicator } from "@/components/quiz-status-indicator"
import { Button } from "@/components/ui/button"
import { useQuizFiles } from "@/hooks/use-quiz-files"
import { SampleQuizLoader } from "@/components/sample-quiz-loader"

export default function Home() {
  const { data: examData, isLoading, error, refetch, clearCustomData } = useExamData()
  const { quizFiles } = useQuizFiles()
  const [showUploader, setShowUploader] = useState(false)

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Personalized Adaptive Online Quiz</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    )
  }

  if (error || !examData) {
    return (
      <main className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Personalized Adaptive Online Quiz</h1>
        <div className="text-center">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
            <p className="font-bold">ไม่สามารถโหลดข้อมูลข้อสอบได้</p>
            <p className="mb-2">{error?.message || "ไม่พบข้อมูลข้อสอบ กรุณาอัปโหลดไฟล์ข้อสอบ"}</p>
            <p className="text-sm text-gray-700">
              หมายเหตุ: ตรวจสอบให้แน่ใจว่าไฟล์ JSON อยู่ในโฟลเดอร์ public/data หรืออัปโหลดไฟล์ข้อสอบใหม่
            </p>
          </div>
          <QuizUploader
            onUploadSuccess={() => {
              refetch()
              setShowUploader(false)
            }}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Personalized Adaptive Online Quiz</h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={() => setShowUploader(!showUploader)} variant="outline" className="flex items-center gap-2">
            {showUploader ? (
              <>
                <X className="h-4 w-4" /> ซ่อนตัวอัปโหลด
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> อัปโหลดข้อสอบใหม่
              </>
            )}
          </Button>

          {localStorage.getItem("uploadedQuizData") && !localStorage.getItem("customExamData") && (
            <Button
              onClick={async () => {
                try {
                  const uploadedData = localStorage.getItem("uploadedQuizData")
                  if (uploadedData) {
                    localStorage.setItem("customExamData", uploadedData)
                    window.location.reload()
                  }
                } catch (error) {
                  console.error("Error loading uploaded quiz:", error)
                  alert("เกิดข้อผิดพลาดในการโหลดข้อสอบที่อัปโหลด")
                }
              }}
              variant="default"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <FileCheck className="h-4 w-4" /> ใช้ข้อสอบที่อัปโหลด
            </Button>
          )}

          {examData && localStorage.getItem("customExamData") && (
            <Button
              onClick={() => {
                if (confirm("คุณต้องการกลับไปใช้ข้อสอบเริ่มต้นหรือไม่?")) {
                  clearCustomData()
                  window.location.reload()
                }
              }}
              variant="outline"
              className="flex items-center gap-2 border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              <RotateCcw className="h-4 w-4" /> ใช้ข้อสอบเริ่มต้น
            </Button>
          )}

          {process.env.NODE_ENV === "development" && (
            <Button
              onClick={() => {
                const data = localStorage.getItem("customExamData")
                if (data) {
                  console.log("Custom exam data:", JSON.parse(data))
                } else {
                  console.log("No custom exam data found")
                }
                console.log("Quiz files:", quizFiles)
              }}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" /> Debug
            </Button>
          )}
        </div>
      </div>

      {showUploader && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuizUploader
            onUploadSuccess={() => {
              setShowUploader(false)
            }}
          />
          <SampleQuizLoader />
        </div>
      )}

      <QuizStatusIndicator isCustomQuiz={!!localStorage.getItem("customExamData")} title={examData?.title} />

      <ExamOverview />
      <ExamDetails />
      <QuizContainer />
    </main>
  )
}
