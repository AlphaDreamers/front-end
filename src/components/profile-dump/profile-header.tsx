import type { UserProfile } from "@/lib/data"
import { Shield, MapPin, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full overflow-hidden rounded-t-lg">
        <img
          src={profile.coverImage || "/placeholder.svg"}
          alt="Profile cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 pb-6 md:px-8">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 relative z-10 gap-4 md:gap-6">
          <div className="rounded-full border-4 border-background overflow-hidden h-32 w-32 md:h-40 md:w-40 bg-muted shadow-lg">
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 pt-2 md:pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  {profile.displayName}
                  {profile.kycVerified && (
                    <span className="inline-flex items-center rounded-full bg-purple-100/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">
                      <Shield className="mr-1 h-3 w-3" /> KYC Verified
                    </span>
                  )}
                </h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>

              <div className="flex-1"></div>

              <div className="flex gap-2 mt-2 md:mt-0">
                <Button variant="outline" size="sm">
                  Message
                </Button>
                <Button size="sm">Hire Me</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">About Me</h2>
            <p className="text-muted-foreground">{profile.bio}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Member since {profile.memberSince}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                Response time: {profile.responseTime}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{profile.stats.completedJobs}</div>
              <div className="text-xs text-muted-foreground">Jobs Completed</div>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{profile.stats.onTimeDelivery}%</div>
              <div className="text-xs text-muted-foreground">On-time Delivery</div>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{profile.stats.avgRating}</div>
              <div className="text-xs text-muted-foreground">Avg. Rating</div>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{profile.stats.totalEarnings} ETH</div>
              <div className="text-xs text-muted-foreground">Total Earnings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
