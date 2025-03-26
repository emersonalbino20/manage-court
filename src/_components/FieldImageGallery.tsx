import React, { useState } from 'react';
import {useGetImagesId} from '@/api/courtQuery';

const FieldImageGallery = ({ fieldId }: { fieldId: string }) => {
  
  const { data } = useGetImagesId(fieldId);
  console.log(data)
  return (
    <div className="grid grid-cols-3 gap-4">

      {data?.data.data?.fieldImages.map((image) => {
         const images = image.url*/
        return(
              <img 
                key={image.id} 
                src={images} 
                alt={`Campo ${fieldId} - Imagem ${image.id}`} 
                className="w-full h-auto object-cover"
              />
      )})}
    </div>
  );
};

export default FieldImageGallery;