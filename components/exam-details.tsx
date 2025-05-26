"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExamData } from "@/hooks/use-exam-data"
import { Skeleton } from "@/components/ui/skeleton"

export function ExamDetails() {
  const { data: examData, isLoading } = useExamData()

  if (isLoading) {
    return <ExamDetailsSkeleton />
  }

  if (!examData) return null

  // Check if we have any details to show
  const hasDetails = examData.examPrinciples || examData.examObjectives || examData.examStructure

  if (!hasDetails) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg text-center">รายละเอียดข้อสอบ</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="principles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {examData.examPrinciples && <TabsTrigger value="principles">หลักการข้อสอบ</TabsTrigger>}
            {examData.examObjectives && <TabsTrigger value="objectives">วัตถุประสงค์</TabsTrigger>}
            {examData.examStructure && <TabsTrigger value="structure">โครงสร้างข้อสอบ</TabsTrigger>}
          </TabsList>

          {examData.examPrinciples && (
            <TabsContent value="principles" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-700">{examData.examPrinciples.description}</p>
                <ul className="list-disc pl-5 space-y-2">
                  {examData.examPrinciples.principles?.map((principle: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          )}

          {examData.examObjectives && (
            <TabsContent value="objectives" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-700">{examData.examObjectives.description}</p>
                <ul className="list-disc pl-5 space-y-2">
                  {examData.examObjectives.objectives?.map((objective: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          )}

          {examData.examStructure && (
            <TabsContent value="structure" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-700">{examData.examStructure.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">หมวดความรู้</th>
                        <th className="border p-2 text-center">สัดส่วน (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examData.examStructure.categories?.map((category: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="border p-2">{category.name}</td>
                          <td className="border p-2 text-center">{category.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ExamDetailsSkeleton() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mx-auto" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
  )
}
