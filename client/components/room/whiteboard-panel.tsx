"use client"

import { useState } from "react"
import { Pen, Eraser, RotateCcw, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function WhiteboardPanel() {
  const [selectedTool, setSelectedTool] = useState<"pen" | "eraser">("pen")
  const [strokeSize, setStrokeSize] = useState([3])
  const [selectedColor, setSelectedColor] = useState("#3b82f6")

  const colors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // yellow
    "#8b5cf6", // purple
    "#000000", // black
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Whiteboard</h3>

        {/* Tools */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={selectedTool === "pen" ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedTool("pen")}
              className="rounded-xl"
            >
              <Pen className="h-4 w-4 mr-2" />
              Pen
            </Button>
            <Button
              variant={selectedTool === "eraser" ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedTool("eraser")}
              className="rounded-xl"
            >
              <Eraser className="h-4 w-4 mr-2" />
              Eraser
            </Button>
          </div>

          {/* Color Picker */}
          <div>
            <p className="text-sm text-gray-300 mb-2">Color</p>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-white" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Size */}
          <div>
            <p className="text-sm text-gray-300 mb-2">Stroke Size: {strokeSize[0]}px</p>
            <Slider value={strokeSize} onValueChange={setStrokeSize} max={20} min={1} step={1} className="w-full" />
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Preview */}
      <div className="flex-1 p-4">
        <Card className="h-full bg-white rounded-2xl flex items-center justify-center">
          <p className="text-gray-500">Whiteboard Canvas</p>
        </Card>
      </div>

      <div className="p-4 border-t border-gray-700">
        <Button variant="outline" className="w-full rounded-xl bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Whiteboard
        </Button>
      </div>
    </div>
  )
}
