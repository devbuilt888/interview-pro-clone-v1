/**
 * Type definitions for resume processing
 * Contains interfaces for structured resume data
 */

/**
 * Represents structured data extracted from a resume
 */
export interface ResumeData {
  /**
   * Candidate's name
   */
  name: string | null;

  /**
   * Contact information (email, phone, LinkedIn, etc.)
   */
  contactInfo: string[];

  /**
   * Education history entries
   */
  education: string[];

  /**
   * Work experience entries
   */
  experience: string[];

  /**
   * Skills listed in the resume
   */
  skills: string[];

  /**
   * Professional summary or objective statement
   */
  summary: string | null;

  /**
   * Original raw text of the resume
   */
  rawText: string;
}

/**
 * Configuration for OpenAI prompt generation
 */
export interface OpenAIPromptConfig {
  /**
   * Maximum number of characters to include in the resume data
   */
  maxLength?: number;
  
  /**
   * Whether to include section markers
   */
  includeSectionMarkers?: boolean;
  
  /**
   * Custom instructions to include in the prompt
   */
  customInstructions?: string;
}

/**
 * Result of PDF text extraction process
 */
export interface ExtractionResult {
  /**
   * The extracted text
   */
  text: string;
  
  /**
   * Method used for extraction
   */
  method: 'worker-free' | 'standard' | 'fallback' | 'fallback-enhanced' | 'pattern-translated';
  
  /**
   * Any warnings that occurred during extraction
   */
  warnings?: string[];
} 