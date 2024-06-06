import React, { useState, useEffect } from 'react';
import ChatHeaderAdmin from '@/components/service/ChatHeaderAdmin';
import ChatMessagesAdmin from '@/components/service/ChatMessagesAdmin';
import ChatFooterAdmin from '@/components/service/ChatFooterAdmin';
import CustomerItemAdmin from '@/components/service/CustomerItemAdmin';
import { getLatestMessages, getMessagesByMemberId, createServiceMessage, CustomerMessageDTO, ServiceMessageDTO, getLatestServiceIdByMemberId } from '@/components/service/serviceApi';
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

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const response = await getLatestMessages();
        const latestMessages: CustomerMessageDTO[] = response.data;

        const customerData: Customer[] = latestMessages.map((message: CustomerMessageDTO) => ({
          id: message.memberId,
          name: `客戶 ${message.memberId}`,
          image: 'https://via.placeholder.com/150',
          messageCount: message.messageCount, // 正確映射 messageCount
          lastMessage: message.messageContent,
          lastMessageDate: new Date(message.messageDate).toLocaleString(),
        }));

        // 根據最後留言時間進行排序
        customerData.sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());

        setCustomers(customerData);
      } catch (error) {
        console.error('Failed to fetch latest messages', error);
      }
    };

    fetchLatestMessages();
  }, []);

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
            sender: msg.adminId ? 'admin' : 'user' as 'admin' | 'user',
          }));
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Failed to fetch messages', error);
        }
      }
    };

    fetchMessages();
  }, [selectedCustomerId]);

  useEffect(() => {
    const indexes = messages
      .map((message, index) => (message.content.includes(searchTerm) ? index : -1))
      .filter(index => index !== -1);
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
        // 找到最新的 ServiceID
        const response = await getLatestServiceIdByMemberId(selectedCustomerId);
        const serviceId = response.data;

        const newMessage: Message = {
          id: messages.length + 1,
          serviceId: serviceId,
          memberId: selectedCustomerId,
          adminId: 1, // 這裡設置為具體的adminId
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
            adminId: 1, // 這裡設置為具體的adminId
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
