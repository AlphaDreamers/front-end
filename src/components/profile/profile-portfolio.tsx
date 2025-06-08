// src/components/profile/profile-about.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getIconBySocialType } from "@/lib/utils";
import { ProfileUser } from "@/lib/types";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileAboutProps {
  user: ProfileUser;
  socialLinks: ProfileUser["socialLinks"];
  skills: ProfileUser["skills"];
}

export default function ProfileAbout({
  user,
  socialLinks,
  skills,
}: ProfileAboutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Bio Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {user.bio || "No bio provided yet."}
            </p>
          </CardContent>
        </Card>

        {/* Skills Card */}
        {skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.title}</span>
                    <span className="text-sm text-muted-foreground">
                      Level {skill.level}/5
                    </span>
                  </div>
                  <Progress value={skill.level * 20} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Verification Card */}
        {user.isKycVerified && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="w-full justify-center py-2 bg-green-600">
                Identity Verified
              </Badge>
              <p className="text-xs text-muted-foreground text-center mt-2">
                This seller has completed KYC verification
              </p>
            </CardContent>
          </Card>
        )}

        {/* Social Links Card */}
        {socialLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full justify-start"
                  )}
                >
                  {getIconBySocialType(link.type as any, { size: 16 })}
                  <span className="ml-2">{link.type}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
