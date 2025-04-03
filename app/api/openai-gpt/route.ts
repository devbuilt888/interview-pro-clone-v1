import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Define message interface for type safety
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Interface for extracted resume sections
interface ParsedResume {
  name: string | null;
  sections: string[];
  experience: string[];
  education: string[];
  skills: string[];
  hasContactInfo: boolean;
}

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Helper function to parse resume sections for better prompting
function parseResumeContent(content: string): ParsedResume {
  const result: ParsedResume = {
    name: null,
    sections: [],
    experience: [],
    education: [],
    skills: [],
    hasContactInfo: false
  };
  
  // Check if content is using the section markers
  const isMarkedContent = content.includes('--- RESUME START ---') && content.includes('--- RESUME END ---');
  
  if (isMarkedContent) {
    // Extract just the resume portion
    const startMarker = content.indexOf('--- RESUME START ---') + '--- RESUME START ---'.length;
    const endMarker = content.indexOf('--- RESUME END ---');
    content = content.substring(startMarker, endMarker).trim();
  }
  
  // Identify key sections
  if (content.includes('Name:')) {
    const nameMatch = content.match(/Name:\s*([^\n]+)/);
    if (nameMatch && nameMatch[1]) {
      result.name = nameMatch[1].trim();
      result.sections.push('Name');
    }
  }
  
  if (content.includes('Contact Information:')) {
    result.hasContactInfo = true;
    result.sections.push('Contact Information');
  }
  
  if (content.includes('Experience:')) {
    result.sections.push('Experience');
    
    // Try to extract experience details
    const expStart = content.indexOf('Experience:') + 'Experience:'.length;
    let expEnd = content.length;
    
    // Find the next section after experience
    const nextSections = ['Education:', 'Skills:', 'Summary:'];
    for (const section of nextSections) {
      const sectionIndex = content.indexOf(section, expStart);
      if (sectionIndex !== -1 && sectionIndex < expEnd) {
        expEnd = sectionIndex;
      }
    }
    
    const experienceText = content.substring(expStart, expEnd).trim();
    
    // Split experience into bullet points or paragraphs
    const expItems = experienceText.split(/\n\s*\n/).filter(item => item.trim().length > 0);
    result.experience = expItems.map(item => item.trim());
  }
  
  if (content.includes('Education:')) {
    result.sections.push('Education');
    
    // Extract education details
    const eduStart = content.indexOf('Education:') + 'Education:'.length;
    let eduEnd = content.length;
    
    // Find the next section after education
    const nextSections = ['Experience:', 'Skills:', 'Summary:'];
    for (const section of nextSections) {
      const sectionIndex = content.indexOf(section, eduStart);
      if (sectionIndex !== -1 && sectionIndex < eduEnd) {
        eduEnd = sectionIndex;
      }
    }
    
    const educationText = content.substring(eduStart, eduEnd).trim();
    result.education = educationText.split(/\n\s*\n/).filter(item => item.trim().length > 0);
  }
  
  if (content.includes('Skills:')) {
    result.sections.push('Skills');
    
    // Extract skills details
    const skillsStart = content.indexOf('Skills:') + 'Skills:'.length;
    let skillsEnd = content.length;
    
    // Find the next section after skills
    const nextSections = ['Experience:', 'Education:', 'Summary:'];
    for (const section of nextSections) {
      const sectionIndex = content.indexOf(section, skillsStart);
      if (sectionIndex !== -1 && sectionIndex < skillsEnd) {
        skillsEnd = sectionIndex;
      }
    }
    
    const skillsText = content.substring(skillsStart, skillsEnd).trim();
    result.skills = skillsText.split(/[,;•]/).map(skill => skill.trim()).filter(skill => skill.length > 0);
  }
  
  if (content.includes('Summary:')) {
    result.sections.push('Summary');
  }
  
  return result;
}

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: ChatMessage[] };

  // If this is the first message (system message), just echo it back
  // This handles the initial message from PDF extraction
  if (messages.length === 1 && messages[0].role === 'system') {
    // Log what we're receiving from the resume extraction
    console.log('Received initial resume data from extraction. First 100 chars:');
    console.log(messages[0].content.substring(0, 100) + '...');
    
    // Parse resume sections for better logging
    const parsedResume = parseResumeContent(messages[0].content);
    console.log(`Resume data details:
      - Name: ${parsedResume.name || 'Not found'}
      - Sections detected: ${parsedResume.sections.join(', ') || 'None'}
      - Experience items: ${parsedResume.experience.length}
      - Education items: ${parsedResume.education.length}
      - Skills count: ${parsedResume.skills.length}
    `);
    
    return new StreamingTextResponse(new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(messages[0].content));
        controller.close();
      }
    }));
  }

  // For normal conversation, send messages to OpenAI
  try {
    console.log(`Processing chat message ${messages.length - 1} in conversation`);
    
    // Create a system message that incorporates the resume data if available
    let systemMessage: ChatMessage = {
      role: 'system',
      content: `You are Bob, an AI interviewer conducting a behavioral interview. 
      Ask questions based on the user's resume and experience. 
      Try to ask about several previous jobs and experiences, listed in the user's resume.
      Keep your responses concise and suitable for text-to-speech processing.
      Ask one question at a time and wait for the user's response.
      After the user responds, provide feedback and ask the next question.
      If the user seems to be joking or not taking the interview seriously, acknowledge it and then move on to the next question.
      After the interview, provide a summary of the interview and the user's strengths and weaknesses, but don't give the strenghts and weaknesses as a numbered list, instead as a short paragraph for each
      After the interview give a score out of 100, and a short paragraph explaining the score. The last sentence after the score should be "Thank you for your time, have a great day!" and should only be repeated once in the whole conversation, at the end of the interview.
      `
    };
    
    // Find the resume data in previous messages (if any)
    const resumeData = messages.find((msg: ChatMessage) => 
      msg.role === 'system' && 
      (msg.content.includes('Name:') || msg.content.includes('Experience:') || msg.content.includes('Education:'))
    );
    
    // If we have resume data, enhance the system message
    if (resumeData) {
      // Parse resume to understand its structure
      const parsedResume = parseResumeContent(resumeData.content);
      
      // Create a more targeted system message based on resume content
      let enhancedInstruction = `\n\nHere is the candidate's resume information. Use this to ask specific questions:`;
      
      // Add personalized instructions based on what was found
      if (parsedResume.name) {
        enhancedInstruction += `\n- Address the candidate by their name: ${parsedResume.name}`;
      }
      
      if (parsedResume.experience.length > 0) {
        enhancedInstruction += `\n- Ask specific questions about these experiences:`;
        // Only include up to 3 experiences to avoid overly long prompts
        const topExperiences = parsedResume.experience.slice(0, 3);
        topExperiences.forEach((exp, i) => {
          // Only include first 150 chars of each experience
          enhancedInstruction += `\n  ${i+1}. ${exp.substring(0, 150)}${exp.length > 150 ? '...' : ''}`;
        });
      }
      
      if (parsedResume.skills.length > 0) {
        enhancedInstruction += `\n- Inquire about these key skills: ${parsedResume.skills.slice(0, 10).join(', ')}`;
      }
      
      if (parsedResume.education.length > 0) {
        enhancedInstruction += `\n- Consider asking about their educational background`;
      }
      
      // Add the resume data after the enhanced instructions
      systemMessage.content += enhancedInstruction + `\n\nFull resume data:\n${resumeData.content.substring(0, 1500)}`;
      
      console.log('Enhanced system message with structured resume data');
    } else {
      console.log('No resume data found in messages');
    }
    
    // Filter out the resume data message from what we send to OpenAI to avoid duplication
    const filteredMessages = messages.filter((msg: ChatMessage) => 
      !(msg.role === 'system' && msg !== systemMessage)
    );
    
    console.log(`Sending ${filteredMessages.length} messages to OpenAI (${filteredMessages.filter(m => m.role === 'user').length} user messages)`);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage,
        ...filteredMessages.filter((msg: ChatMessage) => msg.role !== 'system')
      ],
      stream: true,
    });

    // Create a stream of the response
    const stream = OpenAIStream(response, {
      onCompletion: async (completion: string) => {
        // The completion is the full response
        console.log('Stream completed, response length:', completion.length);
        
        // Check if the interview is potentially ending
        if (completion.includes('Thank you for your time') || completion.includes('score out of 100')) {
          console.log('Interview appears to be concluding');
        }
      },
      onToken: async (token: string) => {
        // We don't need to log every token, as it creates too much noise
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}