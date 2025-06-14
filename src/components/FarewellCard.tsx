
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Save, X } from "lucide-react";
import ImageModal from "./ImageModal";

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
  onDelete,
}: FarewellCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleSave = () => {
    if (editedContent !== content) {
      onUpdate(id, editedContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDelete(id);
    }
  };

  return (
    <>
      <Card
        className="shadow-lg border border-slate-300 bg-white text-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
      >
        {canEdit && (
          <div className="absolute top-2 right-2 flex space-x-1 z-10">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
                  onClick={handleSave}
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
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
                  className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
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
              <h3 className="text-left text-lg font-bold mb-1">
                <p className="font-semibold text-gray-700">💌 {name}</p>
              </h3>
              <div className="h-0.5 bg-gray-300 mx-auto"></div>
            </div>

            {content.trim() ? (
              <div className="rounded-lg p-4 flex-1">
              {isEditing ? (
                <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="bg-white text-gray-800 border-gray-300 resize-none min-h-[200px] w-full"
                autoFocus
                />
              ) : (
                <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                {content}
                </p>
              )}
              </div>
            ) : null}

            {image_url && (
              <div className="mb-4">
                <img
                  src={image_url}
                  alt="Farewell message"
                  className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setIsImageModalOpen(true)}
                />
              </div>
            )}
            
          </div>
        </CardContent>
      </Card>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={image_url || ""}
        altText={`Image from ${name}'s farewell message`}
      />
    </>
  );
};

export default FarewellCard;
