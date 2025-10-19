'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/store/resume-store';
import { format } from 'date-fns';

// Register fonts if needed
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

type Props = {
  resumeData: ResumeData;
  themeColors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    background: string;
  };
};

const createStyles = (colors: Props['themeColors']) => StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 1.4,
    color: colors.text,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 5,
    lineHeight: 1.2,
  },
  title: {
    fontSize: 13,
    color: colors.primary,
    marginBottom: 12,
    lineHeight: 1.3,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 9,
    color: colors.secondary,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summary: {
    fontSize: 9,
    lineHeight: 1.5,
    color: colors.text,
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
    marginBottom: 8,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.text,
  },
  company: {
    fontSize: 10,
    fontWeight: 500,
    color: colors.secondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    color: colors.secondary,
  },
  description: {
    fontSize: 9,
    color: colors.text,
    marginLeft: 12,
    marginTop: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    marginRight: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
  educationItem: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  educationLeft: {
    flex: 1,
  },
  degree: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
  },
  institution: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 2,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
  },
  projectDescription: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 4,
  },
  techBadge: {
    backgroundColor: `${colors.accent}15`,
    color: colors.accent,
    padding: '2 6',
    marginRight: 4,
    marginBottom: 4,
    fontSize: 8,
    borderRadius: 3,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  skillsSection: {
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.secondary,
    marginBottom: 4,
  },
  skillBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  skillBadge: {
    backgroundColor: colors.primary,
    color: colors.background,
    padding: '3 8',
    fontSize: 8,
    borderRadius: 3,
  },
  certItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  certName: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
  },
  certIssuer: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 2,
  },
  achievementItem: {
    marginBottom: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  achievementTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
  },
  achievementIssuer: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 2,
  },
  achievementDescription: {
    fontSize: 9,
    color: colors.text,
    marginTop: 2,
  },
});

export function ResumePDFDocument({ resumeData, themeColors }: Props) {
  const styles = createStyles(themeColors);
  const { personalInfo, experience, education, projects, skills, certifications, achievements, sectionOrder } = resumeData;

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
      case 'experience':
        if (experience.length === 0) return null;
        return (
          <View key="experience" style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.date}>{getDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                <Text style={styles.company}>{exp.company} • {exp.location}</Text>
                {exp.description.map((desc, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{desc}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <View key="education" style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.educationLeft}>
                  <Text style={styles.degree}>{edu.degree} in {edu.field}</Text>
                  <Text style={styles.institution}>{edu.institution} • {edu.location}</Text>
                  {edu.gpa && <Text style={styles.institution}>GPA: {edu.gpa}</Text>}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <View style={{ marginTop: 4 }}>
                      {edu.achievements.map((achievement, idx) => (
                        <View key={idx} style={styles.bulletPoint}>
                          <View style={styles.bullet} />
                          <Text style={styles.bulletText}>{achievement}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <Text style={styles.date}>{getDateRange(edu.startDate, edu.endDate, edu.current)}</Text>
              </View>
            ))}
          </View>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <View key="projects" style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project) => (
              <View key={project.id} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.date}>{getDateRange(project.startDate, project.endDate, false)}</Text>
                </View>
                <Text style={styles.projectDescription}>{project.description}</Text>
                {project.technologies.length > 0 && (
                  <View style={styles.techRow}>
                    {project.technologies.map((tech, idx) => (
                      <Text key={idx} style={styles.techBadge}>{tech}</Text>
                    ))}
                  </View>
                )}
                {project.highlights.length > 0 && (
                  <View>
                    {project.highlights.map((highlight, idx) => (
                      <View key={idx} style={styles.bulletPoint}>
                        <View style={styles.bullet} />
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        );

      case 'skills':
        if (skills.length === 0) return null;
        const skillsByCategory = skills.reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill);
          return acc;
        }, {} as Record<string, typeof skills>);

        return (
          <View key="skills" style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <View key={category} style={styles.skillsSection}>
                <Text style={styles.skillCategory}>{category}</Text>
                <View style={styles.skillBadgeRow}>
                  {categorySkills.map((skill) => (
                    <Text key={skill.id} style={styles.skillBadge}>
                      {skill.name} • {skill.level}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <View key="certifications" style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <View>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>
                    {cert.issuer}
                    {cert.credentialId && ` • ID: ${cert.credentialId}`}
                  </Text>
                </View>
                <Text style={styles.date}>{formatDate(cert.date)}</Text>
              </View>
            ))}
          </View>
        );

      case 'achievements':
        if (achievements.length === 0) return null;
        return (
          <View key="achievements" style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.date}>{formatDate(achievement.date)}</Text>
                </View>
                <Text style={styles.achievementIssuer}>{achievement.issuer}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}

          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
            {personalInfo.portfolio && <Text style={styles.contactItem}>{personalInfo.portfolio}</Text>}
            {personalInfo.github && <Text style={styles.contactItem}>{personalInfo.github}</Text>}
          </View>

          {personalInfo.summary && (
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          )}
        </View>

        {/* Dynamic Sections */}
        {enabledSections.map((section) => renderSection(section))}
      </Page>
    </Document>
  );
}
