import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/AuthForm";
import CardForm from "@/components/CardForm";
import CardDisplay from "@/components/CardDisplay";
import { User, LogIn } from "lucide-react";
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
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { toast } = useToast();

  // Fetch cards from Supabase
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("farewell_cards")
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
    setShowAuthForm(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail(undefined);
    setShowAuthForm(false);
  };

  const handleShowAuth = () => {
    setShowAuthForm(true);
  };

  const handleBackToHome = () => {
    setShowAuthForm(false);
  };

  const handleSubmitCard = async (newCard: Card) => {
    try {
      const { data, error } = await supabase
        .from("farewell_cards")
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
        .from("farewell_cards")
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
        .from("farewell_cards")
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

  if (showAuthForm) {
    return <AuthForm onLogin={handleLogin} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => window.location.reload()}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            Messages For Josh
          </button>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{userName}</span>
                  {userEmail && (
                    <span className="text-xs text-slate-400">({userEmail})</span>
                  )}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-800"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleShowAuth}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-800"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login to Post
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
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
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
                {!userEmail && (
                  <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-lg">
                    <p className="text-sm text-amber-300">
                      💡 <strong>Tip:</strong> To edit or delete your messages
                      later, please log out and log back in with your email
                      address.
                    </p>
                  </div>
                )}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💝</div>
                    <h3 className="text-xl font-semibold text-slate-300">
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
        ) : (
          // Public view - only show messages
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-4">
                In Case You Needed To Hear This
              </h2>
              <p className="text-slate-300 mb-6">
                Read the heartfelt messages from colleagues and friends. 
                <Button
                  onClick={handleShowAuth}
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 p-0 ml-1"
                >
                  Login to add your own message!
                </Button>
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-700">
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="text-xl font-semibold text-slate-300">
                    Loading farewell messages...
                  </h3>
                </div>
              ) : (
                <CardDisplay
                  cards={cards}
                  currentUserEmail={undefined}
                  onUpdateCard={() => {}}
                  onDeleteCard={() => {}}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-sm">
        <p>Made with 💖 by Dave Kim</p>
      </footer>
    </div>
  );
};

export default Index;
