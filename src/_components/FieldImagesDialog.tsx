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
import FeedbackDialog from '@/_components/FeedbackDialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FieldImagesDialog = ({ isOpen, onClose, fieldId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const [erro, setErro] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB em bytes
  const MAX_FILES = 5; // Máximo de 5 arquivos

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

  // Mutation to add new image
  const addImageMutation = useMutation({
  mutationFn: async (files) => {
    const mytoken = localStorage.getItem("token");
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Upload da imagem para o servidor
        const response = await axios.post('http://localhost:3000/uploads/images', formData, {
          headers: {
            'Authorization': `Bearer ${mytoken}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        // Se o upload for bem-sucedido, adiciona a URL retornada
        if (response.data.data?.imageUrl) {
          uploadedImages.push(response.data.data.imageUrl);
        }
      } catch (error) {
        //console.error('Erro no upload da imagem:', error);
        setErro(error);
        setIsSuccess(false);
        setFeedbackMessage("Erro no upload da imagem:");
        setDialogOpen(true);
        throw new Error(`Erro ao fazer upload da imagem ${file.name}`);
      }
    }

    // Salvar as URLs no backend associadas ao fieldId
    const savePromises = uploadedImages.map(imageUrl =>
      axios.post(`http://localhost:3000/field-images/${fieldId}`, 
        { url: imageUrl }, // Enviar no formato { url: "a url" }
        {
          headers: {
            Authorization: `Bearer ${mytoken}`,
            "Content-Type": "application/json",
          },
        }
      )
    );

    return Promise.all(savePromises);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['fieldImages', fieldId]);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsUploading(false);
  },
  onError: (error) => {
    setErro(error);
    setIsSuccess(false);
    setFeedbackMessage("Erro ao adicionar imagens");
    setDialogOpen(true);
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
      queryClient.invalidateQueries(['fieldImages', fieldId]);
    }
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');
    
    if (!files.length) {
      setSelectedFiles([]);
      return;
    }
    
    // Verificar o número máximo de arquivos
    if (files.length > MAX_FILES) {
      //setFileError();
      setIsSuccess(false);
      setFeedbackMessage(`Você pode selecionar no máximo ${MAX_FILES} imagens de uma vez`);
      setDialogOpen(true);
      setSelectedFiles([]);
      e.target.value = ''; // Limpar o input
      return;
    }
    
    // Verificar cada arquivo
    const validFiles = [];
    for (const file of files) {
      // Verificar o tamanho do arquivo
      if (file.size > MAX_FILE_SIZE) {
        setIsSuccess(false);
        setFeedbackMessage(`O arquivo ${file.name} excede o tamanho máximo de 3 MB`);
        setDialogOpen(true);
        setSelectedFiles([]);
        e.target.value = ''; // Limpar o input
        return;
      }
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        
        setIsSuccess(false);
        setFeedbackMessage(`O arquivo ${file.name} não é uma imagem válida`);
        setDialogOpen(true);
        setSelectedFiles([]);
        e.target.value = ''; // Limpar o input
        return;
      }
      
      validFiles.push(file);
    }
    
    setSelectedFiles(validFiles);
  };

  const handleAddImages = (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return;
    
    setIsUploading(true);
    addImageMutation.mutate(selectedFiles);
  };

  const handleDeleteImage = (imageId) => {
      deleteImageMutation.mutate(imageId);
  };

  return (
    <>
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
          {/* Add new images form */}
          <form onSubmit={handleAddImages} className="space-y-3">
            <div>
              <Label htmlFor="imageFile">Selecionar Imagens</Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input
                  id="imageFile"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                  multiple
                />
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!selectedFiles.length || isUploading}
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
                Até 5 imagens, máximo 3 MB cada
              </p>
              
              {/* Preview das imagens selecionadas */}
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">{selectedFiles.length} {selectedFiles.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative w-16 h-16">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = [...selectedFiles];
                            newFiles.splice(index, 1);
                            setSelectedFiles(newFiles);
                          }}
                          className="absolute -top-1 -right-1 bg-red-600 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center"
                          title="Remover imagem"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Images list */}
          <div className="border rounded-md p-2">
            <h3 className="font-medium mb-2">Imagens da Quadra</h3>
            {isLoading ? (
              <p className="text-center py-4 text-gray-500">Carregando imagens...</p>
            ) : data?.data?.fieldImages?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                {data.data.fieldImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.url} 
                      alt="Imagem da quadra"
                      className="w-full h-24 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir imagem"
                    >
                      <Trash2 size={12} />
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
    <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />
    </>
  );
};

export default FieldImagesDialog;