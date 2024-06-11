import React, { useRef, useEffect } from 'react';
import { Message } from '@/components/service/types';

interface ChatMessagesProps {
  messages: Message[];
  searchTerm: string;
  highlightedIndexes: number[];
  currentIndex: number;
}

const ChatMessagesAdmin: React.FC<ChatMessagesProps> = ({ messages, searchTerm, highlightedIndexes, currentIndex }) => {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (highlightedIndexes.length > 0 && currentIndex !== -1) {
      messageRefs.current[highlightedIndexes[currentIndex]]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [highlightedIndexes, currentIndex]);

  const formatTime = (date: Date | string): string => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const highlightText = (text: string, messageIndex: number) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className={`admin-highlight ${highlightedIndexes[currentIndex] === messageIndex ? 'admin-current-highlight' : ''}`}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="admin-chat-messages">
      {messages.map((message, index) => (
        <div key={message.id} className={`admin-chat-message ${message.sender}`} ref={el => messageRefs.current[index] = el}>
          <div className="admin-message-bubble">
            {message.content.startsWith('data:image') ? (
              <img src={message.content} alt="uploaded" className="admin-uploaded-image" />
            ) : (
              <div>{highlightText(message.content, index)}</div>
            )}
            <div className={`admin-timestamp ${message.sender}`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessagesAdmin;
