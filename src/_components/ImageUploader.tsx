import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import FeedbackDialog from '@/_components/FeedbackDialog';

// Componente de Upload de Imagens
const ImageUploader = ({ 
  onImageUpload, 
  maxImages = 1 
}) => {
  const [images, setImages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleImageUpload = async (files) => {
    const uploadedImages = [];

    for (const file of files) {
      // Verificar tamanho máximo (5MB)
      if (file.size > 3 * 1024 * 1024) {
        setIsSuccess(false);
        setFeedbackMessage(`A imagem ${file.name} excede o tamanho máximo de 3MB`);
        setDialogOpen(true);
        continue;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        const mytoken = localStorage.getItem("token");
        const response = await axios.post('http://localhost:3000/uploads/images', formData, {
          headers: {
            'Authorization': `Bearer ${mytoken}`, 
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.data?.imageUrl) {
          uploadedImages.push(response.data.data.imageUrl);
        }
      } catch (error) {
        setIsSuccess(false);
        setFeedbackMessage(`Erro ao carregar a imagem`);
        setDialogOpen(true);
      }
    }

    return uploadedImages;
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    
    if (images.length + files.length > maxImages) {
      //alert();
        setIsSuccess(false);
        setFeedbackMessage(`Você pode fazer upload de no máximo ${maxImages} imagem`);
        setDialogOpen(true);
      return;
    }

    const uploadedImages = await handleImageUpload(files);
    
    const newImages = [...images, ...uploadedImages];
    setImages(newImages);
    onImageUpload(newImages);
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImageUpload(newImages);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden" 
          id="image-upload"
        />
        <label 
          htmlFor="image-upload" 
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
        >
          <Upload size={16} className="mr-2" />
          Fazer Upload de Imagens
        </label>
        <span className="text-sm text-gray-500">
          (Máx. {maxImages} imagem, 3MB cada)
        </span>
      </div>
      
      {images.length > 0 && (
        <div className="flex space-x-2 mt-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
                alt={`Imagem ${index + 1}`} 
                className="w-20 h-20 object-cover rounded"
              />
              <button 
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
      />
    </div>
  );
};

export default ImageUploader;
