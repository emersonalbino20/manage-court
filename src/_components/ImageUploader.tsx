import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
const token = localStorage.getItem("token");

// Função para upload de imagens
const handleImageUpload = async (files: File[]) => {
  const uploadedImages = [];

  // Validações
  for (const file of files) {
    // Verificar tamanho máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`A imagem ${file.name} excede o tamanho máximo de 5MB`);
      continue;
    }

    // Criar FormData para upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Upload para a rota de uploads
      const mytoken = localStorage.getItem("token");
      const response = await axios.post('http://localhost:3000/uploads/images', formData, {
        headers: {
          'Authorization': `Bearer ${mytoken}`, 
          'Content-Type': 'multipart/form-data'
        }
      });

      // Adicionar URL da imagem uploadada
      if (response.data.data?.imageUrl) {
        uploadedImages.push(response.data.data.imageUrl);
      }
    } catch (error) {
      console.log('Erro no upload da imagem:', error);
      alert(`Erro no upload da imagem ${file.name}`);
    }
  }

  return uploadedImages;
};

// Componente de Upload de Imagens
const ImageUploader = ({ 
  onImageUpload, 
  maxImages = 1 
}) => {
  const [images, setImages] = useState([]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    
    // Limitar número de imagens
    if (images.length + files.length > maxImages) {
      alert(`Você pode fazer upload de no máximo ${maxImages} imagem`);
      return;
    }

    const uploadedImages = await handleImageUpload(files);
    
    // Atualizar estado local e chamar callback
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
          (Máx. {maxImages} imagens, 5MB cada)
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
    </div>
  );
};

export default ImageUploader;