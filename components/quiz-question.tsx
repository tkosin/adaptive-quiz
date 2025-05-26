"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { InfoIcon, CheckCircle, XCircle, HelpCircle, BookOpen, Award, AlertTriangle } from "lucide-react"
import type { ExamQuestion } from "@/types/exam"
import { motion } from "framer-motion"

interface QuizQuestionProps {
  question: ExamQuestion
  userAnswer?: string
  onAnswerSelect: (questionId: number, answerId: string) => void
  showAnswer: boolean
}

export default function QuizQuestion({ question, userAnswer, onAnswerSelect, showAnswer }: QuizQuestionProps) {
  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "ง่าย":
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "ปานกลาง":
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "ยาก":
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "ง่าย":
      case "easy":
        return <Award className="h-3.5 w-3.5 mr-1" />
      case "ปานกลาง":
      case "medium":
        return <BookOpen className="h-3.5 w-3.5 mr-1" />
      case "ยาก":
      case "hard":
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      default:
        return <HelpCircle className="h-3.5 w-3.5 mr-1" />
    }
  }

  // Ensure options is an object with string keys
  const normalizeOptions = () => {
    if (!question.options) return {}

    // If options is already in the correct format, return it
    if (typeof question.options === "object" && !Array.isArray(question.options)) {
      return question.options
    }

    // If options is an array, convert to object with numeric keys
    if (Array.isArray(question.options)) {
      return question.options.reduce(
        (acc, option, index) => {
          acc[String(index + 1)] = option
          return acc
        },
        {} as Record<string, string>,
      )
    }

    // Fallback
    return {}
  }

  const options = normalizeOptions()

  return (
    <Card className="shadow-sm border-gray-200 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight">
              {question.id}. {question.question}
            </h3>
            {question.category && <p className="text-sm text-gray-500">หมวด: {question.category}</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-0">
        <RadioGroup
          value={userAnswer || ""}
          onValueChange={(value) => onAnswerSelect(question.id, value)}
          className="space-y-3"
        >
          {Object.entries(options).map(([id, text]) => {
            const isSelected = userAnswer === id
            const isCorrectAnswer = question.answer === id

            let className = "border border-gray-200 rounded-lg p-4 transition-all"

            if (showAnswer && isCorrectAnswer) {
              className += " bg-green-50 border-green-300"
            } else if (showAnswer && isSelected && !isCorrectAnswer) {
              className += " bg-red-50 border-red-300"
            } else if (isSelected) {
              className += " bg-blue-50 border-blue-300 shadow-sm"
            } else {
              className += " hover:bg-gray-50 hover:border-gray-300"
            }

            return (
              <motion.div
                key={id}
                className={className}
                whileHover={{ scale: isSelected ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value={id} id={`q${question.id}-${id}`} />
                  <Label htmlFor={`q${question.id}-${id}`} className="font-normal cursor-pointer w-full text-gray-700">
                    {id}. {typeof text === "string" ? text : JSON.stringify(text)}
                  </Label>

                  {showAnswer && isCorrectAnswer && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
                  {showAnswer && isSelected && !isCorrectAnswer && (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </RadioGroup>

        {showAnswer && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
          >
            <h4 className="font-semibold flex items-center gap-1 mb-2 text-blue-800">
              <InfoIcon className="h-4 w-4" /> คำอธิบาย
            </h4>
            <p className="text-gray-700">{question.explanation}</p>
          </motion.div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-6">
        {question.difficultyLevel && (
          <Badge variant="outline" className={`flex items-center ${getDifficultyColor(question.difficultyLevel)}`}>
            {getDifficultyIcon(question.difficultyLevel)}
            ระดับความยาก: {question.difficultyLevel}
          </Badge>
        )}
        {question.knowledgeLevel && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            ระดับความรู้: {question.knowledgeLevel}
          </Badge>
        )}
        {question.testingObjective && (
          <div className="w-full mt-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">วัตถุประสงค์การทดสอบ:</span> {question.testingObjective}
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
