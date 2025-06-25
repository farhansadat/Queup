import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Camera, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StaffPhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string) => void;
  staffName?: string;
}

export function StaffPhotoUpload({ currentPhotoUrl, onPhotoChange, staffName }: StaffPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image file.';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB.';
    }
    
    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await convertToBase64(file);
      onPhotoChange(base64);
      toast({
        title: "Photo uploaded",
        description: "Staff photo has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Staff Photo
      </Label>
      
      {/* Current Photo Preview */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={currentPhotoUrl} alt={staffName || "Staff"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
            {staffName ? staffName.substring(0, 2).toUpperCase() : <User className="w-8 h-8" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Upload a professional photo of the staff member
          </p>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-1"
            >
              <Camera className="w-4 h-4" />
              <span>{isUploading ? "Uploading..." : "Choose File"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <CardContent className="py-8">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drag and drop your photo here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click "Choose File" above to browse
            </p>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-primary hover:text-primary/80"
            >
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Photo Requirements:</h4>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3" />
                  <span><strong>Format:</strong> JPEG, PNG, or WebP</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3" />
                  <span><strong>Size:</strong> Maximum 5MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3" />
                  <span><strong>Aspect Ratio:</strong> Square (1:1) recommended</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3" />
                  <span><strong>Quality:</strong> High resolution, well-lit, professional appearance</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}