"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface QuizStatusIndicatorProps {
  isCustomQuiz: boolean
  title?: string
}

export function QuizStatusIndicator({ isCustomQuiz, title }: QuizStatusIndicatorProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={`mb-4 p-4 ${isCustomQuiz ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"} shadow-sm`}
      >
        <div className="flex items-center gap-3">
          {isCustomQuiz ? (
            <div className="bg-blue-100 p-2 rounded-full">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
          ) : (
            <div className="bg-green-100 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-gray-900">{title || "ข้อสอบ"}</p>
              <Badge
                variant="outline"
                className={
                  isCustomQuiz
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }
              >
                {isCustomQuiz ? "ข้อสอบที่อัปโหลด" : "ข้อสอบเริ่มต้น"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {isCustomQuiz ? "คุณกำลังใช้ข้อสอบที่อัปโหลดเข้าระบบ" : "คุณกำลังใช้ข้อสอบเริ่มต้นของระบบ"}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
