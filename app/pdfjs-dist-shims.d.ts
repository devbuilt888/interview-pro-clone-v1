declare module 'pdfjs-dist/build/pdf.min.mjs' {
  export * from 'pdfjs-dist'
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {}

declare module 'pdfjs-dist/build/pdf.worker.mjs' {}

declare module 'pdfjs-dist/legacy/build/pdf.js' {
  export const getDocument: any;
  export const version: string;
  export const GlobalWorkerOptions: any;
  export const PDFDocumentProxy: any;
  export const PDFPageProxy: any;
  export const renderTextLayer: any;
  export const AnnotationLayer: any;
}

declare module 'pdfjs-dist/legacy/build/pdf.worker.js' {
  // Just a stub for the worker file
}