"use client"

import type { QuizQuestion } from "@/types/quiz"
import { CheckCircle } from "lucide-react"

interface QuestionCardProps {
  question: QuizQuestion
  onSelectOption: (index: number) => void
  selectedOption?: number
}

export default function QuestionCard({ question, onSelectOption, selectedOption }: QuestionCardProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            disabled={selectedOption !== undefined}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${
              selectedOption === index
                ? index === question.correctOptionIndex
                  ? "bg-green-100 border-green-500"
                  : "bg-red-100 border-red-500"
                : selectedOption !== undefined && index === question.correctOptionIndex
                  ? "bg-green-100 border-green-500"
                  : "hover:bg-gray-100 border-gray-200"
            }`}
          >
            <span className="text-md md:text-lg">{option}</span>
            {selectedOption !== undefined && index === question.correctOptionIndex && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
