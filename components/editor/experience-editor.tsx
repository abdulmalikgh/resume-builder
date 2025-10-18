'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import type { Experience } from '@/types/resume';

export function ExperienceEditor() {
  const { resumeData, addExperience, updateExperience, deleteExperience } = useResumeStore();
  const { experience } = resumeData;
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
      verified: false,
    };
    addExperience(newExp);
    setEditingId(newExp.id);
  };

  const handleDescriptionChange = (id: string, index: number, value: string) => {
    const exp = experience.find((e) => e.id === id);
    if (exp) {
      const newDescription = [...exp.description];
      newDescription[index] = value;
      updateExperience(id, { description: newDescription });
    }
  };

  const addDescriptionPoint = (id: string) => {
    const exp = experience.find((e) => e.id === id);
    if (exp) {
      updateExperience(id, { description: [...exp.description, ''] });
    }
  };

  const removeDescriptionPoint = (id: string, index: number) => {
    const exp = experience.find((e) => e.id === id);
    if (exp) {
      const newDescription = exp.description.filter((_, i) => i !== index);
      updateExperience(id, { description: newDescription });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experience.map((exp, index) => (
          <Card key={exp.id} className="p-4 border-2">
            <div className="flex items-start gap-2 mb-3">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Experience {index + 1}
                    </h3>
                    {exp.verified && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteExperience(exp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Position *</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="Tech Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Location *</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
                  </div>

                  <div>
                    <Label>Responsibilities & Achievements</Label>
                    <div className="space-y-2 mt-2">
                      {exp.description.map((desc, descIndex) => (
                        <div key={descIndex} className="flex gap-2">
                          <Textarea
                            value={desc}
                            onChange={(e) => handleDescriptionChange(exp.id, descIndex, e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={2}
                            className="resize-none"
                          />
                          {exp.description.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDescriptionPoint(exp.id, descIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addDescriptionPoint(exp.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
