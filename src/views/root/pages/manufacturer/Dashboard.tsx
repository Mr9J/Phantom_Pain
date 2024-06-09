import React, { useState } from 'react';
import '@/css/style.css';


const Dashboard: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' } as React.CSSProperties}>
      <iframe
        title="V1"
        src="https://app.powerbi.com/view?r=eyJrIjoiZWQ1ZGIyZmEtMDAxZi00YzNkLWFhYWQtMTZkNWIxYTc5MDAyIiwidCI6IjM5OTIzMmZiLTE3ZDEtNDVjYS1iZGE2LTViNTQwNDQxYmQ2MiIsImMiOjEwfQ%3D%3D"
        allowFullScreen={true}
        style={{ width: '100%', height: '100%', border: 'none' } as React.CSSProperties}
      ></iframe>
    </div>
  );
};

export default Dashboard;