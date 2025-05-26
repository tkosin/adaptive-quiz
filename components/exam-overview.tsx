"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { useExamData } from "@/hooks/use-exam-data"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Calendar, ListChecks } from "lucide-react"
import { motion } from "framer-motion"

export function ExamOverview() {
  const { data: examData, isLoading } = useExamData()

  if (isLoading) {
    return <ExamOverviewSkeleton />
  }

  if (!examData) return null

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="mb-8 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardTitle className="text-xl md:text-2xl text-center">{examData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <motion.div
              className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow transition-shadow"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-700">จำนวนข้อสอบ</h3>
              <p className="text-2xl font-bold text-gray-900">{examData.totalQuestions} ข้อ</p>
            </motion.div>
            <motion.div
              className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow transition-shadow"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-center mb-2">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-700">วันที่สร้าง</h3>
              <p className="text-lg font-semibold text-gray-900">
                {examData.createdDate ? formatDate(examData.createdDate) : "ไม่ระบุ"}
              </p>
            </motion.div>
            <motion.div
              className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow transition-shadow"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-center mb-2">
                <ListChecks className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-700">ประเภทข้อสอบ</h3>
              <p className="text-lg font-semibold text-gray-900">ปรนัย 4 ตัวเลือก</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ExamOverviewSkeleton() {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-6 w-6 mx-auto mb-2" />
              <Skeleton className="h-5 w-1/2 mx-auto mb-2" />
              <Skeleton className="h-8 w-1/3 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
