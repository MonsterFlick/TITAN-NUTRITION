"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { useState, useRef, useCallback } from "react"

interface NutritionModalProps {
  product: {
    id: string
    title: string
    nutritionLabel: string
  }
  isOpen: boolean
  onClose: () => void
}

export function NutritionModal({ product, isOpen, onClose }: NutritionModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [lastDistance, setLastDistance] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      )
      setLastDistance(distance)
    } else if (e.touches.length === 1) {
      setIsDragging(true)
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()

      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
        )

        if (lastDistance > 0) {
          const scaleChange = distance / lastDistance
          const newScale = Math.min(Math.max(scale * scaleChange, 1), 4)
          setScale(newScale)
        }
        setLastDistance(distance)
      } else if (e.touches.length === 1 && isDragging && scale > 1) {
        const deltaX = e.touches[0].clientX - lastPanPoint.x
        const deltaY = e.touches[0].clientY - lastPanPoint.y

        setPosition((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }))

        setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
    },
    [lastDistance, scale, isDragging, lastPanPoint],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setLastDistance(0)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.min(Math.max(scale * scaleChange, 1), 4)
      setScale(newScale)

      if (newScale === 1) {
        setPosition({ x: 0, y: 0 })
      }
    },
    [scale],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 1) {
        setIsDragging(true)
        setLastPanPoint({ x: e.clientX, y: e.clientY })
      }
    },
    [scale],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        const deltaX = e.clientX - lastPanPoint.x
        const deltaY = e.clientY - lastPanPoint.y

        setPosition((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }))

        setLastPanPoint({ x: e.clientX, y: e.clientY })
      }
    },
    [isDragging, scale, lastPanPoint],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-[family-name:var(--font-space-grotesk)]">
            {product.title} - Nutrition Facts
          </CardTitle>
          <div className="flex items-center gap-2">
            {scale > 1 && (
              <Button variant="outline" size="sm" onClick={resetZoom}>
                Reset Zoom
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className="relative h-[70vh] bg-gray-50 flex items-center justify-center overflow-hidden"
            style={{ touchAction: "none" }}
          >
            <img
              ref={imageRef}
              src={product.nutritionLabel || "/placeholder.svg?height=600&width=400&query=nutrition facts label"}
              alt={`${product.title} Nutrition Facts`}
              className="max-h-full max-w-full object-contain select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
            />
          </div>
          <div className="p-4 bg-gray-50 text-sm text-gray-600 text-center">
            Pinch to zoom on mobile • Scroll to zoom on desktop • Drag to pan when zoomed
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
