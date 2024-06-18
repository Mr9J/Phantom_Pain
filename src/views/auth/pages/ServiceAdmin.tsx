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
import connection from '@/components/service/SignalR';

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

        const sortedMessages = latestMessages.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());

        const customerData = sortedMessages.map(message => {
          const memberId = message.memberId;
          const member = memberNicknames.find(m => m.memberId === memberId);
          return {
            id: message.memberId,
            name: member ? member.nickname : `廠商 ${message.memberId}`,
            image: member ? `https://cdn.mumumsit158.com/Members/MemberID-${memberId}-ThumbNail.jpg` : 'https://via.placeholder.com/150',
            messageCount: message.messageCount,
            lastMessage: message.messageContent,
            lastMessageDate: new Date(message.messageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messageDate: new Date(message.messageDate).toISOString(),
            unreadMessages: message.unreadMessages
          };
        });

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

          await markMessagesAsRead(selectedCustomerId);

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

        setMessage('');

        const updatedCustomers = customers.map(customer =>
          customer.id === selectedCustomerId ? {
            ...customer,
            lastMessage: newMessage.content,
            lastMessageDate: newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messageDate: newMessage.timestamp.toISOString()
          } : customer
        );

        setCustomers(updatedCustomers.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime()));

        // 發送訊息給 SignalR hub
        connection.invoke("SendMessage", newMessage).catch(err => console.error(err.toString()));

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

          // 發送訊息給 SignalR hub
          connection.invoke("SendMessage", newMessage).catch(err => console.error(err.toString()));

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

  // SignalR 連接與訊息處理
  useEffect(() => {
    connection.on('ReceiveMessage', async (message: Message) => {
      console.log("Received message via SignalR:", message);  // Log received message

      // 檢查訊息的 memberId 是否與當前選中的用戶匹配
      if (selectedCustomerId === message.memberId) {
        setMessages(prevMessages => {
          const newMessage = {
            ...message,
            timestamp: new Date(message.timestamp)
          };
          return [...prevMessages, newMessage];
        });
      }

      setCustomers(prevCustomers => {
        const updatedCustomers = prevCustomers.map(customer =>
          customer.id === message.memberId ? {
            ...customer,
            lastMessage: message.content,
            lastMessageDate: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messageDate: new Date(message.timestamp).toISOString(),
            unreadMessages: customer.id === selectedCustomerId ? 0 : customer.unreadMessages + 1
          } : customer
        );

        return updatedCustomers.sort((a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime());
      });

      // 如果當前選中的用戶是訊息的發送者，標記為已讀
      if (selectedCustomerId === message.memberId) {
        try {
          await markMessagesAsRead(message.memberId);
          setCustomers(prevCustomers => prevCustomers.map(customer =>
            customer.id === message.memberId ? { ...customer, unreadMessages: 0 } : customer
          ));
        } catch (error) {
          console.error('Failed to mark messages as read', error);
        }
      }
    });

    return () => {
      connection.off('ReceiveMessage');
    };
  }, [customers, selectedCustomerId]);

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
