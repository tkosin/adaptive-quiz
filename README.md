# Personalized Adaptive Learning Quiz Application

A modern, responsive quiz application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📝 **Dynamic Quiz System**: Load and display quiz questions from JSON files
- 📤 **Quiz Upload**: Upload custom quiz JSON files via drag-and-drop interface
- 📊 **Progress Tracking**: Real-time progress indicators and score calculation
- 🎯 **Adaptive Learning**: Questions with difficulty levels and categories
- 💾 **Local Storage**: Save uploaded quizzes for future use
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean interface with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd personalized-adaptive-learning
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main quiz page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # Reusable UI components
│   ├── exam-overview.tsx
│   ├── exam-details.tsx
│   ├── quiz-container.tsx
│   ├── quiz-question.tsx
│   └── quiz-uploader.tsx
├── hooks/
│   ├── use-exam-data.ts
│   └── use-quiz-storage.ts
├── lib/
│   └── utils.ts        # Utility functions
├── public/
│   └── data/
│       ├── exam-data.json    # Default quiz data
│       └── sample-quiz.json  # Sample quiz template
└── types/
    └── exam.ts         # TypeScript type definitions
\`\`\`

## Quiz JSON Format

To create a custom quiz, follow this JSON structure:

\`\`\`json
{
  "title": "Your Quiz Title",
  "totalQuestions": 5,
  "createdDate": "2025-01-26",
  "questions": [
    {
      "id": 1,
      "category": "Category Name",
      "question": "Your question text?",
      "options": {
        "1": "Option A",
        "2": "Option B", 
        "3": "Option C",
        "4": "Option D"
      },
      "answer": "1",
      "explanation": "Explanation for the correct answer",
      "difficultyLevel": "Easy|Medium|Hard",
      "knowledgeLevel": "Basic|Intermediate|Advanced",
      "testingObjective": "What this question tests"
    }
  ]
}
\`\`\`

## Key Features Explained

### Quiz Upload
- Drag and drop JSON files or click to browse
- Automatic validation of quiz format
- Stores quizzes in browser's local storage

### Quiz Navigation
- Previous/Next buttons for easy navigation
- Question counter showing progress
- Submit button appears on the last question

### Score Display
- Automatic score calculation upon completion
- Visual progress bar
- Performance feedback based on score percentage

### Answer Review
- Show/hide answers after quiz completion
- Detailed explanations for each question
- Color-coded correct/incorrect answers

## Development

### Adding New Features

1. **New Question Types**: Extend the `ExamQuestion` interface in `types/exam.ts`
2. **Custom Themes**: Modify the Tailwind configuration in `tailwind.config.ts`
3. **Additional Storage**: Implement new storage methods in `hooks/use-quiz-storage.ts`

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
