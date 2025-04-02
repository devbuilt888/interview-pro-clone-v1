import React, { useState, useRef, DragEvent, useEffect } from "react";
import AudioChat from "./AudioChat";

interface ResumeUploaderProps {
  onChatStart?: () => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onChatStart }) => {
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a class to body when chat is shown
  useEffect(() => {
    if (showChat) {
      document.body.classList.add('chat-active');
      onChatStart?.();
    } else {
      document.body.classList.remove('chat-active');
    }
    
    return () => {
      document.body.classList.remove('chat-active');
    };
  }, [showChat, onChatStart]);

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    setError(null);
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      setError("No file selected. Please try again.");
      setIsLoading(false);
      return;
    }

    await processFile(file);
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error (${response.status}): ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(`PDF processing error: ${data.error}`);
      }

      setInitialText(data.text);
      setShowChat(true);
    } catch (error) {
      console.error("Error processing resume:", error);
      setError(error instanceof Error ? error.message : "Failed to process the resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsLoading(true);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    } else {
      setError("No file detected. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <p className="instructions-text">
        {!showChat
          ? "Upload your resume to start the interview."
          : "Answer Bob's questions using your microphone."}
      </p>
      {!showChat ? (
        <>
          <div 
            className={`file-upload-btn-container ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleResumeUpload}
              accept="application/pdf"
              hidden
              ref={fileInputRef}
            />
            <label htmlFor="file-upload" className="file-upload-btn">
              📄 {isDragging ? 'Drop Resume Here' : 'Upload Resume'}
            </label>
            <p className="drag-drop-hint">or drag and drop a PDF file here</p>
          </div>
          
          {isLoading && <div className="loading-spinner"></div>}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-button">Try Again</button>
            </div>
          )}
        </>
      ) : (
        <AudioChat initialText={initialText} />
      )}
    </div>
  );
};

export default ResumeUploader;
