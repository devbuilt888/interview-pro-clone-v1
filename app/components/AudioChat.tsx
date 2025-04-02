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

  // Use the useChat hook for better message handling
  const { append, messages: chatMessages } = useChat({
    api: '/api/openai-gpt',
    onFinish: (message) => {
      // Only speak the complete message when it's fully received
      if (message.role === 'assistant') {
        speakText(message.content).catch(console.error);

        // Check if this is the final message (contains the goodbye message)
        // Look for the key phrases that indicate the interview is complete
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

  // Play transformers sound when loading
  useEffect(() => {
    if (!isConnected || !token || !roomName || !wsUrl) {
      playTransformersSound();
    }
  }, [isConnected, token, roomName, wsUrl]);

  // Play game-end sound when interview is complete
  useEffect(() => {
    if (isInterviewComplete) {
      playGameEndSound();
    }
  }, [isInterviewComplete]);

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

  // Function to send message to OpenAI and speak - memoized to prevent recreation
  const sendMessageToOpenAI = useCallback(async (messageContent: string, role: 'system' | 'user' = 'user') => {
    try {
      // If it's a system message (like the initial greeting), speak it directly
      if (role === 'system') {
        setMessages(prev => [...prev, { role, content: messageContent }]);
        await speakText(messageContent);
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
  }, [append, setMessages, speakText]);

  // Update messages when chat messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      setMessages(chatMessages);

      // We no longer trigger speech here since we're using onFinish
      // The UI will still update progressively with the stream
    }
  }, [chatMessages]);

  useEffect(() => {
    const setupRoom = async () => {
      try {
        console.log('Setting up room...');
        const generatedRoomName = `interview-${Math.random().toString(36).substring(2, 8)}`;
        setRoomName(generatedRoomName);

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
          throw new Error('Failed to get token');
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
        setIsUIReady(true); // Mark UI as ready after connection is established

        // Send initial message after UI is ready
        const initialMessage = initialText ?? 'Hello, I am Bob the Interviewer. How can I help you?';
        await sendMessageToOpenAI(initialMessage, 'system');
      } catch (err) {
        console.error('Error setting up room:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to interview room');
      }
    };

    setupRoom();
  }, [initialText, sendMessageToOpenAI]);

  // Initialize MediaRecorder
  useEffect(() => {
    const initMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = async () => {
          setIsProcessing(true);
          try {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            audioChunks.current = [];

            // Create form data with the audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            // Send audio to speech-to-text endpoint
            const transcriptionResponse = await fetch('/api/speech-to-text', {
              method: 'POST',
              body: formData,
            });

            if (!transcriptionResponse.ok) {
              throw new Error('Failed to transcribe audio');
            }

            const { text: transcribedText } = await transcriptionResponse.json();
            console.log('Transcribed text:', transcribedText);

            // Send transcribed text to OpenAI
            await sendMessageToOpenAI(transcribedText);
          } catch (error) {
            console.error('Error processing audio:', error);
            setError('Failed to process audio');
          } finally {
            setIsProcessing(false);
          }
        };
      } catch (err) {
        console.error('Error initializing media recorder:', err);
        setError('Failed to access microphone');
      }
    };

    if (isConnected) {
      initMediaRecorder();
    }
  }, [isConnected, sendMessageToOpenAI]);

  const toggleRecording = () => {
    if (!mediaRecorder.current) {
      console.error('MediaRecorder not initialized');
      return;
    }

    if (isRecording) {
      mediaRecorder.current.stop();
    } else {
      audioChunks.current = [];
      mediaRecorder.current.start();
    }
    setIsRecording(!isRecording);
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry Connection</button>
      </div>
    );
  }

  if (!isConnected || !token || !roomName || !wsUrl) {
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
          }}
          onDisconnected={() => {
            console.log('Disconnected from LiveKit room:', roomName);
          }}
          onError={(error) => {
            console.error('LiveKit room error:', error);
            setError(error.message);
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