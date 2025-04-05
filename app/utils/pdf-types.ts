/**
 * Type definitions for PDF.js integration
 * Contains interfaces for PDF document, pages, and text content
 */

/**
 * Represents a PDF document
 */
export interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNum: number): Promise<PDFPageProxy>;
  destroy(): Promise<void>;
}

/**
 * Represents a single page in a PDF document
 */
export interface PDFPageProxy {
  getTextContent(params?: any): Promise<TextContent>;
  getOperatorList(): Promise<any>;
  getAnnotations(): Promise<any>;
  cleanup(): void;
}

/**
 * Represents text content extracted from a PDF page
 */
export interface TextContent {
  items: Array<TextItem>;
  styles?: {
    [key: string]: any;
  };
}

/**
 * Represents a single text item within PDF text content
 */
export interface TextItem {
  str?: string;
  dir?: string;
  width?: number;
  height?: number;
  transform?: number[];
  fontName?: string;
  hasEOL?: boolean;
  [key: string]: any;
} 