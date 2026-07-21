'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { uploadImage } from '@/lib/api';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImage, label = "Image" }) => {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const token = (session?.user as any)?.token;
      const result = await uploadImage(file, token);
      setPreview(result.url);
      onImageUploaded(result.url);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#111111]">{label}</label>
      
      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer px-4 py-3 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-center">
          <input
            type="file"
            accept="image/*"
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
              {preview ? "Changer l'image" : "Choisir une image"}
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
