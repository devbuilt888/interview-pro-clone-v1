# Interview Pro - AI-Powered Interview Training

This application provides AI-powered interview training with resume analysis. It utilizes PDF.js for resume extraction and OpenAI GPT for personalized interview questions.

## Application Overview

This chatbot helps you prepare for behavioral interviews by:
1. Uploading your resume PDF
2. Extracting relevant information using PDF.js
3. Generating personalized interview questions with OpenAI
4. Conducting a simulated interview with voice interaction

## PDF.js Implementation Analysis

### Extraction Architecture

The system employs a multi-layered extraction approach with fallbacks:

```
POST request (PDF upload)
│
├── Worker-free extraction (primary for serverless)
│   └── If fails or insufficient text → Standard extraction
│       └── If fails → Regex-based fallback extraction
│
└── Resume data structuring → OpenAI processing
```

### Complete PDF Upload and Processing Flow

```
Frontend (ResumeUploader)
│
├── File Upload (handleResumeUpload/processFile)
│   └── FormData with PDF sent to /api/extract-text
│
Backend (extract-text/route.ts)
│
├── PDF Extraction
│   ├── Worker-Free Approach (serverless-optimized)
│   │   ├── Directly extracts text with basic options
│   │   └── Disables workers to avoid runtime errors
│   │
│   ├── Standard PDF.js Approach (if worker-free fails)
│   │   ├── Attempts to load with worker from CDN
│   │   ├── Extracts annotations and structured content
│   │   └── Uses better text layout detection
│   │
│   └── Regex Fallback Approach (if both above fail)
│       ├── Pure text-based extraction with multiple patterns
│       ├── No PDF.js dependency
│       └── Last resort for corrupted/complex PDFs
│
├── Resume Data Structuring
│   ├── Detects sections (Education, Experience, Skills)
│   ├── Formats into structured data
│   └── Adds section markers for OpenAI
│
├── OpenAI Request (fetchOpenAIResponse)
│   └── Gets initial greeting with resume context
│
└── Response to Frontend
    └── Text used to initialize chat interface
```

### Extraction Methods

#### 1. Worker-Free Extraction

```typescript
async function extractTextWithoutWorker(fileData: Uint8Array): Promise<string>
```

**Purpose**: Primary extraction method optimized for serverless environments
- Uses `disableWorker: true` and other settings to avoid web worker dependencies
- Limits to 5 pages for faster processing
- Uses simplified text extraction with minimal options

#### 2. Standard PDF.js Extraction

**Purpose**: Secondary approach when worker-free fails
- More complete extraction with annotations support
- Handles up to 10 pages
- Uses enhanced text formatting with `mergeTextContent()`
- Attempts to use workers with CDN fallbacks

#### 3. Regex-Based Fallback

**Purpose**: Last resort when PDF.js approaches fail
- Uses 4 different regex pattern approaches:
  - BT/ET marker extraction
  - Parentheses extraction
  - Word pattern extraction
  - Stream object extraction
- Attempts each approach until sufficient text is found

### Resume Data Processing

The application uses a structured approach to parse resume content:

1. **Section Detection**:
   - Identifies common resume sections (Education, Experience, Skills, Summary)
   - Uses pattern matching to find section headers

2. **Data Extraction**:
   - Extracts contact information using regex patterns
   - Name extraction using multiple fallback patterns
   - Formats structured data for OpenAI consumption

### Integration with OpenAI

The extracted resume data is:

1. Structured into a consistent format
2. Wrapped with section markers (`--- RESUME START ---`)
3. Limited to 7500 characters to avoid token limits
4. Sent to OpenAI with specific prompting for interview initialization

### OpenAI GPT Route (`/api/openai-gpt/route.ts`)

This route serves as the conversation engine after the initial PDF processing:

1. **Initial Message Handling**:
   - First message (system message) contains the structured resume data
   - This initial message is parsed using `parseResumeContent()`
   - Resume sections are logged for debugging

2. **Resume Data Enhancement**:
   - When a system message with resume data is found:
     - Creates personalized instructions about:
       - Candidate's name
       - Top experiences (up to 3, truncated to 150 chars each)
       - Key skills (up to 10)
       - Educational background
     - Appends truncated resume data (max 1500 chars)

3. **Message Filtering**:
   - Filters out duplicate system messages to avoid redundancy
   - Only sends user messages and the enhanced system message to OpenAI

4. **Streaming Response**:
   - Uses the OpenAI streaming API for real-time responses
   - Detects interview conclusion based on content patterns

### Service Worker Implementation

The service worker (`public/sw.js`) implements:

1. **Smart Resource Caching**:
   - Caches PDF.js workers from multiple CDNs for redundancy
   - Uses pattern matching to identify PDF.js resources

2. **Fallback Mechanism**:
   - Handles network errors when fetching resources
   - Updates cache when new versions are available

### Edge Case Handling

The application implements several layers of fallbacks for handling problematic PDFs:

#### PDF.js Worker Issues
- **Worker Preloading**: Attempts to initialize worker before needed
- **Worker-Free Extraction**: Implemented for serverless environments
- **CDN Fallbacks**: Multiple CDN sources configured
- **Service Worker Caching**: Improves reliability of worker loading

#### PDF Content Extraction Challenges
- **Multiple Extraction Methods**: Three distinct approaches with increasing fallback reliability
- **Annotation Support**: Extracts form fields and annotations when available
- **Text Layout Analysis**: Preserves paragraph structure using transform matrices

#### Error Handling
- **Detailed Logging**: Extensive logging throughout the process
- **Error Classification**: Special handling for TypeError cases common with workers
- **Fallback Text**: Default resume text provided as ultimate fallback
- **Client-Side Error Display**: Formatted error messages with retry option

#### Malformed PDFs
- **Regex-Based Fallback**: Pure text extraction for corrupted PDFs
- **Multiple Pattern Approaches**: Four different regex patterns to extract content
- **Text Cleanup**: Removes non-printable characters and normalizes whitespace

## Future Optimization Opportunities

### Code Consolidation
1. **Extraction Abstraction Layer**:
   - Create a unified PDF extraction interface
   - Implement strategy pattern for different extraction methods
   - Reduce duplication in extraction methods

2. **Configuration Management**:
   - Centralize PDF.js configuration parameters
   - Share CDN URLs across components
   - Create a dedicated PDF.js configuration module

3. **Error Handling Standardization**:
   - Implement a dedicated PDF.js error handler
   - Standardize error reporting format
   - Create error recovery strategies

### Performance Improvements
1. **Caching**:
   - Implement server-side caching of extracted resume data
   - Cache processed PDF structure, not just raw text
   - Add TTL to cached results

2. **Parallel Processing**:
   - Extract PDF text and structure in parallel
   - Perform OpenAI request while finalizing structure
   - Use Web Workers for client-side processing

3. **Progressive Loading**:
   - Show partial extraction results while processing
   - Stream extracted text to UI incrementally
   - Implement staged processing feedback

### Reliability Enhancements
1. **PDF Validation**:
   - Add pre-extraction validation step
   - Detect corrupted PDFs before processing
   - Provide better feedback for problematic files

2. **Service Worker Enhancement**:
   - Add offline support for cached PDFs
   - Improve resource pattern matching
   - Implement background sync for failed uploads

3. **OpenAI Fallbacks**:
   - Add retry logic for OpenAI API calls
   - Implement model fallbacks (e.g., GPT-3.5 → GPT-3)
   - Cache common interview questions locally

## Getting Started

1. Clone the repository
2. Create a `.env.local` file based on `.env`
3. Add your OpenAI API key to `.env.local`
4. Install dependencies with `npm install`
5. Run the development server with `npm run dev`
6. Open your browser to `http://localhost:3000`
7. Upload your resume and start the interview

## Troubleshooting

If you encounter PDF extraction issues:
1. Ensure your PDF is not password-protected
2. Try a different PDF if extraction fails
3. Check browser console for specific error messages
4. Verify your OpenAI API key has sufficient credits
5. Ensure your internet connection is stable

## License

This project is licensed under the MIT License.
