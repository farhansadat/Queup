import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUrlChange?: (url: string) => void;
  accept?: string;
  currentUrl?: string;
  label?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onUrlChange,
  accept = "image/*",
  currentUrl = "",
  label = "Upload File",
  className = ""
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl);
  const [urlInput, setUrlInput] = useState<string>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    onFileSelect(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput && onUrlChange) {
      onUrlChange(urlInput);
      setPreview(urlInput);
    }
  };

  const clearPreview = () => {
    setPreview("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onUrlChange) {
      onUrlChange("");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex space-x-2">
        <Input
          type="url"
          placeholder="Or paste image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="input-field"
        />
        <Button 
          type="button" 
          onClick={handleUrlSubmit}
          disabled={!urlInput}
          variant="outline"
        >
          Load
        </Button>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-32 mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={clearPreview}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-gray-500">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Drop files here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF</p>
          </div>
        )}
      </div>
    </div>
  );
}
