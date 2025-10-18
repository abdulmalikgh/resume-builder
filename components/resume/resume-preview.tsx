'use client';

import { useResumeStore } from '@/store/resume-store';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Linkedin, Globe, Github, CheckCircle2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function ResumePreview() {
  const { resumeData, settings } = useResumeStore();
  const { personalInfo, experience, education, projects, certifications, skills, achievements, sectionOrder } = resumeData;
  const { theme, showIcons, showVerificationBadges } = settings;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const getDateRange = (start: string, end: string, current: boolean) => {
    const startDate = formatDate(start);
    const endDate = current ? 'Present' : formatDate(end);
    return `${startDate} - ${endDate}`;
  };

  const enabledSections = sectionOrder
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: typeof sectionOrder[0]) => {
    switch (section.id) {
      case 'personal':
        return null; // Personal info is always at the top

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key="experience" className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b-2"
              style={{
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: theme.colors.text }}>
                        {exp.position}
                        {showVerificationBadges && exp.verified && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </h3>
                      <p className="font-medium" style={{ color: theme.colors.secondary }}>
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <span className="text-sm whitespace-nowrap" style={{ color: theme.colors.secondary }}>
                      {getDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-1 mt-2">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="text-sm" style={{ color: theme.colors.text }}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key="education" className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b-2"
              style={{
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.colors.text }}>
                        {edu.degree} in {edu.field}
                        {showVerificationBadges && edu.verified && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </h3>
                      <p className="text-sm" style={{ color: theme.colors.secondary }}>
                        {edu.institution} • {edu.location}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm" style={{ color: theme.colors.secondary }}>
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <span className="text-sm whitespace-nowrap" style={{ color: theme.colors.secondary }}>
                      {getDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 ml-1 mt-2">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm" style={{ color: theme.colors.text }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key="projects" className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b-2"
              style={{
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.colors.text }}>
                      {project.name}
                      {showVerificationBadges && project.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </h3>
                    <span className="text-sm whitespace-nowrap" style={{ color: theme.colors.secondary }}>
                      {getDateRange(project.startDate, project.endDate, false)}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: theme.colors.text }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${theme.colors.accent}15`,
                          color: theme.colors.accent,
                        }}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm" style={{ color: theme.colors.text }}>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                  {(project.link || project.github) && (
                    <div className="flex gap-3 mt-2 text-xs" style={{ color: theme.colors.accent }}>
                      {project.link && (
                        <a href={`https://${project.link}`} className="hover:underline flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {project.link}
                        </a>
                      )}
                      {project.github && (
                        <a href={`https://${project.github}`} className="hover:underline flex items-center gap-1">
                          <Github className="h-3 w-3" />
                          {project.github}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        const skillsByCategory = skills.reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill);
          return acc;
        }, {} as Record<string, typeof skills>);

        return (
          <div key="skills" className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b-2"
              style={{
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              }}
            >
              Skills
            </h2>
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: theme.colors.secondary }}>
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <Badge
                        key={skill.id}
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background,
                        }}
                      >
                        {skill.name} • {skill.level}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b-2"
              style={{
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.colors.text }}>
                      {cert.name}
                      {showVerificationBadges && cert.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </h3>
                    <p className="text-sm" style={{ color: theme.colors.secondary }}>
                      {cert.issuer}
                      {cert.credentialId && ` • ID: ${cert.credentialId}`}
                    </p>
                  </div>
                  <span className="text-sm whitespace-nowrap" style={{ color: theme.colors.secondary }}>
                    {formatDate(cert.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (achievements.length === 0) return null;
        return (
          <div key="achievements" className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b-2"
              style={{
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              }}
            >
              Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.colors.text }}>
                      {achievement.title}
                      {showVerificationBadges && achievement.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </h3>
                    <span className="text-sm whitespace-nowrap" style={{ color: theme.colors.secondary }}>
                      {formatDate(achievement.date)}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: theme.colors.secondary }}>
                    {achievement.issuer}
                  </p>
                  <p className="text-sm mt-1" style={{ color: theme.colors.text }}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id="resume-preview"
      className="w-full min-h-full bg-white"
      style={{
        padding: `${settings.margins}px`,
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-lg mb-3" style={{ color: theme.colors.primary }}>
            {personalInfo.title}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: theme.colors.secondary }}>
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              {showIcons && <Mail className="h-4 w-4" />}
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              {showIcons && <Phone className="h-4 w-4" />}
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              {showIcons && <MapPin className="h-4 w-4" />}
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              {showIcons && <Linkedin className="h-4 w-4" />}
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              {showIcons && <Globe className="h-4 w-4" />}
              <span>{personalInfo.portfolio}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              {showIcons && <Github className="h-4 w-4" />}
              <span>{personalInfo.github}</span>
            </div>
          )}
        </div>

        {personalInfo.summary && (
          <p className="mt-3 text-sm leading-relaxed" style={{ color: theme.colors.text }}>
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* Dynamic Sections */}
      {enabledSections.map((section) => renderSection(section))}
    </div>
  );
}
