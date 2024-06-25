import axios from 'axios';

// 創建一個 axios 實例，預設基礎 URL 和頭部
const api = axios.create({
  baseURL: 'https://mumumsit158.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// API 函數

export const getLatestMessages = async () => {
  return await api.get<CustomerMessageDTO[]>('/Service/latest-messages');
};

export const getMembersNicknames = async () => {
  return await api.get<{ memberId: number; nickname: string; thumbnail: string }[]>('/Member');
};

export const getServicesByMemberId = (memberId: number) => {
  return api.get<ServiceDTO[]>(`/Service/member/${memberId}/services`);
};

export const getServiceMessages = (serviceId: number) => {
  return api.get<ServiceMessageDTO[]>(`/Service/service/${serviceId}/messages`);
};

export const createServiceMessage = (serviceId: number, message: ServiceMessageDTO) => {
  return api.post<ServiceMessageDTO>(`/Service/${serviceId}/messages`, message);
};

export const createService = (service: ServiceDTO) => {
  return api.post<ServiceDTO>('/Service', service);
};


export const closeService = (serviceId: number) => {
  return api.put<void>(`/Service/${serviceId}/close`); // 使用 PUT 方法來關閉服務
};

export const getMessagesByMemberId = (memberId: number) => {
  return api.get<ServiceMessageDTO[]>(`/Service/member/${memberId}/messages`);
};

export const getLatestServiceIdByMemberId = (memberId: number) => {
  return api.get<number>(`/Service/member/${memberId}/latest-service-id`);
};

export const markMessagesAsRead = (memberId: number) => {
  return api.post<void>(`/Service/mark-as-read/${memberId}`);
};
export const getUnreadCount = async () => {
  return api.get('/Service/unread-count');
};
// TypeScript 接口定義

export interface ServiceDTO {
  serviceId: number;
  memberId: number;
  adminId?: number;
  statusId: number;
  startDate: string;
  endDate?: string | null;
}

export interface ServiceMessageDTO {
  messageId: number;
  serviceId: number;
  memberId?: number;
  adminId?: number | null;
  messageContent?: string;
  messageDate: string;
}

export interface CustomerMessageDTO {
  serviceId: number;
  memberId: number;
  adminId?: number;
  messageContent: string;
  messageDate: string;
  messageCount: number;
  unreadMessages: number;
}
