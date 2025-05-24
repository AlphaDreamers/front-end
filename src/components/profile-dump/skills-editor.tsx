"use client"

import { useState } from "react"
import { Plus, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { skillOptions } from "@/lib/mock-data"
import type { Skill } from "@/lib/mock-data"

interface SkillsEditorProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newLevel, setNewLevel] = useState("3")
  const [error, setError] = useState("")

  const handleAddSkill = () => {
    if (!newSkill) {
      setError("Please select a skill")
      return
    }

    // Check if skill already exists
    if (skills.some((skill) => skill.name.toLowerCase() === newSkill.toLowerCase())) {
      setError("This skill is already in your profile")
      return
    }

    const updatedSkills = [
      ...skills,
      {
        id: `skill-${Date.now()}`,
        name: newSkill,
        level: Number.parseInt(newLevel),
      },
    ]

    onChange(updatedSkills)
    setNewSkill("")
    setNewLevel("3")
    setError("")
  }

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== id)
    onChange(updatedSkills)
  }

  const handleLevelChange = (id: string, level: string) => {
    const updatedSkills = skills.map((skill) => (skill.id === id ? { ...skill, level: Number.parseInt(level) } : skill))
    onChange(updatedSkills)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-3 items-end">
        <div>
          <Label htmlFor="skill-select">Skill</Label>
          <Select value={newSkill} onValueChange={setNewSkill}>
            <SelectTrigger id="skill-select" className="w-full">
              <SelectValue placeholder="Select a skill" />
            </SelectTrigger>
            <SelectContent>
              {skillOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="skill-level">Level</Label>
          <Select value={newLevel} onValueChange={setNewLevel}>
            <SelectTrigger id="skill-level" className="w-full">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Beginner</SelectItem>
              <SelectItem value="2">2 - Basic</SelectItem>
              <SelectItem value="3">3 - Intermediate</SelectItem>
              <SelectItem value="4">4 - Advanced</SelectItem>
              <SelectItem value="5">5 - Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="button" onClick={handleAddSkill} className="flex gap-1 items-center">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="space-y-3 mt-4">
        {skills.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No skills added yet</p>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-3 rounded-md border border-muted/30 bg-muted/10 group hover:border-muted/50 transition-colors"
            >
              <span className="font-medium">{skill.name}</span>

              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleLevelChange(skill.id, level.toString())}
                      className={`h-5 w-5 ${
                        level <= skill.level
                          ? "text-primary"
                          : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
                      } transition-colors`}
                      title={`Level ${level}`}
                    >
                      <Star className={level <= skill.level ? "fill-primary" : ""} />
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
