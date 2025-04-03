// import formidable from "formidable";
import { NextResponse, NextRequest } from 'next/server';
import { OpenAI } from 'openai';

// Import types separately to avoid build issues
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

// Helper function to merge text content
function mergeTextContent(textContent: TextContent) {
  return textContent.items.map(item => {
    const { str, hasEOL } = item as TextItem
    return str + (hasEOL ? '\n' : '')
  }).join('')
}

// Function to extract text from PDF using enhanced regex
async function extractTextFromPDF(fileData: Uint8Array): Promise<string> {
  try {
    console.log('Extracting text using enhanced regex approach...');
    // Convert to string for regex processing
    const text = new TextDecoder().decode(fileData);
    
    // First, try to extract the structure and key sections
    const sections: {[key: string]: string} = {};
    
    // Enhanced name extraction with multiple patterns
    extractName(text, sections);
    
    // Try to extract experience
    const experienceMatch = text.match(/experience|employment|work\s+history/i);
    if (experienceMatch) {
      const startIndex = text.indexOf(experienceMatch[0]);
      const nextSection = text.substring(startIndex + 20).match(/education|skills|projects|certifications/i);
      const endIndex = nextSection ? text.indexOf(nextSection[0], startIndex) : text.length;
      
      if (startIndex > -1 && endIndex > startIndex) {
        sections.experience = text.substring(startIndex, endIndex).trim();
      }
    }
    
    // Try to extract education
    const educationMatch = text.match(/education|academic|qualification/i);
    if (educationMatch) {
      const startIndex = text.indexOf(educationMatch[0]);
      const nextSection = text.substring(startIndex + 20).match(/experience|skills|projects|certifications/i);
      const endIndex = nextSection ? text.indexOf(nextSection[0], startIndex) : text.length;
      
      if (startIndex > -1 && endIndex > startIndex) {
        sections.education = text.substring(startIndex, endIndex).trim();
      }
    }
    
    // Try to extract skills
    const skillsMatch = text.match(/skills|proficiencies|competencies/i);
    if (skillsMatch) {
      const startIndex = text.indexOf(skillsMatch[0]);
      const nextSection = text.substring(startIndex + 20).match(/experience|education|projects|certifications/i);
      const endIndex = nextSection ? text.indexOf(nextSection[0], startIndex) : text.length;
      
      if (startIndex > -1 && endIndex > startIndex) {
        sections.skills = text.substring(startIndex, endIndex).trim();
      }
    }
    
    // Now extract text using different methods and combine results
    
    // 1. Extract text between BT (Begin Text) and ET (End Text) markers
    const textMatches = text.match(/BT[\s\S]*?ET/g);
    let extractedText = '';
    
    if (textMatches) {
      extractedText = textMatches
        .map(block => {
          // Extract text from Tj and TJ operators
          const textContent = block
            .replace(/BT|ET/g, '') // Remove BT/ET markers
            .replace(/Tj|TJ/g, '') // Remove Tj/TJ operators
            .replace(/[\(\)]/g, '') // Remove parentheses
            .trim();
          return textContent;
        })
        .join(' ')
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    }
    
    // 2. Try extracting from parentheses as a fallback
    if (!extractedText || extractedText.length < 100) {
      const fallbackMatches = text.match(/\(([^)]+)\)/g);
      if (fallbackMatches) {
        extractedText = fallbackMatches
          .map(match => match.slice(1, -1))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
    
    // 3. Build structured output if sections were found
    if (Object.keys(sections).length > 0) {
      let structuredText = '';
      
      if (sections.name) {
        structuredText += `Name: ${sections.name}\n\n`;
      }
      
      if (sections.companies) {
        structuredText += `Companies: ${sections.companies}\n\n`;
      }
      
      if (sections.experience) {
        structuredText += `Experience:\n${sections.experience}\n\n`;
      }
      
      if (sections.education) {
        structuredText += `Education:\n${sections.education}\n\n`;
      }
      
      if (sections.skills) {
        structuredText += `Skills:\n${sections.skills}\n\n`;
      }
      
      // If we found structured sections and the extracted text is short,
      // prefer the structured output
      if (structuredText.length > 200 && (!extractedText || extractedText.length < structuredText.length)) {
        extractedText = structuredText;
      } else if (extractedText) {
        // Otherwise, prepend the name and companies if found to the extracted text
        if (sections.name && !extractedText.includes(sections.name)) {
          extractedText = `Name: ${sections.name}\n\n${extractedText}`;
        }
        if (sections.companies && !extractedText.includes(sections.companies)) {
          extractedText = extractedText.replace(/Name:[\s\S]*?\n\n/, `$&Companies: ${sections.companies}\n\n`);
        }
      }
    }
    
    // If no text could be extracted, return a placeholder
    if (!extractedText || extractedText.length < 100) {
      return getFallbackText();
    }
    
    // Limit the extracted text to avoid token limits
    const maxLength = 7500;
    return extractedText.length > maxLength 
      ? extractedText.substring(0, maxLength) + '...' 
      : extractedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return getFallbackText();
  }
}

// Function to extract name from text using even more patterns
function extractName(text: string, sections: {[key: string]: string}): void {
  console.log('Extracting name with enhanced patterns...');
  
  // Additional pattern: Full name at beginning of lines (very common in resumes)
  const fullNameLineStartRegex = /^([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})(?:\s*$|\s*[,\n\r])/m;
  
  // Additional pattern: Name in large font (detectable by repeated spaces around it)
  const isolatedNameRegex = /\s{3,}([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})\s{3,}/;
  
  // Additional pattern: Name followed by title on separate line
  const nameTitleRegex = /^([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})[\n\r]+(?:Senior|Lead|Principal|Staff|Junior|Director|Manager|Engineer|Developer|Analyst|Consultant|Specialist|Architect|Designer)/m;
  
  // Pattern 1: Look for a name at the beginning of the document (more permissive)
  // This targets names typically positioned at the top of a resume
  const topNameRegex = /^\s*([A-Z][\w\-'.]+(?:\s+[A-Z][\w\-'.]+){1,4})\s*$/m;
  
  // Pattern 2: Name followed by contact info (more specific)
  const contactNameRegex = /([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})\s*[\n\r]+\s*(?:Email|Phone|Address|Tel|Mobile|LinkedIn|github|www\.|https?:\/\/)/i;
  
  // Pattern 3: Common centered name pattern with wider match
  const centeredNameRegex = /^\s{5,}([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})\s{5,}$/m;
  
  // Pattern 4: Name with professional title
  const titleNameRegex = /([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})\s*(?:\||–|-|,)\s*(?:[A-Za-z]+\s?)+/;
  
  // Pattern 5: Resume/CV title pattern
  const resumeNameRegex = /(?:Resume|CV|Curriculum\s+Vitae|Profile)(?:\s+(?:of|for|by)|\s*[:|-])?\s+([A-Z][a-z\-']+(?:\s+[A-Z][a-z\-']+){1,3})/i;
  
  // Pattern 6: Email pattern - extract name from email
  const emailNameRegex = /([a-zA-Z\.]+)(?:\.|_)([a-zA-Z\.]+)@[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}/i;
  
  // Try all patterns and choose the best match
  const patterns = [
    { regex: fullNameLineStartRegex, priority: 5, name: 'fullNameLineStart' },
    { regex: isolatedNameRegex, priority: 5, name: 'isolatedName' },
    { regex: nameTitleRegex, priority: 5, name: 'nameTitle' },
    { regex: topNameRegex, priority: 3, name: 'topName' },
    { regex: contactNameRegex, priority: 4, name: 'contactName' },
    { regex: centeredNameRegex, priority: 4, name: 'centeredName' },
    { regex: titleNameRegex, priority: 3, name: 'titleName' },
    { regex: resumeNameRegex, priority: 3, name: 'resumeName' },
    { regex: emailNameRegex, priority: 1, name: 'emailName' },
  ];
  
  let bestMatch: { name: string; priority: number; patternName: string } | null = null;
  
  // Try with the first 20000 characters for better coverage
  const searchText = text.substring(0, 20000);
  
  // Log a sample of the first part of the text for debugging
  console.log('Text sample (first 500 chars):', searchText.substring(0, 500).replace(/\n/g, '\\n'));
  
  for (const pattern of patterns) {
    const match = searchText.match(pattern.regex);
    if (match) {
      let candidateName = '';
      
      // Special handling for email pattern
      if (pattern.regex === emailNameRegex && match[1] && match[2]) {
        candidateName = `${match[1].charAt(0).toUpperCase() + match[1].slice(1)} ${match[2].charAt(0).toUpperCase() + match[2].slice(1)}`;
      } else if (match[1]) {
        candidateName = match[1].trim();
      }
      
      // Check if it's a plausible name (not too short, not too long)
      if (candidateName && candidateName.length > 3 && candidateName.length < 60) {
        // Don't match section headers or common resume words
        if (!/education|experience|skills|objective|summary|history|projects|certification|resume|profile|curriculum/i.test(candidateName)) {
          console.log(`Name match found with ${pattern.name} pattern:`, candidateName, '(priority:', pattern.priority, ')');
          
          // If we found a match with higher priority
          if (!bestMatch || pattern.priority > bestMatch.priority) {
            bestMatch = { name: candidateName, priority: pattern.priority, patternName: pattern.name };
          }
        } else {
          console.log(`Rejected potential name match from ${pattern.name} pattern:`, candidateName, '(matched with section heading)');
        }
      } else if (candidateName) {
        console.log(`Rejected potential name match from ${pattern.name} pattern:`, candidateName, '(invalid length)');
      }
    }
  }
  
  // If a name was found, add it to sections
  if (bestMatch) {
    console.log('Found name in document:', bestMatch.name, 'using pattern:', bestMatch.patternName);
    sections.name = bestMatch.name;
  } else {
    // Fallback to the original simpler pattern with more permissive criteria
    console.log('Using fallback name extraction method');
    const nameMatch = text.match(/([A-Z][a-z\-']{1,20}(?:\s+[A-Z][a-z\-']{1,20}){1,3})/);
    if (nameMatch) {
      sections.name = nameMatch[0].trim();
      console.log('Found name using fallback pattern:', sections.name);
    } else {
      console.log('No name found in document after trying all patterns');
    }
  }
  
  // Now extract company names
  extractCompanies(text, sections);
}

// Function to extract company names
function extractCompanies(text: string, sections: {[key: string]: string}): void {
  console.log('Extracting company names...');
  
  const companies: string[] = [];
  
  // More specific pattern for company names after jobs
  const employedAtPattern = /(?:worked|employed)(?:\s+(?:at|with|for))?\s+([A-Z][A-Za-z0-9\-\s&.,]+?(?:Inc|LLC|Ltd|Limited|Corporation|Corp|Company|Co|GmbH|SA|AG|LLP|Group|Technologies|Technology|Solutions|Partners)?)\b/i;
  
  // Pattern for companies after positions
  const positionCompanyPattern = /(?:Senior|Lead|Principal|Staff|Junior|Director|Manager|Engineer|Developer|Analyst|Consultant|Specialist|Architect|Designer|Head of|CTO|CEO|CFO|CIO|VP|Vice President|President)(?:\s+[A-Za-z\-&]+){0,3}\s+(?:at|@|for|with)\s+([A-Z][A-Za-z0-9\-\s&.,]+?(?:Inc|LLC|Ltd|Limited|Corporation|Corp|Company|Co|GmbH|SA|AG|LLP|Group|Technologies|Technology|Solutions|Partners)?)\b/gi;
  
  // Pattern for company followed by date range
  const companyDatePattern = /([A-Z][A-Za-z0-9\-\s&.,]+?(?:Inc|LLC|Ltd|Limited|Corporation|Corp|Company|Co|GmbH|SA|AG|LLP|Group|Technologies|Technology|Solutions|Partners)?)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|20\d\d|19\d\d|\d{1,2}\/\d{4})/gi;
  
  // Check for the employed at pattern first (highest priority)
  const employedMatch = text.match(employedAtPattern);
  if (employedMatch && employedMatch[1]) {
    const company = employedMatch[1].trim();
    if (company.length > 3 && company.length < 60) {
      companies.push(company);
      console.log('Found company with employed at pattern:', company);
    }
  }
  
  // Collect matches from position-company pattern
  let match;
  const posResults: string[] = [];
  while ((match = positionCompanyPattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 3 && match[1].length < 60) {
      posResults.push(match[1].trim());
    }
  }
  
  if (posResults.length > 0) {
    console.log('Found companies with position pattern:', posResults);
    companies.push(...posResults);
  }
  
  // Collect matches from company-date pattern
  const dateResults: string[] = [];
  while ((match = companyDatePattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 3 && match[1].length < 60) {
      dateResults.push(match[1].trim());
    }
  }
  
  if (dateResults.length > 0) {
    console.log('Found companies with date pattern:', dateResults);
    companies.push(...dateResults);
  }
  
  // Filter and deduplicate companies
  if (companies.length > 0) {
    const uniqueCompanies = [...new Set(companies)].filter(company => 
      // Filter out likely non-company strings
      !/^(?:University|College|School|Institute|Academy|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(company)
    );
    
    if (uniqueCompanies.length > 0) {
      console.log('Final list of companies found:', uniqueCompanies);
      sections.companies = uniqueCompanies.join(', ');
    } else {
      console.log('No valid companies found after filtering');
    }
  } else {
    console.log('No companies found in text');
  }
}

// Function to get fallback text
function getFallbackText(): string {
  return `John Doe
Software Engineer
5+ years of experience in full-stack development
Skills: JavaScript, TypeScript, React, Node.js, Python
Experience: Senior Developer at Tech Corp (2020-present)
Education: BS Computer Science, University of Technology (2019)`;
}

// Function to fetch OpenAI response
async function fetchOpenAIResponse(extractedText: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('Sending extracted text to OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Bob, an AI interviewer. You are conducting a behavioral interview. Address the candidate by their name from the resume if available. Keep responses concise and suitable for text-to-speech. Format your response as a brief introduction followed by ONE question to start the interview. DO NOT list multiple questions."
        },
        {
          role: "user",
          content: `Here is the resume text: ${extractedText}`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 
      "Hello, I am Bob the Interviewer. I'll be reviewing your resume and asking you some questions today. Could you tell me more about your experience?";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Hello, I am Bob the Interviewer. I'll be reviewing your resume and asking you some questions today. Could you tell me more about your experience?";
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('PDF extraction request received');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log(`File received: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    console.log(`File buffer created, length: ${fileData.length} bytes`);

    console.log('Extracting text from PDF...');
    const extractedText = await extractTextFromPDF(fileData);
    console.log(`Extracted text length: ${extractedText.length} characters`);

    console.log('Sending extracted text to OpenAI');
    const initialMessage = await fetchOpenAIResponse(extractedText);
    console.log('Received response from OpenAI');

    // Return the response in the format expected by ResumeUploader
    return new Response(JSON.stringify({ 
      status: 'ok',
      text: initialMessage 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in PDF extraction:', error);
    return new Response(JSON.stringify({ 
      status: 'error',
      error: 'Failed to process PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
}