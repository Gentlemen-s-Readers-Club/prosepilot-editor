import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (file: File) => void;
  showInstructions?: boolean;
}

export function FileUpload({ onFileSelect, className, showInstructions = true, ...props }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "aspect-[10/16] border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        isDragActive ? "border-base-border bg-brand-primary/5" : "border-gray-300 hover:border-base-border",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600">
            {isDragActive ? (
              "Drop the file here"
            ) : (
              "Drag and drop your image here, or click to select"
            )}
          </p>
          {showInstructions && (
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, GIF (max 5MB)
            </p>
          )}
      </div>
    </div>
  );
}