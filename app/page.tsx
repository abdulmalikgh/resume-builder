'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useResumeStore } from '@/store/resume-store';
import { useResumePDF } from '@/hooks/use-resume-pdf';
import { PersonalInfoEditor } from '@/components/editor/personal-info-editor';
import { ExperienceEditor } from '@/components/editor/experience-editor';
import { EducationEditor } from '@/components/editor/education-editor';
import { ProjectsEditor } from '@/components/editor/projects-editor';
import { SkillsEditor } from '@/components/editor/skills-editor';
import { CertificationsEditor } from '@/components/editor/certifications-editor';
import { AchievementsEditor } from '@/components/editor/achievements-editor';
import { ThemeCustomizer } from '@/components/theme/theme-customizer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download,
  Eye,
  FileText,
  Sparkles,
  PanelLeftOpen,
  Loader2,
} from 'lucide-react';

// Import PDF viewer dynamically to avoid SSR issues
const ResumePDFViewer = dynamic(
  () => import('@/components/resume/resume-pdf-viewer').then((mod) => mod.ResumePDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    ),
  }
);

export default function ResumePage() {
  const { loadSampleData, resetResume } = useResumeStore();
  const { blob, isGenerating, downloadPDF } = useResumePDF();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [scale, setScale] = useState(1.0);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Resume Builder Pro</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Create your professional resume in minutes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={loadSampleData}>
              <Sparkles className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Load Sample</span>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={resetResume}>
              <span className="text-xl sm:text-base sm:hidden">↻</span>
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full sm:w-auto lg:hidden"
            >
              <Eye className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
            </Button>
            <Button
              onClick={downloadPDF}
              disabled={isGenerating || !blob}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2 animate-spin" />
              ) : (
                <Download className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Export'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={`w-full lg:w-1/2 border-r border-slate-200 bg-white flex flex-col ${showPreview ? 'hidden lg:flex' : ''}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-slate-200 bg-slate-50/50 flex-shrink-0 overflow-x-auto custom-scrollbar">
              <div className="px-4 min-w-max">
                <TabsList className="inline-flex justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Experience
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Certifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-blue-600 whitespace-nowrap"
                  >
                    Achievements
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="personal" className="mt-0">
                  <PersonalInfoEditor />
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                  <ExperienceEditor />
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                  <EducationEditor />
                </TabsContent>

                <TabsContent value="projects" className="mt-0">
                  <ProjectsEditor />
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                  <SkillsEditor />
                </TabsContent>

                <TabsContent value="certifications" className="mt-0">
                  <CertificationsEditor />
                </TabsContent>

                <TabsContent value="achievements" className="mt-0">
                  <AchievementsEditor />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className={`w-full lg:w-1/2 bg-slate-100 flex flex-col overflow-hidden ${!showPreview ? 'hidden lg:flex' : ''}`}>
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              PDF Preview
              {isGenerating && <Loader2 className="h-3 w-3 animate-spin text-blue-600" />}
            </h2>
            <div className="flex items-center gap-2">
              <ThemeCustomizer />
              <div className="flex items-center gap-2 border-l pl-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  disabled={scale <= 0.5}
                >
                  -
                </Button>
                <span className="text-xs text-slate-600 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                  disabled={scale >= 2}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ResumePDFViewer blob={blob} scale={scale} />
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
