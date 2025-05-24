import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SkillsSection() {
  const skills = [
    { name: "Solana", level: 95 },
    { name: "Rust", level: 90 },
    { name: "Smart Contracts", level: 92 },
    { name: "React", level: 85 },
    { name: "TypeScript", level: 88 },
    { name: "Web3.js", level: 94 },
  ]

  const tags = [
    "Blockchain",
    "DeFi",
    "NFT",
    "Marketplace",
    "dApps",
    "Solana",
    "Rust",
    "Smart Contracts",
    "Web3",
    "Crypto",
    "Frontend",
    "React",
    "TypeScript",
    "Node.js",
  ]

  return (
    <Card className="bg-[#1E1E1E] border-0">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {skills.slice(0, 3).map((skill) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <Progress value={skill.level} className="h-2 bg-[#252525]" indicatorClassName="bg-[#9F7AEA]" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#252525] hover:bg-[#333333] text-white">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
