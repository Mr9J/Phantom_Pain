import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7150/api', // 根據你的後端伺服器地址進行調整
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getLatestMessages = async () => {
  return await api.get<CustomerMessageDTO[]>('/Service/latest-messages');
};

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
}

export const getServicesByMemberId = (memberId: number) => api.get<ServiceDTO[]>(`/Service/member/${memberId}/services`);
export const getServiceMessages = (serviceId: number) => api.get<ServiceMessageDTO[]>(`/Service/service/${serviceId}/messages`);
export const createServiceMessage = (serviceId: number, message: ServiceMessageDTO) => api.post<ServiceMessageDTO>(`/Service/${serviceId}/messages`, message);
export const createService = (service: ServiceDTO) => api.post<ServiceDTO>('/Service', service);
export const closeService = (serviceId: number) => api.post<void>(`/Service/${serviceId}/close`);
export const getMessagesByMemberId = (memberId: number) => api.get<ServiceMessageDTO[]>(`/Service/member/${memberId}/messages`);
export const getLatestServiceIdByMemberId = (memberId: number) => api.get<number>(`/Service/member/${memberId}/latest-service-id`);
