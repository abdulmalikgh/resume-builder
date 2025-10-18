'use client';

import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, CheckCircle2, Award } from 'lucide-react';
import type { Achievement } from '@/types/resume';

export function AchievementsEditor() {
  const { resumeData, addAchievement, updateAchievement, deleteAchievement } = useResumeStore();
  const { achievements } = resumeData;

  const handleAdd = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: '',
      verified: false,
    };
    addAchievement(newAchievement);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold">Achievements & Awards</h2>
        </div>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <Card key={achievement.id} className="p-4 border-2">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Achievement {index + 1}</h3>
                {achievement.verified && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAchievement(achievement.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Achievement Title *</Label>
                <Input
                  value={achievement.title}
                  onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })}
                  placeholder="Best Innovation Award 2023"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Issuing Organization *</Label>
                  <Input
                    value={achievement.issuer}
                    onChange={(e) => updateAchievement(achievement.id, { issuer: e.target.value })}
                    placeholder="Company Name / Event Name"
                  />
                </div>
                <div>
                  <Label>Date Received *</Label>
                  <Input
                    type="month"
                    value={achievement.date}
                    onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={achievement.description}
                  onChange={(e) =>
                    updateAchievement(achievement.id, { description: e.target.value })
                  }
                  placeholder="Brief description of the achievement and why you received it..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id={`verified-achievement-${achievement.id}`}
                  checked={achievement.verified}
                  onChange={(e) =>
                    updateAchievement(achievement.id, { verified: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor={`verified-achievement-${achievement.id}`} className="text-sm">
                  Mark as verified (show green checkmark)
                </Label>
              </div>
            </div>
          </Card>
        ))}

        {achievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
            <p>No achievements added yet.</p>
            <p className="text-sm">Click "Add Achievement" to showcase your awards and recognitions.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
