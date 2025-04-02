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
    
    // Look for common resume section headers
    const nameMatch = text.match(/([A-Z][a-z]+\s+[A-Z][a-z]+|[A-Z]+\s+[A-Z][a-z]+)/);
    if (nameMatch) {
      sections.name = nameMatch[0].trim();
      console.log('Found name:', sections.name);
    }
    
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
        // Otherwise, prepend the name if found to the extracted text
        if (sections.name && !extractedText.includes(sections.name)) {
          extractedText = `Name: ${sections.name}\n\n${extractedText}`;
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