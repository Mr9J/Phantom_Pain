import React from 'react';

type Customer = {
  id: number;
  name: string;
  image: string;
  messageCount: number;
  lastMessage: string;
  lastMessageDate: string;
};

type CustomerItemAdminProps = {
  customer: Customer;
  onClick: () => void;
  isSelected: boolean;
};

const CustomerItemAdmin: React.FC<CustomerItemAdminProps> = ({ customer, onClick, isSelected }) => {
  const itemClass = isSelected ? 'admin-customer-item selected' : 'admin-customer-item';

  return (
    <div className={itemClass} onClick={onClick}>
      <img src={customer.image} alt={customer.name} className="admin-customer-image" />
      <div className="admin-customer-info">
        <span className="admin-customer-name">{customer.name}</span>
        <span className="admin-customer-last-message">{customer.lastMessage}</span>
        <span className="admin-customer-last-message-date">{customer.lastMessageDate}</span>
        <span className="admin-customer-message-count">{customer.messageCount}</span>
      </div>
    </div>
  );
};

export default CustomerItemAdmin;
