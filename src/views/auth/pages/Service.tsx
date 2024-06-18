import React, { useState, useEffect } from 'react';
import ChatHeader from '@/components/service/chatheader';
import ChatMessages from '@/components/service/chatmessage';
import ChatFooter from '@/components/service/chatfooter';
import FAQComponent from '@/components/service/FAQComponents';
import { Message } from '@/components/service/types';
import '@/components/service/service.css';
import {
  getServicesByMemberId,
  getServiceMessages,
  createServiceMessage,
  createService,
  closeService,
  getMembersNicknames,
  ServiceDTO,
  ServiceMessageDTO,
} from '@/components/service/serviceApi';
import { useUserContext } from '@/context/AuthContext';
import connection from '@/components/service/SignalR';

const Service: React.FC = () => {
  const { user } = useUserContext();
  const [memberId, setMemberId] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [serviceId, setServiceId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setMemberId(Number(user.id));
    }
  }, [user]);

  useEffect(() => {
    const fetchNickname = async () => {
      if (memberId !== null) {
        try {
          const response = await getMembersNicknames();
          const member = response.data.find(m => m.memberId === memberId);
          if (member) {
            setNickname(member.nickname);
          }
        } catch (error) {
          console.error('Failed to fetch member nickname', error);
        }
      }
    };

    fetchNickname();
  }, [memberId]);

  useEffect(() => {
    if (nickname) {
      const welcomeMessage: Message = {
        id: 0,
        serviceId: 0,
        memberId: 0,
        content: `${nickname} 廠商您好🎉 歡迎光臨MuMu客服系統！我們隨時為您服務。您可以先點擊常見問答，如果仍有疑問，請留言，我們的真人客服將為您提供進一步的幫助！😊`,
        timestamp: new Date(),
        sender: 'admin'
      };
      setMessages([welcomeMessage]);
    }
  }, [nickname]);

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
              statusId: 4,
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

          const uniqueMessages = Array.from(new Set(allMessages.map(m => m.id)))
            .map(id => allMessages.find(m => m.id === id) as Message);

          setMessages(prevMessages => [prevMessages[0], ...uniqueMessages]);
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

        setMessage('');

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

  useEffect(() => {
    if (serviceId !== null) {
      const handleReceiveMessage = (message: Message) => {
        console.log("Message received from SignalR:", message);
        if (message.serviceId === serviceId) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      };

      connection.on('ReceiveMessage', handleReceiveMessage);

      return () => {
        connection.off('ReceiveMessage', handleReceiveMessage);
      };
    }
  }, [serviceId]);

  const generateUniqueId = (): number => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000); // 生成一個0到999之間的隨機數
    return parseInt(`${timestamp}${randomNum}`, 10);
  };

  const handleFAQClick = (question: string, answer: string) => {
    if (serviceId && memberId) {
      console.log("FAQ answer clicked:", answer);
      const questionMessage: Message = {
        id: generateUniqueId(),
        serviceId: serviceId,
        memberId: memberId,
        content: question,
        timestamp: new Date(),
        sender: 'user'
      };
      const faqMessage: Message = {
        id: generateUniqueId(),
        serviceId: serviceId,
        memberId: memberId,
        content: `${question}: ${answer}`,
        timestamp: new Date(),
        sender: 'admin'
      };
      console.log("Adding FAQ message:", faqMessage);

      // 更新訊息列表，立即添加問題
      setMessages(prevMessages => [...prevMessages, questionMessage]);

      // 延遲一秒後添加答案
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, faqMessage]);
        connection.invoke("SendMessage", faqMessage)
          .then(() => {
            console.log("Message sent via SignalR:", faqMessage);
          })
          .catch(err => {
            console.error(err.toString());
          });
      }, 1000);
    }
  };

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
      <FAQComponent onQuestionClick={handleFAQClick} />
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
