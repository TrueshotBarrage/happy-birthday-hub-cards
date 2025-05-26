
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";

interface CardFormProps {
  onSubmitCard: (card: { name: string; content: string; email: string }) => void;
  userName: string;
  userEmail?: string;
}

const CardForm = ({ onSubmitCard, userName, userEmail }: CardFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmitCard({ 
        name: userName, 
        content, 
        email: userEmail || '' 
      });
      setContent('');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-2">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">
          Write a Farewell Message 💌
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <Textarea
              placeholder="Share your heartfelt farewell message, memories, or wishes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-2 border-orange-200 focus:border-orange-400 rounded-lg min-h-[120px] resize-none"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Send Farewell Message 💝
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CardForm;
