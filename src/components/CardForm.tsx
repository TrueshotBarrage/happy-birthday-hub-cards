
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CardFormProps {
  onSubmitCard: (card: { name: string; content: string; email: string; image_url?: string }) => void;
  userName: string;
  userEmail?: string;
}

const CardForm = ({ onSubmitCard, userName, userEmail }: CardFormProps) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('farewell-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage
      .from('farewell-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that either content or image is provided
    if (!content.trim() && !selectedImage) {
      toast({
        title: "Missing content",
        description: "Please either write a message or attach an image",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    let imageUrl: string | undefined;
    
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage) || undefined;
    }
    
    onSubmitCard({ 
      name: userName, 
      content, 
      email: userEmail || '',
      image_url: imageUrl
    });
    
    setContent('');
    setSelectedImage(null);
    setImagePreview(null);
    setUploading(false);
  };

  // Check if form is valid for submission
  const isFormValid = content.trim() || selectedImage;

  return (
    <Card className="shadow-lg border border-slate-600 bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-100">
          Write a Farewell Message 💌
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Your Message
            </label>
            <Textarea
              placeholder="Share your heartfelt farewell message, memories, or wishes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-2 border-slate-600 focus:border-blue-400 rounded-lg min-h-[120px] resize-none bg-slate-700 text-slate-100 placeholder:text-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Add an Image (Optional)
            </label>
            {!imagePreview ? (
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-slate-700/50"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-300">Click to upload an image</p>
                    <p className="text-xs text-slate-400">Max size: 5MB</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={uploading || !isFormValid}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Send Farewell Message 💝'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CardForm;
