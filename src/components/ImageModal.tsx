
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

const ImageModal = ({ isOpen, onClose, imageUrl, altText }: ImageModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset zoom to fit image when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const containerWidth = window.innerWidth * 0.95;
    const containerHeight = window.innerHeight * 0.95;
    
    // Calculate zoom to fit entire image in viewport
    const scaleX = containerWidth / img.naturalWidth;
    const scaleY = containerHeight / img.naturalHeight;
    const initialZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    setZoom(initialZoom);
    setImageLoaded(true);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.1));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `farewell-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClose = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setImageLoaded(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/90" />
      <DialogContent className="max-w-none w-[95vw] h-[95vh] p-0 bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">
          {altText || "Full size image"}
        </DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Control buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              onClick={handleZoomOut}
              disabled={zoom <= 0.1}
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleReset}
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleClose}
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom indicator */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {Math.round(zoom * 100)}%
          </div>

          {/* Image container */}
          <div
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageUrl}
              alt={altText || "Full size image"}
              className="max-w-none max-h-none object-contain select-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                opacity: imageLoaded ? 1 : 0,
              }}
              onLoad={handleImageLoad}
              draggable={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
