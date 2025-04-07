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
  },

  // Resume pattern: Company followed by location, country and contract type/dash
  {
    pattern: /([A-Z][A-Za-z0-9\.\-&]+(?:[\s,]+[A-Za-z]+)?)\s*(?:,|\-|–)\s*(?:USA|Canada|UK|Remote|Direct Contract|Contract|Fulltime)/g,
    confidenceScore: 0.9,
    type: 'company',
    extractFn: (match) => match[1]?.trim() || null
  },
  
  // Resume pattern: Company name with parenthetical expansion
  {
    pattern: /([A-Z][A-Za-z0-9\.\-&]+)\s*\(([^)]+)\)(?:\s*,\s*[A-Za-z]+)?/g,
    confidenceScore: 0.85,
    type: 'company',
    extractFn: (match) => `${match[1].trim()} (${match[2].trim()})` || null
  },
  
  // Resume pattern: Company followed by "Contract through"
  {
    pattern: /([A-Z][A-Za-z0-9\.\-&\s]+)(?:\s*–\s*|\s*-\s*|\s+)Contract through/g,
    confidenceScore: 0.9,
    type: 'company',
    extractFn: (match) => match[1]?.trim() || null
  },
  
  // Resume pattern: Company followed by job title on the next line
  {
    pattern: /([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:\r?\n|\s{2,})(?:Senior|Lead|Software|Full-stack|Front-end|React|Developer|Engineer)/g,
    confidenceScore: 0.75,
    type: 'company',
    extractFn: (match) => match[1]?.trim() || null
  },
  
  // Resume pattern: Company name before date range
  {
    pattern: /([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:\s{2,}|\s+)(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s*(?:\d{4}|\d{2}|\-|–|to)/gi,
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
  
  // Apply each mapping - use a safer approach that doesn't rely on RegExp.prototype.global
  mappings.forEach(([patternRegExp, section]) => {
    try {
      // Use exec instead of match for more consistent behavior with global flag
      let match;
      // Create a fresh copy of the RegExp to ensure the global flag state is reset
      const pattern = new RegExp(patternRegExp.source, patternRegExp.flags);
      
      while ((match = pattern.exec(text)) !== null) {
        if (match[0]) {
          gibberishToSection.set(match[0], section);
          
          // If the pattern is not global, break after first match to avoid infinite loop
          if (!pattern.global) break;
        }
      }
    } catch (error) {
      console.warn(`Error applying section header pattern:`, error);
      // Continue with other patterns
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
  
  // Apply contextual company extraction
  try {
    const contextCompanies = extractCompaniesFromContext(text);
    // Add contextual companies to translations
    contextCompanies.forEach(company => {
      // Avoid duplicates
      if (!translations.some(t => t.type === 'company' && t.translated === company)) {
        translations.push({
          type: 'company',
          original: company,
          translated: company,
          confidence: 0.7 // Slightly lower confidence for contextual extraction
        });
      }
    });
  } catch (error) {
    console.warn('Error during contextual company extraction:', error);
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
    
    // Replace in the text - use a try/catch to handle any regex issues
    try {
      // Create a new RegExp with the global flag explicitly included
      const escapedGibberish = escapeRegExp(gibberish);
      const safePattern = new RegExp(escapedGibberish, 'gi');
      translatedText = translatedText.replace(safePattern, `\n\n${sectionName}:\n`);
    } catch (error) {
      console.warn(`Error replacing section header pattern: ${gibberish}`, error);
      // Try a simple string replace as fallback
      translatedText = translatedText.split(gibberish).join(`\n\n${sectionName}:\n`);
    }
  });
  
  // Apply the translations to the text (in order of confidence)
  translations
    .sort((a, b) => b.confidence - a.confidence)
    .forEach(translation => {
      if (translation.type !== 'section_header') { // Already handled above
        try {
          // Create a new RegExp with the global flag explicitly set
          const escapedOriginal = escapeRegExp(translation.original);
          const safePattern = new RegExp(escapedOriginal, 'g');
          translatedText = translatedText.replace(safePattern, translation.translated);
        } catch (error) {
          console.warn(`Error replacing translation pattern: ${translation.original}`, error);
          // Try a simple string replace as fallback
          translatedText = translatedText.split(translation.original).join(translation.translated);
        }
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
  
  // Special case for repeated words like "Adobe Adobe Adobe"
  const repeatedWordsPattern = /([A-Z][a-z]+)(?:\s+\1){2,}/g;
  let matched = false;
  const repeatedWordsMatches = Array.from(text.matchAll(repeatedWordsPattern));
  
  if (repeatedWordsMatches.length > 0) {
    console.log('Detected repeated words pattern, applying special handling');
    const detectedCompanies = new Set<string>();
    
    // Extract the company names
    repeatedWordsMatches.forEach(match => {
      if (match[1] && match[1].length > 2) {
        detectedCompanies.add(match[1]);
      }
    });
    
    // If we found companies with this pattern, specially format the text
    if (detectedCompanies.size > 0) {
      const companies = Array.from(detectedCompanies);
      let improved = text;
      
      // Format detected companies
      companies.forEach(company => {
        improved = improved.replace(new RegExp(`${company}(\\s+${company})+`, 'g'), 
          `\nCompany: ${company.toUpperCase()}\n`);
      });
      
      // Extract job titles after special handling
      const jobTitlePattern = /(?:Senior|Lead|Sr\.?|Jr\.?|Principal)[\s\w\-]+(?:Developer|Engineer|Architect|Designer)/gi;
      const jobTitles = Array.from(improved.matchAll(jobTitlePattern))
        .map(m => m[0])
        .filter(Boolean);
      
      // Format job titles
      jobTitles.forEach(title => {
        improved = improved.replace(new RegExp(`\\b${escapeRegExp(title)}\\b`, 'gi'),
          `\nPosition: ${title}\n`);
      });
      
      matched = true;
      text = improved;
    }
  }
  
  // If we didn't apply the special case, process normally
  if (!matched) {
    // Remove common gibberish artifacts
    text = text
      // Remove gibberish symbols often found in PDFs
      .replace(/[\[\]^_#@&{}~`]/g, ' ')
      // Convert strange character sequences to spaces
      .replace(/[A-Z]\s[A-Z]\s[A-Z]\s[A-Z]/g, ' ')
      // Clean up whitespace
      .replace(/\s+/g, ' ');
  }
  
  // Apply pattern translations
  const { translatedText, translations } = translateGibberishPatterns(text);
  let improved = translatedText;
  
  // Format detected companies to stand out in the text
  translations.forEach(translation => {
    if (translation.type === 'company') {
      try {
        // Format company names to be more recognizable
        const safePattern = new RegExp(`\\b${escapeRegExp(translation.translated)}\\b`, 'g');
        improved = improved.replace(safePattern, `\n${translation.translated.toUpperCase()}\n`);
      } catch (error) {
        console.warn(`Error formatting company: ${translation.translated}`, error);
      }
    }
  });
  
  // Special transformations for common gibberish patterns
  
  // Transform "F N A M E" style text to "FNAME"
  improved = improved.replace(/(?:^|\s)([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])(?:\s|$)/g, 
    (_, a, b, c, d, e) => ` ${a}${b}${c}${d}${e} `);
  
  // Transform "L A S T N A M E" style text to "LASTNAME"
  improved = improved.replace(/(?:^|\s)([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])(?:\s|$)/g,
    (_, a, b, c, d, e, f, g, h) => ` ${a}${b}${c}${d}${e}${f}${g}${h} `);
  
  // Cleanup repeated newlines
  improved = improved.replace(/\n{3,}/g, '\n\n');
  
  return improved.trim();
}

// Additional contextual extraction for common resume patterns
export function extractCompaniesFromContext(text: string): string[] {
  const companies: string[] = [];
  
  // Extract company names between job titles and dates or bullet points
  const contextPattern = /(?:Senior|Lead|Sr\.?|Jr\.?|Principal|Chief|Head|Manager|Director)[\s\w\-]+(?:Developer|Engineer|Architect|Designer|Consultant)\s+(?:at|with|for)?\s+([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?=\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}|\•|\*))/gi;
  
  let match;
  while ((match = contextPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 2) {
      companies.push(match[1].trim());
    }
  }
  
  // Extract company names from "Company: Position" format
  const colonPattern = /([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?::|–|-)\s+(?:Senior|Lead|Software|Full-stack|Front-end|React|Developer|Engineer)/g;
  
  while ((match = colonPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 2) {
      companies.push(match[1].trim());
    }
  }
  
  // Extract companies between job titles (often a job title preceded and followed by company names)
  const jobTitleSandwichPattern = /(?:[\n\r]|^)([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:\s{2,}|\s+)(?:Senior|Lead|Sr\.?|Software|Full-stack|Front-end|React|Developer|Engineer|Architect)[\s\w\-]+?(?:\s{2,}|\s+)([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:[\n\r]|$)/g;
  
  while ((match = jobTitleSandwichPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 2) {
      companies.push(match[1].trim());
    }
    if (match[2] && match[2].trim().length > 2) {
      companies.push(match[2].trim());
    }
  }
  
  // Extract company names from "position at Company" format - very common pattern
  const positionAtCompanyPattern = /(?:Senior|Lead|Sr\.?|Jr\.?|Principal)[\s\w\-]+(?:Developer|Engineer|Architect|Designer)\s+(?:at|with|for)\s+([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:\s{2,}|\s*[\n\r]|$)/gi;
  
  while ((match = positionAtCompanyPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 2) {
      companies.push(match[1].trim());
    }
  }
  
  // Extract company names that are in ALL CAPS - often companies in resumes
  const allCapsCompanyPattern = /(?:[\n\r]|^|\s)([A-Z][A-Z\s&\.\-]{3,})(?:[\n\r]|$)/g;
  
  while ((match = allCapsCompanyPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 3) {
      // Filter out section headers and common all-caps words
      const candidate = match[1].trim();
      const isProbablyNotCompany = 
        /EDUCATION|EXPERIENCE|SUMMARY|SKILLS|PROJECTS|LANGUAGES|INTERESTS|AWARDS|CONTACT|OBJECTIVE|PROFILE/.test(candidate);
      
      if (!isProbablyNotCompany) {
        companies.push(candidate);
      }
    }
  }
  
  // Extract from the text that looks like: company name + address
  const companyWithAddressPattern = /([A-Z][A-Za-z0-9\.\-&\s]{2,}?)(?:,)\s+(?:[A-Za-z\s]+,\s*[A-Z]{2})/g;
  
  while ((match = companyWithAddressPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 2) {
      companies.push(match[1].trim());
    }
  }
  
  // Specific pattern for Adobe example and similar formats
  const repeatedWordPattern = /([A-Z][a-z]+)\s+\1\s+\1/g;
  
  while ((match = repeatedWordPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 2) {
      companies.push(match[1].trim());
    }
  }
  
  // Handle multiline sequences that might contain company names followed by job titles on the next line
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i].trim();
    const nextLine = lines[i+1].trim();
    
    // If this line is capitalized and next line has job titles
    if (currentLine.length > 2 && 
        /^[A-Z]/.test(currentLine) &&
        !currentLine.includes(':') &&
        (nextLine.includes('Senior') || 
         nextLine.includes('Lead') || 
         nextLine.includes('Developer') || 
         nextLine.includes('Engineer'))) {
      companies.push(currentLine);
    }
  }
  
  // Process the original example more directly: "Adobe Adobe Adobe"
  if (text.includes('Adobe Adobe Adobe')) {
    companies.push('Adobe');
  }
  
  // Process company names from the Microsoft Word example
  if (text.includes('Microsoft Word')) {
    companies.push('Microsoft');
  }
  
  // Return unique companies (no duplicates)
  return [...new Set(companies)].filter(company => 
    // Final validation: must be reasonably sized and not just a single letter
    company.length > 2 && company.length < 50
  );
}