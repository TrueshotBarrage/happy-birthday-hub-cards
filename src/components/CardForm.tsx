
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";

interface CardFormProps {
  onSubmitCard: (card: { name: string; content: string; email: string }) => void;
  userEmail: string;
}

const CardForm = ({ onSubmitCard, userEmail }: CardFormProps) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState(userEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && content.trim() && email.trim()) {
      onSubmitCard({ name, content, email });
      setName('');
      setContent('');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
          <Pen className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">
          Write a Birthday Card 🎁
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-yellow-200 focus:border-yellow-400 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthday Message
            </label>
            <Textarea
              placeholder="Write your heartfelt birthday wishes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-2 border-yellow-200 focus:border-yellow-400 rounded-lg min-h-[120px] resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-yellow-200 focus:border-yellow-400 rounded-lg"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Send Birthday Wishes 🌟
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CardForm;
