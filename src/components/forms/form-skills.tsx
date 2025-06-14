"use client";

import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Plus, X, Star, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface FormSkillsProps {
  form: UseFormReturn<any>;
  availableSkills: Array<{ id: string; title: string }>;
}

// Generate a unique temp ID
const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

// Star rating component
const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6"
          onClick={() => onChange(star)}
        >
          <Star
            className={cn(
              "h-4 w-4",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        </Button>
      ))}
    </div>
  );
};

export default function FormSkills({ form, availableSkills }: FormSkillsProps) {
  const [open, setOpen] = useState(false);
  const skills = form.watch("skills") || [];

  const addSkill = (skillId: string, skillTitle: string) => {
    // Check if skill is already added
    if (skills.some((s) => s.skillId === skillId)) {
      return;
    }

    const newSkill = {
      tempId: generateTempId(),
      skillId,
      label: skillTitle,
      level: 3, // Default to intermediate
    };

    form.setValue("skills", [...skills, newSkill]);
    setOpen(false);
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    form.setValue("skills", newSkills);
  };

  const updateSkillLevel = (index: number, level: number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], level };
    form.setValue("skills", newSkills);
  };

  // Filter out already selected skills
  const availableSkillOptions = availableSkills.filter(
    (skill) => !skills.some((s) => s.skillId === skill.id)
  );

  return (
    <div className="space-y-6">
      {/* Add Skill Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Skills</h3>
          <p className="text-sm text-muted-foreground">
            Add skills and rate your proficiency level
          </p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={availableSkillOptions.length === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search skills..." />
              <CommandList>
                <CommandEmpty>No skills found.</CommandEmpty>
                <CommandGroup>
                  {availableSkillOptions.map((skill) => (
                    <CommandItem
                      key={skill.id}
                      onSelect={() => addSkill(skill.id, skill.title)}
                      className="cursor-pointer"
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

      {/* Skills Grid */}
      {skills.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <Card key={skill.id || skill.tempId} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{skill.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {skill.level === 1 && "Beginner"}
                      {skill.level === 2 && "Basic"}
                      {skill.level === 3 && "Intermediate"}
                      {skill.level === 4 && "Advanced"}
                      {skill.level === 5 && "Expert"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeSkill(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`skills.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Proficiency Level
                      </FormLabel>
                      <FormControl>
                        <StarRating
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            updateSkillLevel(index, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No skills added yet</p>
          <p className="text-sm">Add your skills to showcase your expertise</p>
        </div>
      )}

      {/* Skills Summary */}
      {skills.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Skills Summary</span>
            <Badge variant="secondary">{skills.length} skills</Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <Badge
                key={skill.id || skill.tempId}
                variant="outline"
                className="text-xs"
              >
                {skill.label}
                <span className="ml-1 text-yellow-600">
                  {"★".repeat(skill.level)}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
