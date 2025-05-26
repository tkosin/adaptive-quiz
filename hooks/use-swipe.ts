"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

interface UseSwipeOptions {
  threshold?: number
  preventDefaultTouchmoveEvent?: boolean
}

export function useSwipe(
  element: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  options: UseSwipeOptions = {},
) {
  const { threshold = 50, preventDefaultTouchmoveEvent = false } = options
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const el = element.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)

      if (isHorizontalSwipe) {
        if (deltaX > threshold && handlers.onSwipeRight) {
          handlers.onSwipeRight()
        } else if (deltaX < -threshold && handlers.onSwipeLeft) {
          handlers.onSwipeLeft()
        }
      } else {
        if (deltaY > threshold && handlers.onSwipeDown) {
          handlers.onSwipeDown()
        } else if (deltaY < -threshold && handlers.onSwipeUp) {
          handlers.onSwipeUp()
        }
      }

      setTouchStart(null)
    }

    el.addEventListener("touchstart", handleTouchStart)
    el.addEventListener("touchmove", handleTouchMove, { passive: !preventDefaultTouchmoveEvent })
    el.addEventListener("touchend", handleTouchEnd)

    return () => {
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
      el.removeEventListener("touchend", handleTouchEnd)
    }
  }, [element, handlers, threshold, touchStart, preventDefaultTouchmoveEvent])
}
