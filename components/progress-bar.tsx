interface ProgressBarProps {
  currentQuestion: number
  totalQuestions: number
}

export default function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="bg-gray-100 p-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          คำถามที่ {currentQuestion} จาก {totalQuestions}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
