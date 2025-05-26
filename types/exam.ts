export interface ExamQuestion {
  id: number
  category: string
  question: string
  options: Record<string, string>
  answer: string
  explanation: string
  difficultyLevel?: string
  knowledgeLevel?: string
  testingObjective?: string
}

export interface ExamPrinciples {
  description: string
  principles: string[]
}

export interface ExamObjectives {
  description: string
  objectives: string[]
}

export interface ExamCategory {
  name: string
  percentage: number
}

export interface ExamStructure {
  description: string
  categories: ExamCategory[]
}

export interface ExamData {
  title: string
  totalQuestions: number
  createdDate: string
  examPrinciples?: ExamPrinciples
  examObjectives?: ExamObjectives
  examStructure?: ExamStructure
  questions: ExamQuestion[]
}

export interface QuizState {
  currentQuestionIndex: number
  userAnswers: Record<number, string>
  showAnswers: boolean
  quizCompleted: boolean
  score: {
    correct: number
    total: number
    percentage: number
  }
}
