"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Plus, X, Check, ChevronsUpDown } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { UpdateProfileFormSchema } from "@/lib/schemas/profile";
import { AvailableSkill } from "@/lib/types/profile";
import { cn } from "@/lib/utils";

interface EditProfileSkillsProps {
  form: UseFormReturn<z.infer<typeof UpdateProfileFormSchema>>;
  availableSkills: AvailableSkill[];
}

export default function EditProfileSkills({
  form,
  availableSkills,
}: EditProfileSkillsProps) {
  const [open, setOpen] = useState(false);

  const skills = form.watch("skills");

  const addSkill = (skill: AvailableSkill) => {
    const currentSkills = form.getValues("skills");

    // Check if skill already exists
    if (currentSkills.some((s) => s.skillId === skill.id)) {
      return;
    }

    form.setValue("skills", [
      ...currentSkills,
      {
        skillId: skill.id,
        label: skill.title,
        level: 3, // Default to intermediate level
      },
    ]);

    setOpen(false);
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((_, i) => i !== index)
    );
  };

  const updateSkillLevel = (index: number, level: number) => {
    const currentSkills = form.getValues("skills");
    currentSkills[index].level = level;
    form.setValue("skills", currentSkills);
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 5) return "Expert";
    if (level >= 4) return "Advanced";
    if (level >= 3) return "Proficient";
    if (level >= 2) return "Intermediate";
    return "Beginner";
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 5) return "text-purple-600";
    if (level >= 4) return "text-blue-600";
    if (level >= 3) return "text-green-600";
    if (level >= 2) return "text-yellow-600";
    return "text-gray-600";
  };

  // Filter out already selected skills
  const availableSkillsFiltered = availableSkills.filter(
    (skill) => !skills.some((s) => s.skillId === skill.id)
  );

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills & Expertise</FormLabel>
            <FormDescription>
              Add your skills and rate your proficiency level for each
            </FormDescription>
            <FormControl>
              <div className="space-y-4">
                {/* Skills List */}
                {skills.length > 0 ? (
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <Card key={skill.id || index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{skill.label}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span
                                className={cn(
                                  "font-medium",
                                  getSkillLevelColor(skill.level)
                                )}
                              >
                                {getSkillLevelLabel(skill.level)}
                              </span>
                              <span className="text-muted-foreground">
                                Level {skill.level}/5
                              </span>
                            </div>

                            <Slider
                              value={[skill.level]}
                              onValueChange={([value]) =>
                                updateSkillLevel(index, value)
                              }
                              min={1}
                              max={5}
                              step={1}
                              className="w-full"
                            />

                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Beginner</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center border-dashed">
                    <p className="text-muted-foreground">
                      No skills added yet. Click the button below to add your
                      first skill.
                    </p>
                  </Card>
                )}

                {/* Add Skill Button */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={availableSkillsFiltered.length === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                      {availableSkillsFiltered.length === 0 &&
                        " (All skills added)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search skills..." />
                      <CommandList>
                        <CommandEmpty>No skill found.</CommandEmpty>
                        <CommandGroup>
                          {availableSkillsFiltered.map((skill) => (
                            <CommandItem
                              key={skill.id}
                              value={skill.title}
                              onSelect={() => addSkill(skill)}
                            >
                              {skill.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
