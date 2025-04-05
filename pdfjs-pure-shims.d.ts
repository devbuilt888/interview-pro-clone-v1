/**
 * Type declarations for pdfjs-pure
 */

declare module 'pdfjs-pure' {
  // Just declare minimal types needed for our fallback approach
  export const version: string;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  
  export function getDocument(options: any): {
    promise: Promise<any>;
  };
  
  export default {
    getDocument,
    GlobalWorkerOptions,
    version
  };
} 