declare module 'pdfjs-dist' {
  export * from 'pdfjs-dist/types/display/api';
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export const version: string;
  
  export function getDocument(options: any): {
    promise: Promise<any>;
  };
}

declare module 'pdfjs-dist/build/pdf.min.mjs' {
  export * from 'pdfjs-dist'
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {}

declare module 'pdfjs-dist/build/pdf.worker.js' {
  const workerContent: any;
  export default workerContent;
}