'use client';

import { useEffect, useState, useMemo } from 'react';
import { useChat } from 'ai/react';
import dynamic from 'next/dynamic';

// Define the ChatBoxProps type locally
interface ChatBoxProps {
  messages: any[];
  userId: number;
  onSendMessage: (message: string) => void;
  width: string;
  height: string;
  style?: React.CSSProperties;
}

// Use a more explicit loader function that returns the default export
const ChatBox = dynamic(() => 
  import('react-chat-plugin').then((mod) => {
    return mod.default as React.ComponentType<ChatBoxProps>;
  }),
  { ssr: false }
);

type ChatProps = {
  initialText?: string;
};

const userAuthor = {
  username: 'User',
  id: 1,
  avatarUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
};

const aiAuthor = {
  username: 'Bob The Interviewer',
  id: 2,
  avatarUrl: '/bob.jpg',
};

const Chat: React.FC<ChatProps> = ({ initialText }) => {
  // Use useMemo to stabilize the initialMessage object
  const initialMessage = useMemo(() => ({
    author: aiAuthor,
    text: initialText ?? 'Hello, I am Bob the Interviewer. How can I help you?',
    type: 'text',
    timestamp: +new Date(),
  }), [initialText]);
  
  const [chatMessages, setChatMessages] = useState([initialMessage]);
  const { append, messages } = useChat({
    api: '/api/openai-gpt',
  });

  useEffect(() => {
    if (messages.length < 1) return;
    const authors = {
      user: userAuthor,
      assistant: aiAuthor,
    }
    const chatMessagesArr = messages?.map(message => {
      return ({
        author: authors[message.role as keyof typeof authors],
        text: message?.content,
        type: 'text',
        timestamp: +new Date(),
      });
    });
    setChatMessages([initialMessage, ...chatMessagesArr]);
  }, [messages, initialMessage]);

  const handleOnSendMessage = (message: string) => {
    append({
      content: message,
      role: 'user'
    });
  }

  return (
    <ChatBox
      style={{margin: 'auto'}}
      messages={chatMessages}
      userId={1}
      onSendMessage={handleOnSendMessage}
      width={'550px'}
      height={'500px'}
    />
  );
}

export default Chat;