// Type definitions for ai/react
declare module 'ai/react' {
  import { ReactNode } from 'react';

  export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    createdAt?: Date;
  }

  export interface UseChatOptions {
    /**
     * The API endpoint that accepts a `{ messages: Message[] }` object and returns
     * a stream of tokens of the AI chat response.
     */
    api?: string;
    
    /**
     * A callback function that is called when a complete message has been received.
     */
    onFinish?: (message: Message) => void | Promise<void>;
    
    /**
     * An array of messages to pre-populate the chat with.
     */
    initialMessages?: Message[];
    
    /**
     * A callback function that is called when an error occurs.
     */
    onError?: (error: Error) => void;
    
    /**
     * Additional headers to send with the API request.
     */
    headers?: Record<string, string>;
    
    /**
     * Additional body parameters to send with the API request.
     */
    body?: Record<string, any>;
  }

  export interface UseChatHelpers {
    /** Current messages in the chat */
    messages: Message[];
    
    /** Append a user message to the chat list */
    append: (message: {
      content: string;
      role: 'user' | 'assistant' | 'system' | 'function';
      id?: string;
      createdAt?: Date;
    }) => Promise<void>;
    
    /** Reload the last AI response for the given chat history */
    reload: () => Promise<void>;
    
    /** Whether the API request is in progress */
    isLoading: boolean;
    
    /** The error object of the API request */
    error: undefined | Error;
  }

  export function useChat(options?: UseChatOptions): UseChatHelpers;
} 