import type { Quiz } from "@/types/quiz"

export const quizData: Quiz = {
  title: "ความรู้ทั่วไปเกี่ยวกับประเทศไทย",
  description: "ทดสอบความรู้ของคุณเกี่ยวกับประเทศไทย",
  questions: [
    {
      question: "เมืองหลวงของประเทศไทยคือเมืองอะไร?",
      options: ["กรุงเทพมหานคร", "เชียงใหม่", "ภูเก็ต", "พัทยา"],
      correctOptionIndex: 0,
    },
    {
      question: "ธงชาติไทยมีกี่สี?",
      options: ["2 สี", "3 สี", "4 สี", "5 สี"],
      correctOptionIndex: 1,
    },
    {
      question: "แม่น้ำสายหลักที่ไหลผ่านกรุงเทพมหานครคือแม่น้ำอะไร?",
      options: ["แม่น้ำปิง", "แม่น้ำน่าน", "แม่น้ำเจ้าพระยา", "แม่น้ำท่าจีน"],
      correctOptionIndex: 2,
    },
    {
      question: "อาหารประจำชาติไทยคืออะไร?",
      options: ["ต้มยำกุ้ง", "ผัดไทย", "แกงเขียวหวาน", "ส้มตำ"],
      correctOptionIndex: 1,
    },
    {
      question: "ประเทศไทยมีกี่จังหวัด?",
      options: ["76 จังหวัด", "77 จังหวัด", "78 จังหวัด", "79 จังหวัด"],
      correctOptionIndex: 1,
    },
  ],
}
