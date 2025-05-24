import type { Skill } from "@/lib/data"

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.name} className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">
                Level {skill.level}/{skill.maxLevel}
              </span>
            </div>
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500 group-hover:from-violet-400 group-hover:to-purple-400"
                style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
