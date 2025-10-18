'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Skill } from '@/types/resume';

export function SkillsEditor() {
  const { resumeData, addSkill, updateSkill, deleteSkill } = useResumeStore();
  const { skills } = resumeData;
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<Skill['level']>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Technical');

  const handleAdd = () => {
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
    };
    addSkill(newSkill);
    setNewSkillName('');
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>

      <div className="space-y-4">
        <Card className="p-4 bg-muted/50">
          <Label className="text-sm font-semibold mb-3 block">Add New Skill</Label>
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g., React, Python, Leadership"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                }}
              />
            </div>
            <Select value={newSkillLevel} onValueChange={(v) => setNewSkillLevel(v as Skill['level'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newSkillCategory} onValueChange={(v) => setNewSkillCategory(v as Skill['category'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Soft">Soft Skill</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Tool">Tool</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} size="sm" className="mt-3 w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </Card>

        <div className="space-y-4">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="py-2 px-3 text-sm flex items-center gap-2 group"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">• {skill.level}</span>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet.</p>
            <p className="text-sm">Add your first skill using the form above.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
