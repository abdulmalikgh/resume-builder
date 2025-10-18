'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import type { Education } from '@/types/resume';

export function EducationEditor() {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const { education } = resumeData;

  const handleAdd = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: [],
      verified: false,
    };
    addEducation(newEdu);
  };

  const addAchievement = (id: string) => {
    const edu = education.find((e) => e.id === id);
    if (edu) {
      updateEducation(id, {
        achievements: [...(edu.achievements || []), ''],
      });
    }
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    const edu = education.find((e) => e.id === id);
    if (edu && edu.achievements) {
      const newAchievements = [...edu.achievements];
      newAchievements[index] = value;
      updateEducation(id, { achievements: newAchievements });
    }
  };

  const removeAchievement = (id: string, index: number) => {
    const edu = education.find((e) => e.id === id);
    if (edu && edu.achievements) {
      const newAchievements = edu.achievements.filter((_, i) => i !== index);
      updateEducation(id, { achievements: newAchievements });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={edu.id} className="p-4 border-2">
            <div className="flex items-start gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Education {index + 1}</h3>
                    {edu.verified && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteEducation(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      placeholder="Stanford University"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Degree *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label>Field of Study *</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                        placeholder="Stanford, CA"
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        disabled={edu.current}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-edu-${edu.id}`}
                      checked={edu.current}
                      onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor={`current-edu-${edu.id}`}>Currently enrolled</Label>
                  </div>

                  <div>
                    <Label>Achievements & Honors (Optional)</Label>
                    <div className="space-y-2 mt-2">
                      {edu.achievements && edu.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(edu.id, achIndex, e.target.value)}
                            placeholder="Dean's List, Honor Society, etc."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAchievement(edu.id, achIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement(edu.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {education.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
