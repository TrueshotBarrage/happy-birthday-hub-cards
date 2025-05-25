
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface BirthdayCardProps {
  name: string;
  content: string;
  email: string;
  index: number;
}

const BirthdayCard = ({ name, content, email, index }: BirthdayCardProps) => {
  const cardColors = [
    'from-pink-400 to-rose-400',
    'from-purple-400 to-indigo-400',
    'from-yellow-400 to-orange-400',
    'from-green-400 to-teal-400',
    'from-blue-400 to-cyan-400',
    'from-red-400 to-pink-400'
  ];

  const cardColor = cardColors[index % cardColors.length];

  return (
    <Card className={`shadow-lg border-0 bg-gradient-to-br ${cardColor} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">🎉 Happy Birthday! 🎂</h3>
            <div className="w-12 h-0.5 bg-white/50 mx-auto"></div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-white leading-relaxed text-center italic">
              "{content}"
            </p>
          </div>
          
          <div className="text-center">
            <p className="font-semibold text-white/90">
              💝 From: {name}
            </p>
            <p className="text-sm text-white/70 mt-1">
              {email}
            </p>
          </div>
          
          <div className="text-center text-2xl">
            🎈🎊🎁
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthdayCard;
