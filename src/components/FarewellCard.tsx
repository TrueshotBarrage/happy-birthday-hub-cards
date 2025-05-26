
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Save, X } from "lucide-react";

interface FarewellCardProps {
  id: string;
  name: string;
  content: string;
  email: string;
  image_url?: string;
  index: number;
  allowsEditing?: boolean;
  canEdit: boolean;
  onUpdate: (cardId: string, updatedContent: string) => void;
  onDelete: (cardId: string) => void;
}

const FarewellCard = ({ 
  id, 
  name, 
  content, 
  email, 
  image_url,
  index, 
  allowsEditing, 
  canEdit, 
  onUpdate, 
  onDelete 
}: FarewellCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const cardColors = [
    'from-orange-400 to-red-400',
    'from-red-400 to-pink-400',
    'from-pink-400 to-purple-400',
    'from-purple-400 to-indigo-400',
    'from-indigo-400 to-blue-400',
    'from-blue-400 to-cyan-400'
  ];

  const cardColor = cardColors[index % cardColors.length];

  const handleSave = () => {
    if (editedContent.trim() && editedContent !== content) {
      onUpdate(id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(id);
    }
  };

  return (
    <Card className={`shadow-lg border-0 bg-gradient-to-br ${cardColor} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative`}>
      {canEdit && (
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={handleSave}
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={handleCancel}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">💝 Farewell Message 🌟</h3>
            <div className="w-12 h-0.5 bg-white/50 mx-auto"></div>
          </div>
          
          {image_url && (
            <div className="mb-4">
              <img
                src={image_url}
                alt="Farewell message"
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="bg-white/90 text-gray-800 border-0 resize-none min-h-[100px]"
                autoFocus
              />
            ) : (
              <p className="text-white leading-relaxed text-center italic">
                "{content}"
              </p>
            )}
          </div>
          
          <div className="text-center">
            <p className="font-semibold text-white/90">
              💌 From: {name}
            </p>
            {allowsEditing && (
              <p className="text-sm text-white/70 mt-1">
                {email}
              </p>
            )}
          </div>
          
          <div className="text-center text-2xl">
            🌟💝🌈
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarewellCard;
