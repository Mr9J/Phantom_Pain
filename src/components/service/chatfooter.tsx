import React from 'react';

// 定義 ChatFooterProps 接口，用於指定 ChatFooter 組件的屬性類型
interface ChatFooterProps {
  message: string; // 訊息輸入框的值
  handleMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // 處理輸入框變更事件的函數
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // 處理表單提交事件的函數
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void; // 處理文件上傳事件的函數
  uploading: boolean; // 文件上傳狀態，用於禁用上傳按鈕和顯示上傳中的狀態
}

// 定義 ChatFooter 組件，並指定其屬性類型為 ChatFooterProps
const ChatFooter: React.FC<ChatFooterProps> = ({
  message,
  handleMessageChange,
  handleSubmit,
  handleFileUpload,
  uploading
}) => {
  return (
    // 渲染表單
    <form onSubmit={handleSubmit} className="service-chat-footer">
      {/* 訊息輸入框 */}
      <input
        type="text"
        value={message}
        onChange={handleMessageChange} // 綁定處理輸入框變更事件的函數
        placeholder="請輸入訊息..."
        className="service-chat-input"
      />
      {/* 文件上傳按鈕 */}
      <input
        type="file"
        id="service-file-upload"
        onChange={handleFileUpload} // 綁定處理文件上傳事件的函數
        disabled={uploading} // 當文件正在上傳時禁用按鈕
        className="service-file-input"
      />
      {/* 文件上傳按鈕的標籤 */}
      <label htmlFor="service-file-upload" className="service-file-label">
        {uploading ? '上傳中...' : '選擇圖片'} {/* 根據上傳狀態顯示不同的文本 */}
      </label>
      {/* 提交按鈕 */}
      <button type="submit" className="service-submit-button">送出</button>
    </form>
  );
};

export default ChatFooter;
