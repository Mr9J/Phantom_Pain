import React, { useRef, useEffect } from 'react';
import { Message } from '@/components/service/types';

interface ChatMessagesProps {
  messages: Message[];
  searchTerm: string;
  highlightedIndexes: number[];
  currentIndex: number;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, searchTerm, highlightedIndexes, currentIndex }) => {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (highlightedIndexes.length > 0 && currentIndex !== -1) {
      messageRefs.current[highlightedIndexes[currentIndex]]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [highlightedIndexes, currentIndex]);

  const highlightText = (text: string, messageIndex: number) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className={`service-highlight ${highlightedIndexes[currentIndex] === messageIndex ? 'service-current-highlight' : ''}`}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const formatTime = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('zh-TW', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).replace(':', ':').replace('AM', '上午').replace('PM', '下午'); // 顯示 "下午 3:17分" 格式
  };

  return (
    <div className="service-chat-messages">
      {messages.map((message, index) => (
        <div key={message.id} className={`service-chat-message ${message.sender}`} ref={el => messageRefs.current[index] = el}>
          <div className="service-message-bubble">
            {message.content.startsWith('data:image') ? (
              <img src={message.content} alt="uploaded" className="service-uploaded-image" />
            ) : (
              <div>{highlightText(message.content, index)}</div>
            )}
            <div className={`service-timestamp ${message.sender}`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
