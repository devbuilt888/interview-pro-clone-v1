'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useChat } from 'ai/react';
import BackgroundAnimation from './BackgroundAnimation';
import { playTransformersSound, playGameEndSound } from './SoundEffects';

type AudioChatProps = {
  initialText?: string;
};

const TypeWriter = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedText(""); // Reset text when prop changes
    let currentText = "";
    let currentIndex = 0;

    const streamText = () => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
      } else {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      }
    };

    intervalRef.current = window.setInterval(streamText, 50);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [text]);

  return (
    <h2 className="typewriter-text">
      {displayedText}
    </h2>
  );
};

const AudioChat: React.FC<AudioChatProps> = ({ initialText }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isUIReady, setIsUIReady] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [introductionSpoken, setIntroductionSpoken] = useState(false);
  const initialMessageSent = useRef(false);
  const soundPlayed = useRef(false);
  const setupAttempted = useRef(false);
  const connectionAttempts = useRef(0);

  // Memoize the speakText function to prevent unnecessary re-renders
  const speakText = useCallback(async (text: string) => {
    try {
      // Create a new SpeechSynthesisUtterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Set some properties for better speech
      utterance.rate = 1.0;  // Speed of speech
      utterance.pitch = 1.0; // Pitch of voice
      utterance.volume = 1.0; // Volume

      // Return a promise that resolves when the speech is complete
      return new Promise<void>((resolve, reject) => {
        utterance.onend = () => {
          console.log('Finished speaking chunk');
          console.log('Text-to-speech completed successfully');
          resolve();
        };

        utterance.onerror = (error) => {
          console.error('Error in text-to-speech:', error);
          reject(error);
        };

        // Start speaking
        console.log('Starting to speak:', text);
        window.speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  }, []);

  // Loading screen welcome message
  const welcomeMessage = "Hello! I'm your interviewer today. I'll be reviewing your resume and asking you some questions.";

  // Add minimum loading time and speak welcome message
  useEffect(() => {
    const handleIntroduction = async () => {
      try {
        // Play transformers sound first (if not already played)
        if (!soundPlayed.current) {
          playTransformersSound();
          soundPlayed.current = true;
          
          // Give some time for the sound to start
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Speak the welcome message
        console.log('Speaking welcome message on loading screen');
        await speakText(welcomeMessage);
        
        // Mark introduction as spoken
        setIntroductionSpoken(true);
        
        // Wait the minimum 5 seconds before completing loading
        const timeElapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 5000 - timeElapsed);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Mark loading as complete
        setLoadingComplete(true);
      } catch (error) {
        console.error('Error during introduction:', error);
        // Still complete loading even if speech fails
        setIntroductionSpoken(true);
        setLoadingComplete(true);
      }
    };
    
    const startTime = Date.now();
    handleIntroduction();
    
    return () => {
      // Cancel any pending speech when unmounting
      window.speechSynthesis.cancel();
    };
  }, [speakText]);

  // Play transformers sound when loading - only for error cases
  // Primary sound playing is now handled in the introduction
  useEffect(() => {
    if (!isConnected && !soundPlayed.current && error) {
      playTransformersSound();
      soundPlayed.current = true;
    }
  }, [isConnected, error]);

  // Play game-end sound when interview is complete - only once
  useEffect(() => {
    if (isInterviewComplete && soundPlayed.current) {
      playGameEndSound();
      soundPlayed.current = false; // Reset for potential new interview
    }
  }, [isInterviewComplete]);

  // Use the useChat hook for better message handling
  const { append, messages: chatMessages } = useChat({
    api: '/api/openai-gpt',
    // Skip initialMessages entirely and use our first message approach
    onFinish: (message) => {
      // Only speak the complete message when it's fully received
      if (message.role === 'assistant') {
        speakText(message.content).catch(console.error);

        // Check if this is the final message (contains the goodbye message)
        if (message.content.includes('Thank you for your time') &&
          message.content.includes('have a great day')
        ) {
          setIsInterviewComplete(true);
        }
      }
    }
  });

  // MediaRecorder setup
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Add ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Apply the initial message - only once, after introduction is spoken and after connection is established
  useEffect(() => {
    // Only proceed if everything is ready AND the introduction has been spoken
    if (initialText && !initialMessageSent.current && isConnected && isUIReady && introductionSpoken && loadingComplete) {
      const sendInitialMessage = async () => {
        try {
          console.log('Sending initial interview message after introduction');
          // First add the message to the UI
          setMessages(prev => [...prev, { role: 'system', content: initialText }]);
          
          // Then speak it
          await speakText(initialText);
          
          // Mark as sent so it doesn't happen again
          initialMessageSent.current = true;
        } catch (error) {
          console.error('Error sending initial message:', error);
        }
      };
      
      sendInitialMessage();
    }
  }, [initialText, isConnected, isUIReady, introductionSpoken, loadingComplete, speakText]);

  // Function to send message to OpenAI and speak - memoized to prevent recreation
  const sendMessageToOpenAI = useCallback(async (messageContent: string, role: 'system' | 'user' = 'user') => {
    try {
      // If it's a system message (like the initial greeting), we handle it separately
      if (role === 'system') {
        // Skip if already sent via the useEffect hook
        if (initialText && initialMessageSent.current) return;
        
        // Only add and speak if not a duplicate
        if (!messages.some(msg => msg.content === messageContent)) {
          setMessages(prev => [...prev, { role, content: messageContent }]);
          await speakText(messageContent);
          initialMessageSent.current = true;
        }
        return;
      }

      // For user messages, use the useChat hook's append function
      await append({
        content: messageContent,
        role: 'user'
      });
    } catch (error) {
      console.error('Error in sendMessageToOpenAI:', error);
      setError('Failed to get AI response');
    }
  }, [append, messages, initialText, speakText]);

  // Update messages when chat messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      // Filter out duplicate messages
      const uniqueMessages = chatMessages.filter((msg, index, self) =>
        index === self.findIndex((m) => m.content === msg.content)
      );
      setMessages(uniqueMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    const setupRoom = async () => {
      // Prevent multiple setup attempts
      if (setupAttempted.current) return;
      setupAttempted.current = true;

      try {
        console.log('Setting up room...');
        const generatedRoomName = `interview-${Math.random().toString(36).substring(2, 8)}`;
        setRoomName(generatedRoomName);

        // First, validate that we have the required environment variables
        if (!process.env.NEXT_PUBLIC_LIVEKIT_WS_URL) {
          throw new Error('LiveKit WebSocket URL not configured');
        }

        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomName: generatedRoomName,
            participantName: 'User',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get token');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.token || typeof data.token !== 'string') {
          throw new Error('Invalid token received from server');
        }

        if (!data.wsUrl) {
          throw new Error('WebSocket URL not received from server');
        }

        setToken(data.token);
        setWsUrl(data.wsUrl);
        setIsConnected(true);
        setIsUIReady(true);

        // We no longer send the initial message here, it's handled by the dedicated useEffect
      } catch (err) {
        console.error('Error setting up room:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to interview room');
      }
    };

    setupRoom();
  }, []);

  // Initialize MediaRecorder
  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        console.log('Initializing MediaRecorder...');
        
        // Request permission for audio capture
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        console.log('Audio stream obtained:', stream.active);
        
        // Determine the supported mime type
        const mimeTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/mp4',
          'audio/ogg;codecs=opus',
          'audio/wav',
          ''  // Browser default
        ];
        
        let selectedMimeType = '';
        for (const type of mimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            selectedMimeType = type;
            break;
          }
        }
        
        console.log('Using MIME type:', selectedMimeType || 'browser default');
        
        // Create the recorder with options
        const recorderOptions = selectedMimeType ? { mimeType: selectedMimeType } : {};
        const recorder = new MediaRecorder(stream, recorderOptions);
        
        console.log('MediaRecorder created with state:', recorder.state);
        
        // Save the recorder to the ref
        mediaRecorder.current = recorder;
        
        // Clear audio chunks
        audioChunks.current = [];
        
        // Set up event handlers
        recorder.ondataavailable = (event) => {
          console.log('Data available event fired, data size:', event.data.size);
          if (event.data && event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        recorder.onstart = () => {
          console.log('MediaRecorder started recording');
          audioChunks.current = [];
        };
        
        recorder.onpause = () => {
          console.log('MediaRecorder paused');
        };
        
        recorder.onresume = () => {
          console.log('MediaRecorder resumed');
        };
        
        recorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setError('Error during recording: ' + (event.error ? event.error.message : 'Unknown error'));
        };

        recorder.onstop = async () => {
          console.log('MediaRecorder stopped, chunks collected:', audioChunks.current.length);
          
          if (audioChunks.current.length === 0) {
            console.error('No audio data collected');
            setError('No audio data was recorded. Please try again.');
            setIsProcessing(false);
            return;
          }
          
          setIsProcessing(true);
          
          try {
            // Create blob from audio chunks
            const blobOptions = { type: selectedMimeType || 'audio/webm' };
            const audioBlob = new Blob(audioChunks.current, blobOptions);
            console.log('Audio blob created, size:', audioBlob.size, 'bytes');
            
            if (audioBlob.size < 100) {
              console.error('Audio blob too small, likely no audio captured');
              throw new Error('Audio recording too short or no sound detected');
            }

            // Create form data with the audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            console.log('Sending audio to speech-to-text endpoint...');
            // Send audio to speech-to-text endpoint
            const transcriptionResponse = await fetch('/api/speech-to-text', {
              method: 'POST',
              body: formData,
            });

            console.log('Speech-to-text response status:', transcriptionResponse.status);
            
            if (!transcriptionResponse.ok) {
              const errorText = await transcriptionResponse.text();
              console.error('Transcription error response:', errorText);
              throw new Error('Failed to transcribe audio');
            }

            const transcriptionData = await transcriptionResponse.json();
            const transcribedText = transcriptionData.text;
            console.log('Transcribed text:', transcribedText);

            if (!transcribedText || transcribedText.trim() === '') {
              console.warn('Empty transcription received');
              throw new Error('No speech detected in recording');
            }

            // Add user message to UI immediately
            setMessages(prev => [...prev, { role: 'user', content: transcribedText }]);

            // Send transcribed text to OpenAI
            console.log('Sending transcribed text to OpenAI...');
            await sendMessageToOpenAI(transcribedText);
          } catch (error) {
            console.error('Error processing audio:', error);
            setError(error instanceof Error ? error.message : 'Failed to process audio');
          } finally {
            setIsProcessing(false);
          }
        };

        console.log('MediaRecorder setup complete');
      } catch (err) {
        console.error('Error initializing media recorder:', err);
        setError('Failed to access microphone. Please ensure microphone permissions are granted.');
      }
    };

    // Only initialize once when component mounts
    if (isConnected && !mediaRecorder.current) {
      console.log('Connection established, setting up media recorder once');
      initMediaRecorder();
    }
  }, [isConnected, sendMessageToOpenAI]);

  const toggleRecording = () => {
    console.log('Toggle recording button clicked');
    if (!mediaRecorder.current) {
      console.error('MediaRecorder not initialized');
      setError('Microphone not initialized. Please refresh the page and try again.');
      return;
    }

    try {
      console.log('Current recorder state:', mediaRecorder.current.state);
      if (isRecording) {
        console.log('Stopping recording...');
        if (mediaRecorder.current.state !== 'inactive') {
          mediaRecorder.current.stop();
        } else {
          console.warn('MediaRecorder already inactive, cannot stop');
          setIsRecording(false);
        }
      } else {
        console.log('Starting recording...');
        // Clear previous chunks
        audioChunks.current = [];
        // Request data every 1 second to ensure we capture data even if stop fails
        mediaRecorder.current.start(1000);
      }
      setIsRecording(!isRecording);
      console.log('Recording state set to:', !isRecording);
    } catch (error) {
      console.error('Error toggling recording:', error);
      setError('Failed to control microphone. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry Connection</button>
      </div>
    );
  }

  if (!loadingComplete || !isConnected || !token || !roomName || !wsUrl) {
    return (
      <div className="loading-container">
        <div className="loading-message">
          <div className="robot-image-container">
            <Image
              src="/MegaRobotInterviewer.png"
              alt="Robot Interviewer"
              width={480}
              height={480}
              priority
            />
          </div>
          <div className="loading-text">
            <TypeWriter text="Hello! I'm your interviewer today. I'll be reviewing your resume and asking you some questions." />
            <h3>Connecting to interview room...</h3>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundAnimation />
      <div className="audio-chat-container">
        <LiveKitRoom
          token={token}
          serverUrl={wsUrl}
          connect={true}
          onConnected={() => {
            console.log('Connected to LiveKit room:', roomName);
            setIsConnected(true);
            connectionAttempts.current = 0;
          }}
          onDisconnected={() => {
            console.log('Disconnected from LiveKit room:', roomName);
            setIsConnected(false);
          }}
          onError={(error) => {
            console.error('LiveKit room error:', error);
            // Only set error if we've tried a few times
            if (connectionAttempts.current >= 3) {
              setError(error.message);
            } else {
              connectionAttempts.current++;
            }
          }}
        >
          <div className="chat-layout">
            <div className="chat-header">
              <h2>Interview with Bob</h2>
              <div className="status-indicator">
                <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            <div className="messages-container">
              {messages.map((message, index) => (
                <div key={index} className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'bob-message'}`}>
                  <div className="message-content">
                    <div className="message-sender">
                      {message.role === 'system' || message.role === 'assistant' ? 'Bob' : 'You'}
                    </div>
                    <div className="message-text">{message.content}</div>
                  </div>
                  <div className="message-timestamp">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-controls">
              <button
                className={`record-button ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''} ${isInterviewComplete ? 'interview-complete' : ''}`}
                onClick={toggleRecording}
                disabled={isProcessing || isInterviewComplete}
              >
                <span className="button-icon">
                  {isRecording ? '⏹' : isProcessing ? '⌛' : isInterviewComplete ? '✅' : '🎤'}
                </span>
                <span className="button-text">
                  {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : isInterviewComplete ? 'Interview Complete' : 'Start Recording'}
                </span>
              </button>
              {isInterviewComplete && (
                <button
                  className="new-interview-button"
                  onClick={() => window.location.reload()}
                >
                  <span className="button-icon">🔄</span>
                  <span className="button-text">Start New Interview</span>
                </button>
              )}
            </div>
          </div>

          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </>
  );
};

export default AudioChat; 