import React, { useState, useEffect } from 'react';
import ChatHeaderAdmin from '@/components/service/ChatHeaderAdmin';
import ChatMessagesAdmin from '@/components/service/ChatMessagesAdmin';
import ChatFooterAdmin from '@/components/service/ChatFooterAdmin';
import CustomerItemAdmin from '@/components/service/CustomerItemAdmin';
import {
  getLatestMessages,
  getMessagesByMemberId,
  createServiceMessage,
  CustomerMessageDTO,
  ServiceMessageDTO,
  getLatestServiceIdByMemberId,
  markMessagesAsRead,
  getMembersNicknames
} from '@/components/service/serviceApi';
import { Customer, Message } from '@/components/service/types';
import '@/components/service/serviceAdmin.css';

const ServiceAdmin = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [memberNicknames, setMemberNicknames] = useState<{ memberId: number; nickname: string; thumbnail: string }[]>([]);

  useEffect(() => {
    const fetchMembersNicknames = async () => {
      try {
        const response = await getMembersNicknames();
        console.log('Nicknames fetched:', response.data); // 日誌
        setMemberNicknames(response.data);
      } catch (error) {
        console.error('Failed to fetch member nicknames', error);
      }
    };
  
    fetchMembersNicknames();
  }, []);
  
  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const response = await getLatestMessages();
        const latestMessages: CustomerMessageDTO[] = response.data;
  
        console.log('Latest messages fetched:', latestMessages); // 確認數據
  
        const sortedMessages = latestMessages.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());
  
        const customerData = sortedMessages.map(message => {
          const memberId = message.memberId; // 使用小寫 memberId
          const member = memberNicknames.find(m => m.memberId === memberId); // 使用小寫 memberId 和 nickname
          console.log('Member data for message:', member, 'Message:', message, 'MemberId:', memberId); // 確認數據
          return {
            id: message.memberId,
            name: member ? member.nickname : `廠商 ${message.memberId}`, // 使用小寫 nickname
            image: member ? member.thumbnail : 'https://via.placeholder.com/150', // 使用真實圖片
            messageCount: message.messageCount,
            lastMessage: message.messageContent,
            lastMessageDate: new Date(message.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messageDate: message.messageDate,
            unreadMessages: message.unreadMessages
          };
        });
  
        console.log('Customer data:', customerData); // 確認數據
        setCustomers(customerData);
      } catch (error) {
        console.error('Failed to fetch latest messages', error);
      }
    };
  
    if (memberNicknames.length > 0) {
      fetchLatestMessages();
    }
  }, [memberNicknames]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedCustomerId !== null) {
        try {
          const response = await getMessagesByMemberId(selectedCustomerId);
          const fetchedMessages: Message[] = response.data.map((msg: ServiceMessageDTO) => ({
            id: msg.messageId,
            serviceId: msg.serviceId,
            memberId: msg.memberId,
            adminId: msg.adminId,
            content: msg.messageContent || '',
            timestamp: new Date(msg.messageDate),
            sender: msg.adminId ? 'admin' : 'user',
          }));
          setMessages(fetchedMessages);

          // 將所有訊息標記為已讀
          await markMessagesAsRead(selectedCustomerId);

          // 更新客戶未讀訊息數量
          setCustomers(prevCustomers => prevCustomers.map(customer =>
            customer.id === selectedCustomerId ? { ...customer, unreadMessages: 0 } : customer
          ));
        } catch (error) {
          console.error('Failed to fetch messages', error);
        }
      }
    };

    fetchMessages();
  }, [selectedCustomerId]);

  useEffect(() => {
    const indexes = messages.map((message, index) => (message.content.includes(searchTerm) ? index : -1)).filter(index => index !== -1);
    setHighlightedIndexes(indexes);
    if (indexes.length > 0) {
      setCurrentIndex(indexes.length - 1);
      document.querySelectorAll('.chat-message')[indexes[indexes.length - 1]]?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentIndex(-1);
    }
  }, [searchTerm, messages]);

  const handleCustomerClick = (customerId: number) => {
    setSelectedCustomerId(customerId);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message && selectedCustomerId !== null) {
      try {
        const response = await getLatestServiceIdByMemberId(selectedCustomerId);
        const serviceId = response.data;

        const newMessage: Message = {
          id: messages.length + 1,
          serviceId: serviceId,
          memberId: selectedCustomerId,
          adminId: 1,
          content: message,
          timestamp: new Date(),
          sender: 'admin'
        };

        await createServiceMessage(newMessage.serviceId, {
          messageId: newMessage.id,
          serviceId: newMessage.serviceId,
          memberId: newMessage.memberId,
          adminId: newMessage.adminId,
          messageContent: newMessage.content,
          messageDate: newMessage.timestamp.toISOString()
        });

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage('');

        // 更新客戶列表並排序
        setCustomers(prevCustomers => {
          const updatedCustomers = prevCustomers.map(customer =>
            customer.id === selectedCustomerId ? {
              ...customer,
              lastMessage: newMessage.content,
              lastMessageDate: newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              messageDate: newMessage.timestamp.toISOString()
            } : customer
          );

          return updatedCustomers.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());
        });
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
      if (selectedCustomerId !== null) {
        try {
          const response = await getLatestServiceIdByMemberId(selectedCustomerId);
          const serviceId = response.data;

          const newMessage: Message = {
            id: messages.length + 1,
            serviceId: serviceId,
            memberId: selectedCustomerId,
            adminId: 1,
            content: reader.result as string,
            timestamp: new Date(),
            sender: 'admin'
          };
          await createServiceMessage(newMessage.serviceId, {
            messageId: newMessage.id,
            serviceId: newMessage.serviceId,
            memberId: newMessage.memberId,
            adminId: newMessage.adminId,
            messageContent: newMessage.content,
            messageDate: newMessage.timestamp.toISOString()
          });

          setMessages([...messages, newMessage]);

          setCustomers(prevCustomers => {
            const updatedCustomers = prevCustomers.map(customer =>
              customer.id === selectedCustomerId ? {
                ...customer,
                lastMessage: newMessage.content,
                lastMessageDate: newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                messageDate: newMessage.timestamp.toISOString()
              } : customer
            );
            return updatedCustomers.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());
          });
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
      document.querySelectorAll('.chat-message')[highlightedIndexes[newIndex]]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < highlightedIndexes.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      document.querySelectorAll('.chat-message')[highlightedIndexes[newIndex]]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="service-admin-container">
      <div className="service-admin-sidebar">
        {customers.map(customer => (
          <CustomerItemAdmin
            key={customer.id}
            customer={customer}
            onClick={() => handleCustomerClick(customer.id)}
            isSelected={selectedCustomerId === customer.id}
          />
        ))}
      </div>
      <div className="service-admin-chat-container">
        {selectedCustomerId === null ? (
          <div className="no-customer-selected">請選擇一位客戶以開始對話</div>
        ) : (
          <>
            <ChatHeaderAdmin
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              highlightedIndexes={highlightedIndexes}
              currentIndex={currentIndex}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
            <ChatMessagesAdmin
              messages={messages}
              searchTerm={searchTerm}
              highlightedIndexes={highlightedIndexes}
              currentIndex={currentIndex}
            />
            <ChatFooterAdmin
              message={message}
              handleMessageChange={handleMessageChange}
              handleSubmit={handleSubmit}
              handleFileUpload={handleFileUpload}
              uploading={uploading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceAdmin;
