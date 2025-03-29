import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Image, Plus, Trash2, X, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FieldImagesDialog = ({ isOpen, onClose, fieldId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB em bytes

  // Query to fetch images
  let mytoken = localStorage.getItem("token");
  const { data, isLoading } = useQuery({
    queryKey: ['fieldImages', fieldId],
    queryFn: async () => {
      if (!fieldId) return { data: { fieldImages: [] } };
      const response = await axios.get(`http://localhost:3000/field-images/${fieldId}`, {
        headers: {
          Authorization: `Bearer ${mytoken}`, 
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    enabled: !!fieldId && isOpen
  });

  // Mutation to add new image - mantém o funcionamento original
  const addImageMutation = useMutation({
    mutationFn: async (url) => {
      return await axios.post(`http://localhost:3000/field-images/${fieldId}`, { url }, {
        headers: {
          Authorization: `Bearer ${mytoken}`, 
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fieldImages', fieldId]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsUploading(false);
    },
    onError: (error) => {
      console.error('Erro ao adicionar imagem:', error);
      setIsUploading(false);
    }
  });

  // Mutation to delete image
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId) => {
      return await axios.delete(`http://localhost:3000/field-images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${mytoken}`, 
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (response) => {
      console.log(response)
      queryClient.invalidateQueries(['fieldImages', fieldId]);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Verificar o tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      setFileError('O arquivo deve ter menos de 3 MB');
      setSelectedFile(null);
      e.target.value = ''; // Limpar o input
      return;
    }
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      setFileError('O arquivo deve ser uma imagem');
      setSelectedFile(null);
      e.target.value = ''; // Limpar o input
      return;
    }
    
    setSelectedFile(file);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Converter o arquivo para uma URL (objeto local) para visualização
    const fileUrl = URL.createObjectURL(selectedFile);
    
    // Usar a URL no formato esperado pelo backend
    addImageMutation.mutate(fileUrl);
  };

  const handleDeleteImage = (imageId) => {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      deleteImageMutation.mutate(imageId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Image className="mr-2" size={20} /> Gerenciar Imagens da Quadra
          </DialogTitle>
          <DialogDescription>
            Adicione ou remova imagens para esta quadra.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new image form */}
          <form onSubmit={handleAddImage} className="space-y-3">
            <div>
              <Label htmlFor="imageFile">Selecionar Imagem</Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input
                  id="imageFile"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Plus size={16} className="mr-1" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
              {fileError && (
                <p className="text-sm text-red-600 mt-1">{fileError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Tamanho máximo: 3 MB
              </p>
            </div>
          </form>

          {/* Images list */}
          <div className="border rounded-md p-2">
            <h3 className="font-medium mb-2">Imagens da Quadra</h3>
            {isLoading ? (
              <p className="text-center py-4 text-gray-500">Carregando imagens...</p>
            ) : data?.data?.fieldImages?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.data.fieldImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.url} 
                      alt="Imagem da quadra"
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir imagem"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">Nenhuma imagem cadastrada.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-1" /> Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FieldImagesDialog;