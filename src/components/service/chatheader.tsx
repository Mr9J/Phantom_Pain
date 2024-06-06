import React from 'react';

interface ChatHeaderProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  highlightedIndexes: number[];
  currentIndex: number;
  handlePrevious: () => void;
  handleNext: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  searchTerm,
  handleSearchChange,
  highlightedIndexes,
  currentIndex,
  handlePrevious,
  handleNext
}) => {
  return (
    <div className="service-chat-header">
      MuMu線上客服系統
      <div className="service-search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="搜尋訊息..."
          className="service-search-input"
        />
        {searchTerm && (
          <div className="service-search-navigation">
            <span>{currentIndex + 1}/{highlightedIndexes.length}</span>
            <button onClick={handlePrevious} disabled={currentIndex <= 0}>↑</button>
            <button onClick={handleNext} disabled={currentIndex >= highlightedIndexes.length - 1}>↓</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
