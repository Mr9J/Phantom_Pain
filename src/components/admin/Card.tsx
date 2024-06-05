import React from 'react';

export interface CardProps {
  title: string;
  copy: string;
  button: string;
}
const Card: React.FC<CardProps> = ({ title, copy, button }) => (
  <div className="card">
    <div className="content">
      <h2 className="title">{title}</h2>
      <p className="copy">{copy}</p>
      <button className="btn">{button}</button>
    </div>
  </div>
);

export default Card;