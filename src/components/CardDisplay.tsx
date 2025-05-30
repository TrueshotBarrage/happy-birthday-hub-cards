
import React from "react";
import FarewellCard from "./FarewellCard";

interface Card {
  id?: string;
  name: string;
  content: string;
  email: string;
  image_url?: string;
  created_at?: string;
  allows_editing?: boolean;
}

interface CardDisplayProps {
  cards: Card[];
  currentUserEmail?: string;
  onUpdateCard: (cardId: string, updatedContent: string) => void;
  onDeleteCard: (cardId: string) => void;
}

const CardDisplay = ({
  cards,
  currentUserEmail,
  onUpdateCard,
  onDeleteCard,
}: CardDisplayProps) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No farewell messages yet!
        </h3>
        <p className="text-gray-500">
          Be the first to share a heartfelt farewell message for our favorite
          resident doctor Josh Kim.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        💝 Farewell Messages ({cards.length}) 🌟
      </h2>
      {/* Updated grid: 1 column on mobile, 2 columns on larger screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <FarewellCard
            key={card.id || index}
            id={card.id!}
            name={card.name}
            content={card.content}
            email={card.email}
            image_url={card.image_url}
            index={index}
            allowsEditing={card.allows_editing}
            canEdit={currentUserEmail === card.email && card.allows_editing}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDisplay;
