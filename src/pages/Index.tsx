import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/AuthForm";
import CardForm from "@/components/CardForm";
import CardDisplay from "@/components/CardDisplay";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Card {
  id?: string;
  name: string;
  content: string;
  email: string;
  image_url?: string;
  created_at?: string;
  allows_editing?: boolean;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch cards from Supabase
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("birthday_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cards:", error);
        toast({
          title: "Error",
          description: "Failed to load farewell messages",
          variant: "destructive",
        });
        return;
      }

      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load cards from Supabase on component mount
  useEffect(() => {
    fetchCards();
  }, []);

  const handleLogin = async (name: string, email?: string) => {
    setUserName(name);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail(undefined);
  };

  const handleSubmitCard = async (newCard: Card) => {
    try {
      const { data, error } = await supabase
        .from("birthday_cards")
        .insert([
          {
            name: newCard.name,
            content: newCard.content,
            email: newCard.email,
            image_url: newCard.image_url,
            allows_editing: !!userEmail,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error inserting card:", error);
        toast({
          title: "Error",
          description: "Failed to save farewell message",
          variant: "destructive",
        });
        return;
      }

      // Add the new card to the beginning of the list
      setCards((prevCards) => [data, ...prevCards]);

      toast({
        title: "Success! 🎉",
        description: "Your farewell message has been sent!",
      });

      console.log("New card added:", data);
    } catch (error) {
      console.error("Error submitting card:", error);
      toast({
        title: "Error",
        description: "Failed to save farewell message",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCard = async (cardId: string, updatedContent: string) => {
    try {
      const { error } = await supabase
        .from("birthday_cards")
        .update({ content: updatedContent })
        .eq("id", cardId);

      if (error) {
        console.error("Error updating card:", error);
        toast({
          title: "Error",
          description: "Failed to update message",
          variant: "destructive",
        });
        return;
      }

      // Update the card in the local state
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, content: updatedContent } : card
        )
      );

      toast({
        title: "Updated! ✏️",
        description: "Your message has been updated",
      });
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { status, error } = await supabase
        .from("birthday_cards")
        .delete()
        .eq("id", cardId);

      console.log(status);

      if (error) {
        console.error("Error deleting card:", error);
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive",
        });
        return;
      }

      // Remove the card from local state
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));

      toast({
        title: "Deleted! 🗑️",
        description: "Your message has been deleted",
      });
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-orange-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            💝 Farewell Messages App 🌟
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{userName}</span>
              {userEmail && (
                <span className="text-xs text-gray-500">({userEmail})</span>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
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
            <CardForm
              onSubmitCard={handleSubmitCard}
              userName={userName}
              userEmail={userEmail}
            />
          </div>

          {/* Card Display - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              {!userEmail && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    💡 <strong>Tip:</strong> To edit or delete your messages
                    later, please log out and log back in with your email
                    address.
                  </p>
                </div>
              )}
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    Loading farewell messages...
                  </h3>
                </div>
              ) : (
                <CardDisplay
                  cards={cards}
                  currentUserEmail={userEmail}
                  onUpdateCard={handleUpdateCard}
                  onDeleteCard={handleDeleteCard}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Made with 💖 by Dave Kim</p>
      </footer>
    </div>
  );
};

export default Index;
