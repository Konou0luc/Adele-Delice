'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { uploadImage } from '@/lib/api';
import { FaTrash } from 'react-icons/fa';

interface MultiImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  currentImages?: string[];
  label?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ onImagesUploaded, currentImages = [], label = "Images" }) => {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);

    try {
      const token = (session?.user as any)?.token;
      const newImages: string[] = [];
      
      for (const file of files) {
        const result = await uploadImage(file, token);
        newImages.push(result.url);
      }
      
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesUploaded(updatedImages);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#111111]">{label}</label>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer px-4 py-3 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-[#787774]">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#111111]"></div>
              Upload en cours...
            </div>
          ) : (
            <div className="text-[#787774]">
              Choisir des images (plusieurs possibles)
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default MultiImageUpload;
