
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import AuthForm from '@/components/AuthForm';
import CardForm from '@/components/CardForm';
import CardDisplay from '@/components/CardDisplay';
import { User } from "lucide-react";

interface Card {
  name: string;
  content: string;
  email: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cards, setCards] = useState<Card[]>([]);

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('birthdayCards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('birthdayCards', JSON.stringify(cards));
  }, [cards]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const handleSubmitCard = (newCard: Card) => {
    setCards(prevCards => [...prevCards, newCard]);
    console.log('New card added:', newCard);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            🎉 Birthday Cards App 🎂
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{userEmail}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Form - Takes 1 column */}
          <div className="lg:col-span-1">
            <CardForm onSubmitCard={handleSubmitCard} userEmail={userEmail} />
          </div>
          
          {/* Card Display - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <CardDisplay cards={cards} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Made with 💖 for celebrating special moments</p>
      </footer>
    </div>
  );
};

export default Index;
