"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

interface ResultScreenProps {
  score: number
  totalQuestions: number
  onRestart: () => void
}

export default function ResultScreen({ score, totalQuestions, onRestart }: ResultScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">ผลคะแนนของคุณ</h2>

      <div className="text-5xl font-bold mb-4 text-green-600">
        {score} / {totalQuestions}
      </div>

      <div className="mb-8 text-xl text-gray-600">คุณได้คะแนน {percentage}%</div>

      <div className="mb-8">
        {percentage >= 80 ? (
          <div className="text-green-600 font-medium">ยอดเยี่ยม! คุณทำได้ดีมาก</div>
        ) : percentage >= 60 ? (
          <div className="text-blue-600 font-medium">ดี! แต่ยังมีที่ให้ปรับปรุง</div>
        ) : (
          <div className="text-orange-600 font-medium">ลองใหม่อีกครั้ง คุณสามารถทำได้ดีกว่านี้</div>
        )}
      </div>

      <Button onClick={onRestart} className="px-8 py-2">
        เริ่มทำควิซใหม่
      </Button>
    </div>
  )
}
