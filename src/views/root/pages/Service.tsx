import React, { useState, useEffect } from 'react';
import ChatHeader from '@/components/service/chatheader';
import ChatMessages from '@/components/service/chatmessage';
import ChatFooter from '@/components/service/chatfooter';
import { Message } from '@/components/service/types';
import '@/components/service/service.css';
import { getServicesByMemberId, getServiceMessages, createServiceMessage, createService, closeService, ServiceDTO, ServiceMessageDTO } from '@/components/service/serviceApi';

const Service = () => {
  const [memberId] = useState<number>(7); // 測試的 MemberID 為 10
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [serviceId, setServiceId] = useState<number | null>(null);

  // useEffect 用於初始化歡迎訊息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 1,
      serviceId: 1,
      memberId: 1,
      content: '🎉 歡迎光臨MuMu客服系統！我們隨時為您服務，請問有什麼可以幫您的嗎？😊',
      timestamp: new Date(),
      sender: 'admin'
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    const fetchAllMessages = async () => {
      if (memberId !== null) {
        try {
          const servicesResponse = await getServicesByMemberId(memberId);
          const serviceIds = servicesResponse.data.map(service => service.serviceId);

          const openService = servicesResponse.data.find(service => !service.endDate);

          if (openService) {
            setServiceId(openService.serviceId);
          } else {
            const newService: ServiceDTO = {
              serviceId: 0,
              memberId: memberId,
              statusId: 4, // 初始狀態設置為 4 表示等待客服回應中
              startDate: new Date().toISOString(),
              endDate: null
            };
            const createdServiceResponse = await createService(newService);
            setServiceId(createdServiceResponse.data.serviceId);
          }

          const allMessages: Message[] = [];
          for (const id of serviceIds) {
            const messagesResponse = await getServiceMessages(id);
            const fetchedMessages = messagesResponse.data.map((msg: ServiceMessageDTO) => ({
              id: msg.messageId,
              serviceId: msg.serviceId,
              memberId: msg.memberId,
              adminId: msg.adminId,
              content: msg.messageContent || '',
              timestamp: new Date(msg.messageDate),
              sender: msg.adminId ? 'admin' : 'user' as 'user' | 'admin'
            }));
            allMessages.push(...fetchedMessages);
          }

          allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          // 在合併獲取的訊息和歡迎訊息
          const welcomeMessage: Message = {
            id: 1,
            serviceId: 1,
            memberId: 1,
            content: '🎉 歡迎光臨MuMu客服系統！我們隨時為您服務，請問有什麼可以幫您的嗎？😊',
            timestamp: new Date(),
            sender: 'admin'
          };
          allMessages.unshift(welcomeMessage);

          console.log('Fetched all messages:', allMessages);
          setMessages(allMessages);
        } catch (error) {
          console.error('Failed to fetch all messages', error);
        }
      }
    };

    fetchAllMessages();
  }, [memberId]);

  useEffect(() => {
    const indexes = messages
      .map((message, index) => (message.content.includes(searchTerm) ? index : -1))
      .filter(index => index !== -1);
    setHighlightedIndexes(indexes);
    if (indexes.length > 0) {
      setCurrentIndex(indexes.length - 1);
      document.querySelectorAll('.service-chat-message')[indexes[indexes.length - 1]]?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentIndex(-1);
    }
  }, [searchTerm, messages]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message && serviceId && memberId !== null) {
      const newMessage: Message = {
        id: messages.length + 1,
        serviceId: serviceId,
        memberId: memberId,
        content: message,
        timestamp: new Date(),  // 使用本地時間
        sender: 'user'
      };
      try {
        console.log('Sending message:', newMessage);
        await createServiceMessage(newMessage.serviceId, {
          messageId: newMessage.id,
          serviceId: newMessage.serviceId,
          memberId: newMessage.memberId,
          adminId: null,
          messageContent: newMessage.content,
          messageDate: newMessage.timestamp.toISOString() // 確保時間格式正確
        });
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, newMessage];
          console.log('Updated messages:', updatedMessages);
          return updatedMessages;
        });
        setMessage('');
      } catch (error) {
        console.error('Failed to send message', error);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      setUploading(false);
      if (serviceId && memberId !== null) {
        const newMessage: Message = {
          id: messages.length + 1,
          serviceId: serviceId,
          memberId: memberId,
          content: reader.result as string,
          timestamp: new Date(),
          sender: 'user'
        };
        try {
          await createServiceMessage(newMessage.serviceId, {
            messageId: newMessage.id,
            serviceId: newMessage.serviceId,
            memberId: newMessage.memberId,
            adminId: null,
            messageContent: newMessage.content,
            messageDate: newMessage.timestamp.toISOString()
          });
          setMessages([...messages, newMessage]);
        } catch (error) {
          console.error('Failed to upload file', error);
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      document.querySelectorAll('.service-chat-message')[highlightedIndexes[newIndex]]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < highlightedIndexes.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      document.querySelectorAll('.service-chat-message')[highlightedIndexes[newIndex]]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleLeaveChat = async () => {
      if (serviceId) {
        try {
          await closeService(serviceId);
          console.log(`Service ${serviceId} closed`);
          setServiceId(null);
        } catch (error) {
          console.error('Failed to close service', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleLeaveChat);
    return () => {
      window.removeEventListener('beforeunload', handleLeaveChat);
    };
  }, [serviceId]);

  return (
    <div className="service-chat-container">
      <ChatHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        highlightedIndexes={highlightedIndexes}
        currentIndex={currentIndex}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      />
      <ChatMessages messages={messages} searchTerm={searchTerm} highlightedIndexes={highlightedIndexes} currentIndex={currentIndex} />
      <ChatFooter
        message={message}
        handleMessageChange={handleMessageChange}
        handleSubmit={handleSubmit}
        handleFileUpload={handleFileUpload}
        uploading={uploading}
      />
    </div>
  );
};

export default Service;
