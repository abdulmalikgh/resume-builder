'use client';

import { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { ResumePreview } from '@/components/resume/resume-preview';
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
  Palette,
  Eye,
  FileText,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResumePage() {
  const { loadSampleData, resetResume, resumeData } = useResumeStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      // Capture the resume as a canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate image dimensions
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Generate filename from name
      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      // Download PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('Error exporting resume:', error);
    }
  };

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
            <Button onClick={handleExportPDF} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600">
              <Download className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
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
              Live Preview
            </h2>
            <div className="flex items-center gap-2">
              <ThemeCustomizer />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-[21cm] mx-auto">
              <div
                ref={previewRef}
                className="w-full bg-white"
                style={{ minHeight: '100vh' }}
              >
                <ResumePreview />
              </div>
            </div>
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
