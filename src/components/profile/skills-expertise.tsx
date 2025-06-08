"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Skill } from "@/lib/types";

interface SkillsExpertiseProps {
  skills: Skill[];
  className?: string;
}

const getSkillLevelLabel = (level: number) => {
  if (level >= 5) return "Expert";
  if (level >= 4) return "Advanced";
  if (level >= 3) return "Proficient";
  if (level >= 2) return "Intermediate";
  return "Beginner";
};

const getSkillLevelColor = (level: number) => {
  if (level >= 5) return "text-purple-500";
  if (level >= 4) return "text-blue-500";
  if (level >= 3) return "text-green-500";
  if (level >= 2) return "text-yellow-500";
  return "text-gray-500";
};

export function SkillsExpertise({ skills, className }: SkillsExpertiseProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  // Sort skills by level (highest first)
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level);

  // Get top skills (level 4 or above)
  const topSkills = sortedSkills.filter((skill) => skill.level >= 4);
  const otherSkills = sortedSkills.filter((skill) => skill.level < 4);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Skills & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Skills Section */}
        {topSkills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Top Skills
            </h4>
            <div className="grid gap-3">
              {topSkills.map((skillItem) => (
                <TooltipProvider key={skillItem.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {skillItem.skill.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getSkillLevelColor(skillItem.level)
                            )}
                          >
                            {getSkillLevelLabel(skillItem.level)}
                          </Badge>
                        </div>
                        <Progress
                          value={skillItem.level * 20}
                          className="h-2"
                          indicatorClassName={cn(
                            skillItem.level >= 5 && "bg-purple-500",
                            skillItem.level === 4 && "bg-blue-500"
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skill level: {skillItem.level}/5</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {/* Other Skills Section */}
        {otherSkills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Additional Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {otherSkills.map((skillItem) => (
                <TooltipProvider key={skillItem.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-default">
                        {skillItem.skill.title}
                        <span
                          className={cn(
                            "ml-1 text-xs",
                            getSkillLevelColor(skillItem.level)
                          )}
                        >
                          ({skillItem.level}/5)
                        </span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getSkillLevelLabel(skillItem.level)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {/* Skills Summary */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Skills</span>
            <span className="font-medium">{skills.length}</span>
          </div>
          {topSkills.length > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Expert Level Skills</span>
              <span className="font-medium text-purple-500">
                {skills.filter((s) => s.level === 5).length}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
