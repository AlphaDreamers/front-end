import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button, buttonVariants } from "@/components/ui/button";
import { DetailedUser } from "@/lib/types";
import { getIconBySocialType } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProfileAboutProps {
  user: DetailedUser;
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Bio and Skills */}
      <div className="lg:col-span-2 space-y-8">
        {/* Bio Section */}
        {user.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {user.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {user.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {user.skills
                  .sort((a, b) => b.level - a.level)
                  .map((skill) => (
                    <div key={skill.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.title}</span>
                        <Badge variant="secondary">{skill.level}/5</Badge>
                      </div>

                      <Progress value={skill.level * 20} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Social Links */}
      {user.socialLinks.length > 0 && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {user.socialLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        className: "w-full justify-start",
                      })
                    )}
                  >
                    {getIconBySocialType(link.type)}
                    <span className="ml-2">
                      {link.type.toLocaleLowerCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
