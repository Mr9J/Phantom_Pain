// 定義一個 Message 接口，用於描述訊息的結構
// src/components/service/types.ts

export interface Message {
  id: number;
  serviceId: number;
  memberId?: number;
  adminId?: number | null;
  content: string;
  timestamp: Date;
  sender: 'user' | 'admin';
}


// 定義 Customer 型別
export type Customer = {
  id: number;
  name: string;
  image: string;
  messageCount: number;
  lastMessage: string;
  lastMessageDate: string; // 添加消息最後發送日期
};
export interface UserType {
  MemberID: number;
  AdminID: number | null;

}
