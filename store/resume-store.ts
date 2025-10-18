import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ResumeData,
  ResumeSettings,
  PersonalInfo,
  Experience,
  Education,
  Project,
  Certification,
  Skill,
  Achievement,
  SectionOrder,
  ResumeTheme,
} from '@/types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  settings: ResumeSettings;
  activeSection: string;

  // Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperience: (experiences: Experience[]) => void;

  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  updateSectionOrder: (sections: SectionOrder[]) => void;
  toggleSection: (sectionId: string) => void;

  updateTheme: (theme: ResumeTheme) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
  setActiveSection: (section: string) => void;

  resetResume: () => void;
  loadSampleData: () => void;
}

const defaultTheme: ResumeTheme = {
  id: 'professional',
  name: 'Professional',
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    text: '#1e293b',
    background: '#ffffff',
    accent: '#3b82f6',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  spacing: 'normal',
};

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    title: '',
    summary: '',
  },
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  skills: [],
  achievements: [],
  sectionOrder: [
    { id: 'personal', label: 'Personal Information', enabled: true, order: 0 },
    { id: 'experience', label: 'Work Experience', enabled: true, order: 1 },
    { id: 'education', label: 'Education', enabled: true, order: 2 },
    { id: 'projects', label: 'Projects', enabled: true, order: 3 },
    { id: 'skills', label: 'Skills', enabled: true, order: 4 },
    { id: 'certifications', label: 'Certifications', enabled: true, order: 5 },
    { id: 'achievements', label: 'Achievements', enabled: true, order: 6 },
  ],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      settings: {
        theme: defaultTheme,
        fontSize: 14,
        lineHeight: 1.6,
        margins: 40,
        showIcons: true,
        showVerificationBadges: true,
      },
      activeSection: 'personal',

      updatePersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info },
          },
        })),

      addExperience: (experience) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: [...state.resumeData.experience, experience],
          },
        })),

      updateExperience: (id, experience) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.map((exp) =>
              exp.id === id ? { ...exp, ...experience } : exp
            ),
          },
        })),

      deleteExperience: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.filter((exp) => exp.id !== id),
          },
        })),

      reorderExperience: (experiences) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: experiences,
          },
        })),

      addEducation: (education) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [...state.resumeData.education, education],
          },
        })),

      updateEducation: (id, education) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((edu) =>
              edu.id === id ? { ...edu, ...education } : edu
            ),
          },
        })),

      deleteEducation: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter((edu) => edu.id !== id),
          },
        })),

      addProject: (project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [...state.resumeData.projects, project],
          },
        })),

      updateProject: (id, project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((proj) =>
              proj.id === id ? { ...proj, ...project } : proj
            ),
          },
        })),

      deleteProject: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter((proj) => proj.id !== id),
          },
        })),

      addCertification: (cert) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: [...state.resumeData.certifications, cert],
          },
        })),

      updateCertification: (id, cert) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: state.resumeData.certifications.map((c) =>
              c.id === id ? { ...c, ...cert } : c
            ),
          },
        })),

      deleteCertification: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: state.resumeData.certifications.filter((c) => c.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, skill],
          },
        })),

      updateSkill: (id, skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
          },
        })),

      deleteSkill: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((s) => s.id !== id),
          },
        })),

      addAchievement: (achievement) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            achievements: [...state.resumeData.achievements, achievement],
          },
        })),

      updateAchievement: (id, achievement) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            achievements: state.resumeData.achievements.map((a) =>
              a.id === id ? { ...a, ...achievement } : a
            ),
          },
        })),

      deleteAchievement: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            achievements: state.resumeData.achievements.filter((a) => a.id !== id),
          },
        })),

      updateSectionOrder: (sections) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            sectionOrder: sections,
          },
        })),

      toggleSection: (sectionId) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            sectionOrder: state.resumeData.sectionOrder.map((section) =>
              section.id === sectionId
                ? { ...section, enabled: !section.enabled }
                : section
            ),
          },
        })),

      updateTheme: (theme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme,
          },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),

      setActiveSection: (section) =>
        set({ activeSection: section }),

      resetResume: () =>
        set({
          resumeData: initialResumeData,
          activeSection: 'personal',
        }),

      loadSampleData: () =>
        set({
          resumeData: {
            personalInfo: {
              fullName: 'Sarah Johnson',
              email: 'sarah.johnson@email.com',
              phone: '+1 (555) 123-4567',
              location: 'San Francisco, CA',
              linkedin: 'linkedin.com/in/sarahjohnson',
              portfolio: 'sarahjohnson.dev',
              github: 'github.com/sarahjohnson',
              title: 'Full Stack Developer',
              summary:
                'Innovative Full Stack Developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and writing clean, maintainable code.',
            },
            experience: [
              {
                id: '1',
                company: 'Tech Innovations Inc',
                position: 'Senior Full Stack Developer',
                location: 'San Francisco, CA',
                startDate: '2022-01',
                endDate: '',
                current: true,
                description: [
                  'Led development of microservices architecture serving 2M+ users, improving system reliability by 40%',
                  'Architected and implemented real-time collaboration features using WebSockets and Redis',
                  'Mentored team of 5 junior developers, establishing code review practices and development standards',
                  'Reduced application load time by 60% through optimization and implementation of caching strategies',
                ],
                verified: true,
              },
              {
                id: '2',
                company: 'StartupXYZ',
                position: 'Full Stack Developer',
                location: 'Remote',
                startDate: '2020-03',
                endDate: '2021-12',
                current: false,
                description: [
                  'Built responsive web applications using React, TypeScript, and Node.js for B2B SaaS platform',
                  'Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 50%',
                  'Collaborated with UX team to implement accessible UI components following WCAG guidelines',
                  'Integrated payment processing system handling $1M+ in monthly transactions',
                ],
                verified: true,
              },
            ],
            education: [
              {
                id: '1',
                institution: 'Stanford University',
                degree: 'Bachelor of Science',
                field: 'Computer Science',
                location: 'Stanford, CA',
                startDate: '2015-09',
                endDate: '2019-06',
                current: false,
                gpa: '3.8',
                achievements: [
                  'Dean\'s List all semesters',
                  'President of Women in Tech club',
                  'Research assistant in AI lab',
                ],
                verified: true,
              },
            ],
            projects: [
              {
                id: '1',
                name: 'Open Source CMS Platform',
                description:
                  'Built a headless CMS platform with modern architecture for content management',
                technologies: ['React', 'Next.js', 'GraphQL', 'PostgreSQL', 'Docker'],
                github: 'github.com/sarahjohnson/cms-platform',
                startDate: '2023-01',
                endDate: '2023-06',
                highlights: [
                  'Gained 2.5K+ GitHub stars and 150+ contributors',
                  'Featured in JavaScript Weekly newsletter',
                  'Implemented plugin system for extensibility',
                ],
                verified: false,
              },
              {
                id: '2',
                name: 'Real-time Analytics Dashboard',
                description:
                  'Created analytics dashboard for monitoring application performance metrics',
                technologies: ['React', 'D3.js', 'WebSocket', 'Express', 'MongoDB'],
                link: 'analytics-demo.sarahjohnson.dev',
                startDate: '2022-06',
                endDate: '2022-09',
                highlights: [
                  'Processes 100K+ events per second with real-time visualization',
                  'Implemented custom charting library for complex data visualization',
                  'Achieved 99.9% uptime in production',
                ],
                verified: true,
              },
            ],
            certifications: [
              {
                id: '1',
                name: 'AWS Certified Solutions Architect',
                issuer: 'Amazon Web Services',
                date: '2023-03',
                credentialId: 'AWS-SAA-123456',
                verified: true,
              },
              {
                id: '2',
                name: 'Google Cloud Professional Developer',
                issuer: 'Google Cloud',
                date: '2022-08',
                credentialId: 'GCP-PD-789012',
                verified: true,
              },
            ],
            skills: [
              { id: '1', name: 'React', level: 'Expert', category: 'Technical' },
              { id: '2', name: 'TypeScript', level: 'Expert', category: 'Technical' },
              { id: '3', name: 'Node.js', level: 'Advanced', category: 'Technical' },
              { id: '4', name: 'Next.js', level: 'Advanced', category: 'Technical' },
              { id: '5', name: 'PostgreSQL', level: 'Advanced', category: 'Technical' },
              { id: '6', name: 'AWS', level: 'Advanced', category: 'Technical' },
              { id: '7', name: 'Docker', level: 'Intermediate', category: 'Tool' },
              { id: '8', name: 'GraphQL', level: 'Advanced', category: 'Technical' },
              { id: '9', name: 'Team Leadership', level: 'Advanced', category: 'Soft' },
              { id: '10', name: 'Agile/Scrum', level: 'Expert', category: 'Soft' },
            ],
            achievements: [
              {
                id: '1',
                title: 'Best Innovation Award 2023',
                issuer: 'Tech Innovations Inc',
                date: '2023-12',
                description:
                  'Recognized for developing innovative real-time collaboration feature',
                verified: true,
              },
              {
                id: '2',
                title: 'Hackathon Winner - FinTech Challenge',
                issuer: 'TechCrunch Disrupt',
                date: '2022-09',
                description:
                  'First place winner for developing AI-powered financial planning tool',
                verified: true,
              },
            ],
            sectionOrder: [
              { id: 'personal', label: 'Personal Information', enabled: true, order: 0 },
              { id: 'experience', label: 'Work Experience', enabled: true, order: 1 },
              { id: 'education', label: 'Education', enabled: true, order: 2 },
              { id: 'projects', label: 'Projects', enabled: true, order: 3 },
              { id: 'skills', label: 'Skills', enabled: true, order: 4 },
              { id: 'certifications', label: 'Certifications', enabled: true, order: 5 },
              { id: 'achievements', label: 'Achievements', enabled: true, order: 6 },
            ],
          },
        }),
    }),
    {
      name: 'resume-storage',
    }
  )
);
