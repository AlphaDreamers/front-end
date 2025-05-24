import type { Badge as BadgeType } from "@/lib/data"
import { Award, Zap, Link, TrendingUp, Bitcoin } from "lucide-react"

interface BadgesSectionProps {
  badges: BadgeType[]
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-5 w-5" />
      case "zap":
        return <Zap className="h-5 w-5" />
      case "link":
        return <Link className="h-5 w-5" />
      case "trending-up":
        return <TrendingUp className="h-5 w-5" />
      case "bitcoin":
        return <Bitcoin className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const getRarityColor = (rarity: BadgeType["rarity"]) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-500"
      case "uncommon":
        return "from-green-400 to-green-500"
      case "rare":
        return "from-blue-400 to-blue-500"
      case "epic":
        return "from-purple-400 to-purple-500"
      case "legendary":
        return "from-yellow-400 to-yellow-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getRarityBorder = (rarity: BadgeType["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-500"
      case "uncommon":
        return "border-green-500"
      case "rare":
        return "border-blue-500"
      case "epic":
        return "border-purple-500"
      case "legendary":
        return "border-yellow-500"
      default:
        return "border-gray-500"
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Badges & Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center text-center group">
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center border-2 ${getRarityBorder(
                badge.rarity,
              )} bg-gradient-to-br ${getRarityColor(
                badge.rarity,
              )} shadow-lg group-hover:shadow-xl transition-all duration-300 mb-2`}
            >
              {getIconComponent(badge.icon)}
            </div>
            <h3 className="font-medium text-sm">{badge.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {badge.description}
            </p>
            <span className="text-xs capitalize mt-1 px-2 py-0.5 rounded-full bg-muted/20">{badge.rarity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
