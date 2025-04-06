/**
 * PDF Pattern Translator
 * 
 * This module provides specialized functions for translating common gibberish patterns
 * found in PDF extractions into meaningful text.
 * 
 * The goal is to identify patterns in the gibberish that correlate to specific
 * types of information (names, job titles, etc.) and convert them to usable text.
 */

// Type definitions for pattern translation
export interface PatternMatch {
  pattern: RegExp;
  confidenceScore: number;
  type: 'name' | 'job_title' | 'company' | 'date' | 'section_header' | 'education' | 'skill' | 'contact';
  extractFn: (match: RegExpMatchArray) => string | null;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  translations: {
    type: string;
    original: string;
    translated: string;
    confidence: number;
  }[];
}

/**
 * Common name patterns found in gibberish text from PDFs
 * These are based on observed patterns in extracted PDFs
 */
const namePatterns: PatternMatch[] = [
  // Common pattern: Name in parentheses after specific operators
  {
    pattern: /\/([A-Za-z]+)\s*\(\s*([A-Za-z][A-Za-z\s\.\-,']{3,})\s*\)/g,
    confidenceScore: 0.8,
    type: 'name',
    extractFn: (match) => {
      // Check if the operator hint suggests this is a name
      const operator = match[1]?.toLowerCase();
      const nameHints = ['name', 'title', 'author', 'person', 't', 'tx', 'heading'];
      
      if (nameHints.includes(operator) && match[2]) {
        return match[2].trim();
      }
      return null;
    }
  },
  
  // LinkedIn resume header name pattern
  {
    pattern: /BT\s+\/F\d+\s+\d+(?:\.\d+)?\s+Tf\s+[\d\.\-]+\s+[\d\.\-]+\s+Td\s+\(\s*([A-Z][A-Za-z\s\.\-,']{5,})\s*\)\s+Tj\s+ET/g,
    confidenceScore: 0.9,
    type: 'name',
    extractFn: (match) => match[1]?.trim() || null
  },
  
  // Pattern: Name at the beginning of the file with capitalization
  {
    pattern: /^(?:\([^)]*\)\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s|\n|$)/gm,
    confidenceScore: 0.7,
    type: 'name',
    extractFn: (match) => {
      const name = match[1]?.trim();
      // Validate it's not too long or too short to be a name
      if (name && name.length > 3 && name.length < 40 && name.split(/\s+/).length <= 4) {
        return name;
      }
      return null;
    }
  }
];

/**
 * Job title patterns found in gibberish text from PDFs
 */
const jobTitlePatterns: PatternMatch[] = [
  // Common job title pattern
  {
    pattern: /\/(Title|Role|Position|JobTitle)\s*\(\s*([A-Za-z][A-Za-z\s\.\-&,']{3,})\s*\)/gi,
    confidenceScore: 0.85,
    type: 'job_title',
    extractFn: (match) => match[2]?.trim() || null
  },
  
  // Job title after name pattern
  {
    pattern: /BT\s+\/F\d+\s+\d+(?:\.\d+)?\s+Tf\s+[\d\.\-]+\s+[\d\.\-]+\s+Td\s+\(\s*([A-Za-z][A-Za-z\s\.\-&|,']{5,})\s*\)\s+Tj\s+ET/g,
    confidenceScore: 0.7,
    type: 'job_title',
    extractFn: (match) => {
      const title = match[1]?.trim();
      
      // Common job title keywords to detect in the pattern
      const jobKeywords = [
        'engineer', 'developer', 'manager', 'director', 'specialist',
        'consultant', 'analyst', 'designer', 'architect', 'lead',
        'senior', 'junior', 'associate', 'assistant', 'head',
        'chief', 'officer', 'vp', 'president', 'coordinator',
        'administrator', 'supervisor', 'professional'
      ];
      
      if (title) {
        const lowerTitle = title.toLowerCase();
        
        // Check if the text contains job title keywords
        if (jobKeywords.some(keyword => lowerTitle.includes(keyword))) {
          return title;
        }
      }
      
      return null;
    }
  },
  
  // Job title with common prefixes
  {
    pattern: /(?:^|\n|\s)((?:Senior|Junior|Lead|Staff|Principal|Chief|Head|VP|Director of|Manager of)[\s\-]+[A-Z][A-Za-z\s\-&]+)(?:\n|\s|$)/g,
    confidenceScore: 0.75,
    type: 'job_title',
    extractFn: (match) => match[1]?.trim() || null
  }
];

/**
 * Company name patterns
 */
const companyPatterns: PatternMatch[] = [
  // Company after specific operators
  {
    pattern: /\/(Company|Employer|Organization)\s*\(\s*([A-Za-z][A-Za-z\s\.\-&,']{3,})\s*\)/gi,
    confidenceScore: 0.85,
    type: 'company',
    extractFn: (match) => match[2]?.trim() || null
  },
  
  // Company with Inc, LLC, Ltd patterns
  {
    pattern: /([A-Z][A-Za-z\s\.\-&]+(?:\s+(?:Inc|LLC|Ltd|Corp|Corporation|Company|Co|GmbH|SA|SAS|Limited)))/g,
    confidenceScore: 0.8,
    type: 'company',
    extractFn: (match) => match[1]?.trim() || null
  }
];

/**
 * Section header patterns
 */
const sectionHeaderPatterns: PatternMatch[] = [
  // Section headers with specific operators
  {
    pattern: /\/(T|Tag|Topic|Heading|Section)\s*\(\s*(Summary|Experience|Education|Skills|Languages|Interests|Projects|Certifications|Volunteer|Awards|Publications)\s*\)/gi,
    confidenceScore: 0.9,
    type: 'section_header',
    extractFn: (match) => match[2]?.trim() || null
  },
  
  // Capitalized section headers
  {
    pattern: /(?:^|\n)([A-Z][A-Z\s]{5,})(?:\n|:)/g,
    confidenceScore: 0.7,
    type: 'section_header',
    extractFn: (match) => {
      const header = match[1]?.trim();
      
      // Common section header keywords
      const headerKeywords = [
        'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS',
        'LANGUAGES', 'PROJECTS', 'CERTIFICATIONS', 'AWARDS',
        'PUBLICATIONS', 'INTERESTS', 'VOLUNTEER', 'OBJECTIVE',
        'PROFILE', 'CONTACT', 'ABOUT', 'WORK'
      ];
      
      if (header && headerKeywords.some(keyword => header.includes(keyword))) {
        return header;
      }
      
      return null;
    }
  }
];

/**
 * Maps gibberish patterns to common section headers
 */
export function mapGibberishToSectionHeaders(text: string): Map<string, string> {
  const gibberishToSection = new Map<string, string>();
  
  // Common section header mappings based on observed patterns
  const mappings: [RegExp, string][] = [
    [/S KS S U A D J I\^P_1 9 8/gi, "SUMMARY"], 
    [/X P R N C/gi, "EXPERIENCE"],
    [/D U C T N/gi, "EDUCATION"],
    [/S K L S/gi, "SKILLS"],
    [/P R J C T S/gi, "PROJECTS"],
    [/C N T C T/gi, "CONTACT"],
    [/W R K  X P R N C/gi, "WORK EXPERIENCE"],
    [/V L N T R/gi, "VOLUNTEER"],
    [/C R T F C T N S/gi, "CERTIFICATIONS"],
    [/A W R D S/gi, "AWARDS"]
  ];
  
  // Apply each mapping
  mappings.forEach(([pattern, section]) => {
    const match = text.match(pattern);
    if (match && match[0]) {
      gibberishToSection.set(match[0], section);
    }
  });
  
  return gibberishToSection;
}

/**
 * Apply pattern translations to extract meaningful content from gibberish
 */
export function translateGibberishPatterns(text: string): TranslationResult {
  // Store the original text
  const originalText = text;
  let translatedText = text;
  const translations: TranslationResult['translations'] = [];
  
  // Combine all patterns
  const allPatterns = [
    ...namePatterns, 
    ...jobTitlePatterns,
    ...companyPatterns,
    ...sectionHeaderPatterns
  ];
  
  // Apply pattern matching
  for (const patternMatch of allPatterns) {
    try {
      // Ensure the pattern has the global flag
      const pattern = patternMatch.pattern.global ? 
        patternMatch.pattern : 
        new RegExp(patternMatch.pattern.source, patternMatch.pattern.flags + 'g');
      
      const matches = Array.from(text.matchAll(pattern));
      
      for (const match of matches) {
        const extracted = patternMatch.extractFn(match);
        
        if (extracted && match[0]) {
          // Store the translation
          translations.push({
            type: patternMatch.type,
            original: match[0],
            translated: extracted,
            confidence: patternMatch.confidenceScore
          });
        }
      }
    } catch (error) {
      console.warn(`Error applying pattern ${patternMatch.pattern}:`, error);
      // Continue with other patterns even if one fails
    }
  }
  
  // Apply section header mappings
  const sectionMappings = mapGibberishToSectionHeaders(text);
  sectionMappings.forEach((sectionName, gibberish) => {
    translations.push({
      type: 'section_header',
      original: gibberish,
      translated: sectionName,
      confidence: 0.85
    });
    
    // Replace in the text
    translatedText = translatedText.replace(new RegExp(escapeRegExp(gibberish), 'gi'), `\n\n${sectionName}:\n`);
  });
  
  // Apply the translations to the text (in order of confidence)
  translations
    .sort((a, b) => b.confidence - a.confidence)
    .forEach(translation => {
      if (translation.type !== 'section_header') { // Already handled above
        translatedText = translatedText.replace(
          new RegExp(escapeRegExp(translation.original), 'g'),
          translation.translated
        );
      }
    });
  
  return {
    originalText,
    translatedText,
    translations
  };
}

/**
 * Helper function to escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Identify and replace common gibberish patterns in PDF text
 */
export function improveGibberishText(text: string): string {
  if (!text || text.length < 10) return text;
  
  // Remove common gibberish artifacts
  let improved = text
    // Remove gibberish symbols often found in PDFs
    .replace(/[\[\]^_#@&{}~`]/g, ' ')
    // Convert strange character sequences to spaces
    .replace(/[A-Z]\s[A-Z]\s[A-Z]\s[A-Z]/g, ' ')
    // Clean up whitespace
    .replace(/\s+/g, ' ');
  
  // Apply pattern translations
  const { translatedText } = translateGibberishPatterns(improved);
  improved = translatedText;
  
  // Special transformations for common gibberish patterns
  
  // Transform "F N A M E" style text to "FNAME"
  improved = improved.replace(/(?:^|\s)([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])(?:\s|$)/g, 
    (_, a, b, c, d, e) => ` ${a}${b}${c}${d}${e} `);
  
  // Transform "L A S T N A M E" style text to "LASTNAME"
  improved = improved.replace(/(?:^|\s)([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])(?:\s|$)/g,
    (_, a, b, c, d, e, f, g, h) => ` ${a}${b}${c}${d}${e}${f}${g}${h} `);
  
  return improved.trim();
}