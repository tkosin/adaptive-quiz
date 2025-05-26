export interface QuizQuestion {
  question: string
  options: string[]
  correctOptionIndex: number
}

export interface Quiz {
  title: string
  description: string
  questions: QuizQuestion[]
}
