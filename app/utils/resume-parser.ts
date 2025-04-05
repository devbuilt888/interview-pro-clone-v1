/**
 * Resume Parsing Utilities
 * 
 * This module provides functions for parsing raw resume text into structured data
 * and formatting resume data for consumption by OpenAI.
 */

import { ResumeData, OpenAIPromptConfig } from './resume-types';

/**
 * Parse raw resume text into structured sections
 */
export function parseResumeText(text: string): ResumeData {
  // Initialize resume data structure
  const resumeData: ResumeData = {
    name: null,
    contactInfo: [],
    education: [],
    experience: [],
    skills: [],
    summary: null,
    rawText: text
  };
  
  // Split text into lines for processing
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  // Find sections in the resume
  const sections: Record<string, number[]> = {
    education: [],
    experience: [],
    skills: [],
    summary: []
  };
  
  // Find potential section headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check for common section headers
    if (/^(education|academic|degree|university|college|school)s?:?$/i.test(line)) {
      sections.education.push(i);
    } else if (/^(experience|work|employment|job|professional|career|history)s?:?$/i.test(line)) {
      sections.experience.push(i);
    } else if (/^(skills|abilities|proficiencies|competencies|expertise|technical|technologies)s?:?$/i.test(line)) {
      sections.skills.push(i);
    } else if (/^(summary|profile|objective|about|overview)s?:?$/i.test(line)) {
      sections.summary.push(i);
    }
  }
  
  // Extract name (usually at the beginning of the resume)
  // Try different approaches for name extraction
  const namePatterns = [
    // Common formats for names at the top of resumes
    /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)$/,  // Full name with proper capitalization
    /^([A-Z]+\s+[A-Z]+)$/,               // ALL CAPS NAME
    /^((?:[A-Z][a-zA-Z]*\s*){2,4})$/     // More flexible name pattern
  ];
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    for (const pattern of namePatterns) {
      const match = lines[i].match(pattern);
      if (match && match[1]) {
        resumeData.name = match[1].trim();
        break;
      }
    }
    if (resumeData.name) break;
  }
  
  // Extract contact information
  const contactPatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,                               // Email
    /\b(\+\d{1,3}[-\s]?)?(\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4})\b/,                        // Phone
    /\b(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/,                     // LinkedIn
    /\b(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/?/,                           // GitHub
    /\b(https?:\/\/)?([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}\b/    // Website
  ];
  
  for (const line of lines) {
    for (const pattern of contactPatterns) {
      if (pattern.test(line)) {
        const cleaned = line.replace(/^[^A-Za-z0-9@+]+|[^A-Za-z0-9.]+$/g, '').trim();
        if (cleaned && !resumeData.contactInfo.includes(cleaned)) {
          resumeData.contactInfo.push(cleaned);
        }
      }
    }
  }
  
  // Extract sections based on identified section headers
  const extractSection = (sectionIndices: number[], endIndex: number) => {
    if (sectionIndices.length === 0) return [];
    
    const startIndex = sectionIndices[0] + 1; // Start after the header
    const sectionLines = lines.slice(startIndex, endIndex);
    
    // Group lines into chunks based on formatting patterns
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const line of sectionLines) {
      // Check if this line could be the start of a new entry
      // (e.g., starts with a date or is short like a job title)
      if (/^\d{4}|^\d{1,2}\/\d{1,2}|^[A-Z][a-z]+ \d{4}/.test(line) || 
          (line.length < 40 && /[A-Z]/.test(line[0]))) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
      }
      
      currentChunk += line + ' ';
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  };
  
  // Calculate section boundaries
  const sectionBoundaries = Object.entries(sections).map(([name, indices]) => ({
    name,
    start: indices.length > 0 ? indices[0] : lines.length
  })).sort((a, b) => a.start - b.start);
  
  // Extract each section
  for (let i = 0; i < sectionBoundaries.length; i++) {
    const section = sectionBoundaries[i];
    const nextSection = i < sectionBoundaries.length - 1 ? sectionBoundaries[i + 1] : null;
    const endIndex = nextSection ? nextSection.start : lines.length;
    
    if (section.name === 'education') {
      resumeData.education = extractSection(sections.education, endIndex);
    } else if (section.name === 'experience') {
      resumeData.experience = extractSection(sections.experience, endIndex);
    } else if (section.name === 'skills') {
      resumeData.skills = extractSection(sections.skills, endIndex);
    } else if (section.name === 'summary') {
      const summaryLines = extractSection(sections.summary, endIndex);
      if (summaryLines.length > 0) {
        resumeData.summary = summaryLines.join(' ');
      }
    }
  }
  
  // If no summary was found but there's text at the beginning, use that as summary
  if (!resumeData.summary && sectionBoundaries.length > 0 && sectionBoundaries[0].start > 3) {
    const potentialSummary = lines.slice(0, sectionBoundaries[0].start).join(' ');
    if (potentialSummary.length > 30 && potentialSummary.length < 1000) {
      resumeData.summary = potentialSummary;
    }
  }
  
  return resumeData;
}

/**
 * Format resume data as structured text
 */
export function formatResumeData(resumeData: ResumeData): string {
  let formattedText = '';
  
  // Add name if found
  if (resumeData.name) {
    formattedText += `Name: ${resumeData.name}\n\n`;
  }
  
  // Add contact info
  if (resumeData.contactInfo.length > 0) {
    formattedText += `Contact Information:\n${resumeData.contactInfo.join('\n')}\n\n`;
  }
  
  // Add summary if found
  if (resumeData.summary) {
    formattedText += `Summary:\n${resumeData.summary}\n\n`;
  }
  
  // Add experience
  if (resumeData.experience.length > 0) {
    formattedText += `Experience:\n${resumeData.experience.join('\n\n')}\n\n`;
  }
  
  // Add education
  if (resumeData.education.length > 0) {
    formattedText += `Education:\n${resumeData.education.join('\n\n')}\n\n`;
  }
  
  // Add skills
  if (resumeData.skills.length > 0) {
    formattedText += `Skills:\n${resumeData.skills.join('\n\n')}\n\n`;
  }
  
  // If no structured data was extracted, use the raw text
  if (formattedText.trim().length < 100) {
    formattedText = resumeData.rawText;
  }
  
  return formattedText;
}

/**
 * Prepare resume text for OpenAI by formatting and limiting length
 */
export function prepareResumeForOpenAI(
  resumeData: ResumeData, 
  config: OpenAIPromptConfig = {}
): string {
  // Format the resume data
  let formatted = formatResumeData(resumeData);
  
  // Add section markers if requested
  if (config.includeSectionMarkers !== false) {
    formatted = "--- RESUME START ---\n" + formatted + "\n--- RESUME END ---";
  }
  
  // Limit the text to avoid token limits
  const maxLength = config.maxLength || 7500;
  if (formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength) + '...';
  }
  
  return formatted;
}

/**
 * Get fallback resume text when extraction fails
 */
export function getFallbackResumeText(): string {
  return `John Doe
Software Engineer
5+ years of experience in full-stack development
Skills: JavaScript, TypeScript, React, Node.js, Python
Experience: Senior Developer at Tech Corp (2020-present)
Education: BS Computer Science, University of Technology (2019)`;
} 