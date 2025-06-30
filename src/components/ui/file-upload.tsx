import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (file: File) => void;
  showInstructions?: boolean;
  loading?: boolean;
}

export function FileUpload({ onFileSelect, className, showInstructions = true, loading = false, ...props }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !loading) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, loading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    disabled: loading
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "aspect-[10/16] border-2 border-dashed rounded-lg transition-colors",
        loading ? "border-base-border bg-base-background cursor-not-allowed" : "cursor-pointer",
        isDragActive && !loading ? "border-base-border bg-brand-primary/5" : "border-brand-primary hover:border-base-border",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        {loading ? (
          <>
            <Loader2 className="w-12 h-12 text-brand-accent mb-4 animate-spin" />
            <p className="text-sm text-base-heading font-copy">
              Processing your image...
            </p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-brand-accent mb-4" />
            <p className="text-sm text-base-heading font-copy">
              {isDragActive ? (
                "Drop the file here"
              ) : (
                "Drag and drop your image here, or click to select"
              )}
            </p>
            {showInstructions && (
              <p className="text-xs text-base-paragraph mt-2 font-copy">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}