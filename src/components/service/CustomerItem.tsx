import React from 'react';

type Customer = {
  id: number;
  name: string;
  image: string;
  messageCount: number;
  lastMessage: string;
  lastMessageDate: string; // 添加消息最后发送日期
};

type CustomerItemProps = {
  customer: Customer;
  onClick: () => void;
};

const CustomerItem: React.FC<CustomerItemProps> = ({ customer, onClick }) => {
  return (
    <div className="customer-item" onClick={onClick}>
      <img src={customer.image} alt={customer.name} className="customer-image" />
      <div className="customer-info">
        <span className="customer-name">{customer.name}</span>
        <span className="customer-last-message">{customer.lastMessage}</span>
        <span className="customer-last-message-date">{customer.lastMessageDate}</span>
      </div>
      <span className="customer-message-count">{customer.messageCount}</span>
    </div>
  );
};

export default CustomerItem;
