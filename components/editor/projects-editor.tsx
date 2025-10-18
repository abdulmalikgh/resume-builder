'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X, CheckCircle2 } from 'lucide-react';
import type { Project } from '@/types/resume';

export function ProjectsEditor() {
  const { resumeData, addProject, updateProject, deleteProject } = useResumeStore();
  const { projects } = resumeData;
  const [techInput, setTechInput] = useState<{ [key: string]: string }>({});

  const handleAdd = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: '',
      startDate: '',
      endDate: '',
      highlights: [''],
      verified: false,
    };
    addProject(newProject);
  };

  const addTechnology = (projectId: string) => {
    const tech = techInput[projectId]?.trim();
    if (!tech) return;

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        technologies: [...project.technologies, tech],
      });
      setTechInput({ ...techInput, [projectId]: '' });
    }
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        technologies: project.technologies.filter((t) => t !== tech),
      });
    }
  };

  const addHighlight = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        highlights: [...project.highlights, ''],
      });
    }
  };

  const updateHighlight = (projectId: string, index: number, value: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const newHighlights = [...project.highlights];
      newHighlights[index] = value;
      updateProject(projectId, { highlights: newHighlights });
    }
  };

  const removeHighlight = (projectId: string, index: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const newHighlights = project.highlights.filter((_, i) => i !== index);
      updateProject(projectId, { highlights: newHighlights });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <Card key={project.id} className="p-4 border-2">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Project {index + 1}</h3>
                {project.verified && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteProject(project.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder="Brief description of the project..."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Project Link (Optional)</Label>
                  <Input
                    value={project.link || ''}
                    onChange={(e) => updateProject(project.id, { link: e.target.value })}
                    placeholder="project-demo.com"
                  />
                </div>
                <div>
                  <Label>GitHub Link (Optional)</Label>
                  <Input
                    value={project.github || ''}
                    onChange={(e) => updateProject(project.id, { github: e.target.value })}
                    placeholder="github.com/user/project"
                  />
                </div>
              </div>

              <div>
                <Label>Technologies Used</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={techInput[project.id] || ''}
                    onChange={(e) => setTechInput({ ...techInput, [project.id]: e.target.value })}
                    placeholder="e.g., React"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology(project.id);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addTechnology(project.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        onClick={() => removeTechnology(project.id, tech)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Key Highlights</Label>
                <div className="space-y-2 mt-2">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex gap-2">
                      <Textarea
                        value={highlight}
                        onChange={(e) => updateHighlight(project.id, highlightIndex, e.target.value)}
                        placeholder="Describe a key achievement or feature..."
                        rows={2}
                        className="resize-none"
                      />
                      {project.highlights.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHighlight(project.id, highlightIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addHighlight(project.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects added yet.</p>
            <p className="text-sm">Click "Add Project" to showcase your work.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
