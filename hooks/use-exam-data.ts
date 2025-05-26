"use client"

import { useState, useEffect, useCallback } from "react"
import type { ExamData } from "@/types/exam"

export function useExamData() {
  const [data, setData] = useState<ExamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check for custom uploaded data first
      const customData = localStorage.getItem("customExamData")
      if (customData) {
        try {
          const parsedData = JSON.parse(customData)
          console.log("Using custom exam data from localStorage")
          setData(parsedData)
          setIsLoading(false)
          return
        } catch (parseError) {
          console.error("Error parsing custom data:", parseError)
          localStorage.removeItem("customExamData")
          // Continue to fetch default data if custom data is invalid
        }
      }

      // Only fetch default data if no custom data exists
      console.log("No custom data found, fetching default exam data")
      try {
        // Try to fetch from public/data/exam-data.json
        const response = await fetch("/data/exam-data.json")

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Failed to fetch exam data: ${response.status} ${response.statusText}`)
        }

        // Check content type to ensure it's JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON but got ${contentType}`)
        }

        const jsonData = await response.json()
        setData(jsonData)
      } catch (fetchError) {
        console.error("Error fetching default data:", fetchError)

        // Fallback to sample quiz data
        try {
          console.log("Trying to fetch sample quiz data")
          const sampleResponse = await fetch("/data/sample-quiz.json")

          if (!sampleResponse.ok) {
            throw new Error(`Failed to fetch sample data: ${sampleResponse.status}`)
          }

          const sampleData = await sampleResponse.json()
          setData(sampleData)
        } catch (sampleError) {
          console.error("Error fetching sample data:", sampleError)

          // Create minimal default data if all fetches fail
          console.log("Creating minimal default quiz data")
          setData({
            title: "Default Quiz",
            totalQuestions: 1,
            createdDate: new Date().toISOString().split("T")[0],
            questions: [
              {
                id: 1,
                category: "General",
                question: "Please upload a quiz file to begin",
                options: {
                  "1": "Option A",
                  "2": "Option B",
                  "3": "Option C",
                  "4": "Option D",
                },
                answer: "1",
                explanation: "This is a placeholder question. Please upload a quiz file.",
              },
            ],
          })
        }
      }
    } catch (err) {
      console.error("Error in fetchData:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const clearCustomData = useCallback(() => {
    localStorage.removeItem("customExamData")
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    clearCustomData,
  }
}
