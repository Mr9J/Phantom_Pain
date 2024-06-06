import React from 'react';

interface ChatHeaderProps {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  highlightedIndexes: number[];
  currentIndex: number;
  handlePrevious: () => void;
  handleNext: () => void;
}

const ChatHeaderAdmin: React.FC<ChatHeaderProps> = ({
  searchTerm,
  handleSearchChange,
  highlightedIndexes,
  currentIndex,
  handlePrevious,
  handleNext
}) => {
  return (
    <div className="admin-chat-header">
      <h1>MuMu客服系統 - 管理介面</h1>
      <div className="admin-search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="搜尋訊息..."
          className="admin-search-input"
        />
        {searchTerm && (
          <div className="admin-search-navigation">
            <span>{currentIndex + 1}/{highlightedIndexes.length}</span>
            <button onClick={handlePrevious} disabled={currentIndex <= 0}>↑</button>
            <button onClick={handleNext} disabled={currentIndex >= highlightedIndexes.length - 1}>↓</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeaderAdmin;
