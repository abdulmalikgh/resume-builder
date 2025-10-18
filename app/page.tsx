'use client';

import { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { ResumePreview } from '@/components/resume/resume-preview';
import { PersonalInfoEditor } from '@/components/editor/personal-info-editor';
import { ExperienceEditor } from '@/components/editor/experience-editor';
import { EducationEditor } from '@/components/editor/education-editor';
import { ProjectsEditor } from '@/components/editor/projects-editor';
import { SkillsEditor } from '@/components/editor/skills-editor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download,
  Palette,
  Eye,
  FileText,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ResumePage() {
  const { loadSampleData, resetResume } = useResumeStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'resume.png';
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Resume Builder Pro</h1>
              <p className="text-xs text-slate-500">Create your professional resume in minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadSampleData}>
              <Sparkles className="h-4 w-4 mr-2" />
              Load Sample
            </Button>
            <Button variant="outline" size="sm" onClick={resetResume}>
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button size="sm" onClick={handleExportPDF} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex ">
        {/* Editor Panel */}
        <div className={`w-full lg:w-1/2 border-r border-slate-200 bg-white ${showPreview ? 'hidden lg:block' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="more"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                >
                  More
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="personal" className="mt-0">
                  <PersonalInfoEditor />
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                  <ExperienceEditor />
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                  <SkillsEditor />
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                  <EducationEditor />
                </TabsContent>

                <TabsContent value="more" className="mt-0">
                  <div className="space-y-6">
                    <ProjectsEditor />
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className={`w-full lg:w-1/2 bg-slate-100 ${!showPreview ? 'hidden lg:block' : ''}`}>
          <div className="h-full flex flex-col">
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-8 flex justify-center items-start">
                <div
                  ref={previewRef}
                  className="w-full max-w-[21cm] shadow-2xl mx-auto"
                  style={{ minHeight: '29.7cm' }}
                >
                  <ResumePreview />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <Button
          size="lg"
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          {showPreview ? <PanelLeftOpen className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
}
