"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface VerificationInputProps {
  length?: number
  onComplete?: (code: string) => void
}

export function VerificationInput({ length = 6, onComplete }: VerificationInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Only take the last character

    setCode(newCode)

    // Move to next input if current one is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

    // Check if code is complete
    const completeCode = newCode.join("")
    if (completeCode.length === length && onComplete) {
      onComplete(completeCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only proceed if pasted content is all digits and not longer than our inputs
    if (!/^\d+$/.test(pastedData) || pastedData.length > length) return

    const newCode = [...code]

    // Fill the inputs with pasted data
    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newCode[i] = pastedData[i]
    }

    setCode(newCode)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((c) => !c)
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex

    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus()
    }

    // Check if code is complete
    const completeCode = newCode.join("")
    if (completeCode.length === length && onComplete) {
      onComplete(completeCode)
    }
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-lg font-medium"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
