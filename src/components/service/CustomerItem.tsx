import React from 'react';
import { Customer } from '@/components/service/types';
import '@/components/service/customerItemAdmin.css';

interface CustomerItemAdminProps {
  customer: Customer;
  onClick: () => void;
  isSelected: boolean;
}

const CustomerItemAdmin: React.FC<CustomerItemAdminProps> = ({ customer, onClick, isSelected }) => {
  return (
    <div
      className={`customer-item-admin ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img src={customer.image} alt={customer.name} className="customer-image" />
      <div className="customer-info">
        <div className="customer-name">{customer.name}</div>
        <div className="customer-last-message">{customer.lastMessage}</div>
        <div className="customer-last-message-date">{customer.lastMessageDate}</div>
      </div>
      {customer.unreadMessages > 0 && (
        <div className="customer-unread-messages">{customer.unreadMessages}</div>
      )}
    </div>
  );
};

export default CustomerItemAdmin;
