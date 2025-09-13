import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setUploadedImage(imageData);
        onImageUpload(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          {uploadedImage ? (
            <div className="space-y-4">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-muted-foreground">
                图片已上传成功！点击下方按钮重新选择图片。
              </p>
              <Button onClick={onButtonClick} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                重新选择图片
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">上传图片</p>
                <p className="text-sm text-muted-foreground">
                  拖拽图片到此处，或点击按钮选择文件
                </p>
              </div>
              <Button onClick={onButtonClick}>
                <Upload className="w-4 h-4 mr-2" />
                选择图片
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;

