import React, { useState, useCallback } from 'react';
import ImageCropper from './ImageCropper';
import { getSupabase } from '../../lib/supabase';

interface ImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setSelectedImage(imageDataUrl);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCameraClick = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      // Create a video element to capture the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // For now, just log - full camera implementation would require more complex UI
      console.log('Camera access granted');
      alert('Camera feature coming soon! Please use file upload for now.');
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access denied. Please use file upload instead.');
    }
  }, []);

  const handleCropComplete = useCallback(async (croppedImageBlob: Blob) => {
    setIsUploading(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `garment_${timestamp}_${randomId}.jpg`;
      
      // Upload to Supabase Storage
      const supabase = getSupabase();
      const { data, error } = await supabase.storage
        .from('garment-images')
        .upload(fileName, croppedImageBlob, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
      
      // Get public URL
      const { data: { publicUrl } } = getSupabase().storage
        .from('garment-images')
        .getPublicUrl(fileName);
      
      // Call the parent callback
      onImageUploaded?.(publicUrl);
      
      // Reset state
      setSelectedImage(null);
      setShowCropper(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded]);

  const handleCropCancel = useCallback(() => {
    setSelectedImage(null);
    setShowCropper(false);
  }, []);

  if (showCropper && selectedImage) {
    return (
      <ImageCropper
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        isUploading={isUploading}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
      <label className="cursor-pointer flex flex-col items-center justify-center p-4 w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 mb-4 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className="text-sm">Drag 'n' drop an image or click to select</p>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      <button
        onClick={handleCameraClick}
        className="w-full px-4 py-3 bg-blue-500 text-white text-center font-semibold rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm"
        style={{ minHeight: '44px', minWidth: '44px' }} // Ensure minimum touch target size
      >
        Use Camera
      </button>
    </div>
  );
};

export default ImageUpload;