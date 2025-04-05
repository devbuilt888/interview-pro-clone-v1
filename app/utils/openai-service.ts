/**
 * OpenAI Service
 * 
 * This module provides integration with OpenAI API for generating
 * personalized interview questions based on resume data.
 */

import { OpenAI } from 'openai';
import { ResumeData } from './resume-types';
import { getFallbackResumeText, prepareResumeForOpenAI } from './resume-parser';

// Define OpenAI client configuration
const DEFAULT_MODEL = 'gpt-3.5-turbo-16k';
const DEFAULT_TEMPERATURE = 0.6;

/**
 * Create an OpenAI client
 */
function createOpenAIClient(): OpenAI {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key. Please set OPENAI_API_KEY environment variable.');
  }
  
  // Create and return OpenAI client
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Generate a system prompt for the interview based on resume data
 */
function createSystemPrompt(formattedResume: string): string {
  return `You are "Bob the Interview Bot", a friendly but professional AI interviewer, designed to help users practice for job interviews.

You will conduct a behavioral interview based on the following resume. Your goal is to help the candidate get better at interviews by asking common behavioral questions relevant to their experience.

${formattedResume}

- Ask one question at a time, and wait for the user's response.
- Focus on asking behavioral questions related to the candidate's experiences and skills.
- Use the STAR (Situation, Task, Action, Result) framework as a basis for your questions.
- Start with a friendly introduction, then proceed with the interview.
- Ask follow-up questions when appropriate.
- After about 5-6 questions, end the interview with positive feedback.
- Focus on helping the user improve their interview skills.`;
}

/**
 * Generate initial greeting from OpenAI based on the resume
 */
export async function fetchOpenAIResponse(resumeText: string): Promise<string> {
  try {
    console.log('Generating initial greeting with OpenAI...');
    
    // Create OpenAI client
    const openai = createOpenAIClient();
    
    // Use placeholder resume if none provided
    if (!resumeText || resumeText.trim().length < 50) {
      console.warn('Insufficient resume text, using fallback');
      resumeText = getFallbackResumeText();
    }
    
    // Build system prompt
    const systemPrompt = createSystemPrompt(resumeText);
    
    // Request initial greeting from OpenAI
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "I'm ready to start the interview." }
      ]
    });
    
    // Extract response text
    const responseText = completion.choices[0]?.message?.content || 
      "Hello! I'm Bob, your interview practice bot. Let's start with a question about your background. Can you tell me about a challenging project you worked on recently?";
    
    console.log('Generated greeting from OpenAI');
    
    return responseText;
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    
    // Provide a fallback response if OpenAI fails
    return "Hello! I'm Bob, your interview practice bot. I'll be asking you some behavioral interview questions to help you prepare. Let's begin: Tell me about a time when you faced a challenging situation at work. How did you handle it?";
  }
}

/**
 * Generate an initial greeting with the resume data
 */
export async function generateInitialGreeting(resumeData: ResumeData): Promise<string> {
  try {
    // Prepare formatted resume
    const formattedResume = prepareResumeForOpenAI(resumeData, {
      includeSectionMarkers: true,
      maxLength: 7500
    });
    
    // Get greeting from OpenAI
    return await fetchOpenAIResponse(formattedResume);
  } catch (error) {
    console.error('Error generating initial greeting:', error);
    
    // Fallback greeting if anything fails
    return "Hello! I'm your interview practice assistant. Let's practice some common interview questions based on your resume. What position are you applying for?";
  }
} 