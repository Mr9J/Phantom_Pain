import React from 'react';

interface ChatFooterProps {
  message: string; // 訊息輸入框的值
  handleMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // 處理輸入框變更事件的函數
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // 處理表單提交事件的函數
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void; // 處理文件上傳事件的函數
  uploading: boolean; // 文件上傳狀態，用於禁用上傳按鈕和顯示上傳中的狀態
}

const ChatFooterAdmin: React.FC<ChatFooterProps> = ({
  message,
  handleMessageChange,
  handleSubmit,
  handleFileUpload,
  uploading
}) => {
  return (
    <form onSubmit={handleSubmit} className="admin-chat-footer">
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="請輸入訊息..."
        className="admin-chat-input"
      />
      <input
        type="file"
        id="file-upload-admin"
        onChange={handleFileUpload}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload-admin" className="admin-file-upload-label">
        {uploading ? '上傳中...' : '選擇文件'}
      </label>
      <button type="submit" className="admin-send-button">送出</button>
    </form>
  );
};

export default ChatFooterAdmin;
