
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from '@/components/AuthForm';
import CardForm from '@/components/CardForm';
import CardDisplay from '@/components/CardDisplay';
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Card {
  id?: string;
  name: string;
  content: string;
  email: string;
  created_at?: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch cards from Supabase
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('birthday_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        toast({
          title: "Error",
          description: "Failed to load birthday cards",
          variant: "destructive",
        });
        return;
      }

      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cards from Supabase on component mount
  useEffect(() => {
    fetchCards();
  }, []);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const handleSubmitCard = async (newCard: Card) => {
    try {
      const { data, error } = await supabase
        .from('birthday_cards')
        .insert([{
          name: newCard.name,
          content: newCard.content,
          email: newCard.email
        }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting card:', error);
        toast({
          title: "Error",
          description: "Failed to save birthday card",
          variant: "destructive",
        });
        return;
      }

      // Add the new card to the beginning of the list
      setCards(prevCards => [data, ...prevCards]);
      
      toast({
        title: "Success! 🎉",
        description: "Your birthday card has been sent!",
      });

      console.log('New card added:', data);
    } catch (error) {
      console.error('Error submitting card:', error);
      toast({
        title: "Error",
        description: "Failed to save birthday card",
        variant: "destructive",
      });
    }
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎂</div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    Loading birthday cards...
                  </h3>
                </div>
              ) : (
                <CardDisplay cards={cards} />
              )}
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
