import React from 'react';
import "@/css/card.css";
import Card, { CardProps } from '@/components/admin/Card'; 

const Home: React.FC = () => {
  const cards: CardProps[] = [
    { title: 'Mountain View', copy: 'Check out all of these gorgeous mountain trips with beautiful views of, you guessed it, the mountains', button: 'View Trips' },
    { title: 'To The Beach', copy: 'Plan your next beach trip with these fabulous destinations', button: 'View Trips' },
    { title: 'Desert Destinations', copy: "It's the desert you've always dreamed of", button: 'Book Now' },
    { title: 'Explore The Galaxy', copy: 'Seriously, straight up, just blast off into outer space today', button: 'Book Now' },
  ];

  return (
    <main className="page-content">
      {cards.map((card, index) => (
        <Card
          key={index} // 使用 index 作為 key，這不是最佳實踐，建議用唯一 id
          title={card.title}
          copy={card.copy}
          button={card.button}
        />
      ))}
    </main>
  );
}

export default Home;