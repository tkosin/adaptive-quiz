"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Trophy, RotateCcw, Award, CheckCircle2 } from "lucide-react"
import { useExamData } from "@/hooks/use-exam-data"
import QuizQuestion from "./quiz-question"
import type { QuizState } from "@/types/exam"
import { useSwipeable } from "react-swipeable"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

export function QuizContainer() {
  const { data: examData } = useExamData()
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    showAnswers: false,
    quizCompleted: false,
    score: { correct: 0, total: 0, percentage: 0 },
  })
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset quiz state when exam data changes
  useEffect(() => {
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: {},
      showAnswers: false,
      quizCompleted: false,
      score: { correct: 0, total: 0, percentage: 0 },
    })
  }, [examData])

  const questions = examData?.questions || []
  const totalQuestions = questions.length
  const currentQuestion = questions[quizState.currentQuestionIndex]
  const isCurrentQuestionAnswered = currentQuestion ? quizState.userAnswers[currentQuestion.id] !== undefined : false

  // Find the highest answered question index
  const highestAnsweredIndex = useCallback(() => {
    if (!questions.length) return 0

    for (let i = questions.length - 1; i >= 0; i--) {
      if (quizState.userAnswers[questions[i].id] !== undefined) {
        return i + 1 < questions.length ? i + 1 : i
      }
    }
    return 0
  }, [questions, quizState.userAnswers])

  const calculateScore = useCallback(() => {
    let correctCount = 0
    Object.entries(quizState.userAnswers).forEach(([questionId, answerId]) => {
      const question = questions.find((q) => q.id === Number(questionId))
      if (question && question.answer === answerId) {
        correctCount++
      }
    })
    return {
      correct: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
    }
  }, [quizState.userAnswers, questions, totalQuestions])

  useEffect(() => {
    if (totalQuestions > 0) {
      const answeredCount = Object.keys(quizState.userAnswers).length
      if (answeredCount === totalQuestions && !quizState.quizCompleted) {
        const score = calculateScore()
        setQuizState((prev) => ({ ...prev, score, quizCompleted: true }))
      }
    }
  }, [quizState.userAnswers, totalQuestions, quizState.quizCompleted, calculateScore])

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setQuizState((prev) => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [questionId]: answerId },
    }))

    // Auto-advance to next question after a short delay
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setDirection(1) // Set direction to right (next)
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }))
      }, 500)
    }
  }

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setDirection(-1) // Set direction to left (previous)
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
    }
  }

  const handleNext = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      // Only allow going to next if current question is answered
      if (isCurrentQuestionAnswered) {
        setDirection(1) // Set direction to right (next)
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }))
      } else {
        alert("กรุณาเลือกคำตอบก่อนไปข้อถัดไป")
      }
    } else {
      const answeredCount = Object.keys(quizState.userAnswers).length
      if (answeredCount === totalQuestions) {
        const score = calculateScore()
        setQuizState((prev) => ({
          ...prev,
          score,
          quizCompleted: true,
          currentQuestionIndex: 0,
        }))
      } else {
        alert(`กรุณาตอบคำถามให้ครบทุกข้อ (ตอบแล้ว ${answeredCount} จาก ${totalQuestions} ข้อ)`)
      }
    }
  }

  const handleSwipeToQuestion = (index: number) => {
    // Determine direction for animation
    const newDirection = index > quizState.currentQuestionIndex ? 1 : -1
    setDirection(newDirection)

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }))
  }

  const handleJumpToUnanswered = () => {
    const nextUnansweredIndex = highestAnsweredIndex()
    if (nextUnansweredIndex !== quizState.currentQuestionIndex) {
      handleSwipeToQuestion(nextUnansweredIndex)
    }
  }

  const toggleShowAnswers = () => {
    setQuizState((prev) => ({ ...prev, showAnswers: !prev.showAnswers }))
  }

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: {},
      showAnswers: false,
      quizCompleted: false,
      score: { correct: 0, total: 0, percentage: 0 },
    })
  }

  // Setup swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // Swipe left means go to next question (if answered)
      if (isCurrentQuestionAnswered && quizState.currentQuestionIndex < questions.length - 1) {
        handleNext()
      } else if (quizState.quizCompleted) {
        // If quiz is completed, allow free navigation
        if (quizState.currentQuestionIndex < questions.length - 1) {
          handleNext()
        }
      }
    },
    onSwipedRight: () => {
      // Swipe right means go to previous question
      if (quizState.currentQuestionIndex > 0) {
        handlePrevious()
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  })

  if (!examData || questions.length === 0) {
    return null
  }

  // Get score color based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-blue-600"
    return "text-orange-600"
  }

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          คำถามข้อสอบ
        </h2>
        <div className="flex items-center space-x-2">
          {quizState.quizCompleted && (
            <Button variant="outline" size="sm" onClick={resetQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" /> เริ่มใหม่
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={toggleShowAnswers} disabled={!quizState.quizCompleted}>
            {quizState.showAnswers ? "ซ่อนเฉลย" : "แสดงเฉลย"}
          </Button>
        </div>
      </div>

      {quizState.quizCompleted && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-green-200 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" /> ผลคะแนนของคุณ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-green-700 flex items-center justify-center md:justify-start gap-2">
                  <Award className="h-7 w-7 text-yellow-500" />
                  {quizState.score.correct} / {quizState.score.total}
                </p>
                <p className="text-sm text-gray-600">
                  คุณตอบถูก {quizState.score.correct} ข้อ จากทั้งหมด {quizState.score.total} ข้อ
                </p>
              </div>

              <div className="w-full md:w-1/2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">คะแนน {quizState.score.percentage}%</span>
                </div>
                <Progress value={quizState.score.percentage} className="h-2.5" />

                <div className="mt-2 text-sm">
                  {quizState.score.percentage >= 80 ? (
                    <p className="text-green-600">ยอดเยี่ยม! คุณทำได้ดีมาก</p>
                  ) : quizState.score.percentage >= 60 ? (
                    <p className="text-blue-600">ดี! แต่ยังมีที่ให้ปรับปรุง</p>
                  ) : (
                    <p className="text-orange-600">ลองใหม่อีกครั้ง คุณสามารถทำได้ดีกว่านี้</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-gray-100 p-3 rounded-lg text-center">
        <p className="text-sm md:text-base">
          คำถามที่ <span className="font-bold">{quizState.currentQuestionIndex + 1}</span> จากทั้งหมด{" "}
          <span className="font-bold">{questions.length}</span> ข้อ
        </p>
        <p className="text-sm text-gray-500 mt-1">
          ตอบแล้ว {Object.keys(quizState.userAnswers).length} จาก {totalQuestions} ข้อ
        </p>

        {/* Question navigation dots */}
        <div className="flex justify-center mt-3 flex-wrap gap-1 max-w-full overflow-x-auto py-1">
          {questions.map((_, index) => {
            const isAnswered = questions[index] && quizState.userAnswers[questions[index].id] !== undefined
            const isCurrent = index === quizState.currentQuestionIndex

            return (
              <button
                key={index}
                onClick={() => handleSwipeToQuestion(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isCurrent
                    ? "bg-blue-600 ring-2 ring-blue-300 transform scale-125"
                    : isAnswered
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            )
          })}
        </div>

        {/* Jump to next unanswered button */}
        {!quizState.quizCompleted &&
          Object.keys(quizState.userAnswers).length > 0 &&
          Object.keys(quizState.userAnswers).length < totalQuestions && (
            <button onClick={handleJumpToUnanswered} className="mt-2 text-xs text-blue-600 hover:underline">
              ไปยังข้อถัดไปที่ยังไม่ได้ตอบ
            </button>
          )}
      </div>

      {/* Question container with animations */}
      <div {...(isMobile ? swipeHandlers : {})} className="touch-pan-y">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={quizState.currentQuestionIndex}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.3 }}
          >
            {currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                userAnswer={quizState.userAnswers[currentQuestion.id]}
                onAnswerSelect={handleAnswerSelect}
                showAnswer={quizState.showAnswers}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={quizState.currentQuestionIndex === 0}
          className="shadow-sm hover:shadow transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> ข้อก่อนหน้า
        </Button>

        <Button
          variant={isCurrentQuestionAnswered ? "default" : "outline"}
          onClick={handleNext}
          disabled={!isCurrentQuestionAnswered && !quizState.quizCompleted}
          className={`shadow-sm hover:shadow transition-all ${
            isCurrentQuestionAnswered && !quizState.quizCompleted ? "bg-green-600 hover:bg-green-700" : ""
          }`}
        >
          {quizState.currentQuestionIndex === questions.length - 1 && !quizState.quizCompleted ? "ส่งคำตอบ" : "ข้อถัดไป"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
