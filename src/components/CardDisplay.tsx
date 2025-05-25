
import React from 'react';
import BirthdayCard from './BirthdayCard';

interface Card {
  id?: string;
  name: string;
  content: string;
  email: string;
  created_at?: string;
}

interface CardDisplayProps {
  cards: Card[];
}

const CardDisplay = ({ cards }: CardDisplayProps) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎂</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No birthday cards yet!
        </h3>
        <p className="text-gray-500">
          Be the first to write a heartfelt birthday message.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        🎉 Birthday Wishes ({cards.length}) 🎊
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <BirthdayCard
            key={card.id || index}
            name={card.name}
            content={card.content}
            email={card.email}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDisplay;
