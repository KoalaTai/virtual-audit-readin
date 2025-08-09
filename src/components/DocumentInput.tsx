import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, File, X, CheckCircle, AlertCircle, BookOpen } from '@phosphor-icons/react';
import { extractTextFromPDF, isPDFFile, formatFileSize, createDocumentPreview } from '@/lib/pdf-parser';
import SampleDocuments from './SampleDocuments';
import { toast } from 'sonner';

interface DocumentInputProps {
  onDocumentChange: (text: string, filename?: string) => void;
  documentText: string;
  currentFilename?: string;
}

interface FileUploadState {
  file: File | null;
  isProcessing: boolean;
  extractedText: string;
  error: string | null;
}

export default function DocumentInput({ onDocumentChange, documentText, currentFilename }: DocumentInputProps) {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    isProcessing: false,
    extractedText: '',
    error: null
  });
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'text'>('samples');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isPDFFile(file)) {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadState({
      file,
      isProcessing: true,
      extractedText: '',
      error: null
    });

    try {
      toast.loading('Extracting text from PDF...', { id: 'pdf-processing' });
      
      const extractedText = await extractTextFromPDF(file);
      
      setUploadState({
        file,
        isProcessing: false,
        extractedText,
        error: null
      });

      // Update parent component with extracted text
      onDocumentChange(extractedText, file.name);
      
      toast.success(`Successfully extracted ${extractedText.length} characters from ${file.name}`, { 
        id: 'pdf-processing' 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF file';
      
      setUploadState({
        file,
        isProcessing: false,
        extractedText: '',
        error: errorMessage
      });

      toast.error(errorMessage, { id: 'pdf-processing' });
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const file = event.dataTransfer.files[0];
    if (!file) return;

    // Create a fake input event to reuse existing logic
    const fakeEvent = {
      target: { files: [file] }
    } as React.ChangeEvent<HTMLInputElement>;
    
    await handleFileSelect(fakeEvent);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearFile = () => {
    setUploadState({
      file: null,
      isProcessing: false,
      extractedText: '',
      error: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clear document text when file is removed
    onDocumentChange('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-primary" />
          Document Input
        </CardTitle>
        <CardDescription>
          Upload a PDF document or paste content directly for compliance analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'samples' | 'upload' | 'text')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="samples" className="flex items-center gap-2">
              <BookOpen size={16} />
              Samples
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload size={16} />
              Upload PDF
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText size={16} />
              Paste Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="samples" className="space-y-4">
            <SampleDocuments onDocumentSelect={onDocumentChange} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={openFileDialog}
            >
              <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF files up to 10MB
                </p>
              </div>
            </div>

            {/* File Processing Status */}
            {uploadState.file && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <File className="text-muted-foreground" size={20} />
                    <div>
                      <div className="font-medium">{uploadState.file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(uploadState.file.size)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {uploadState.isProcessing && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    )}
                    
                    {uploadState.extractedText && !uploadState.error && (
                      <CheckCircle className="text-green-600" size={20} />
                    )}
                    
                    {uploadState.error && (
                      <AlertCircle className="text-destructive" size={20} />
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFile}
                      disabled={uploadState.isProcessing}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                {uploadState.isProcessing && (
                  <div className="text-center text-sm text-muted-foreground">
                    Processing PDF and extracting text content...
                  </div>
                )}

                {uploadState.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {uploadState.error}
                  </div>
                )}

                {uploadState.extractedText && !uploadState.error && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Successfully extracted {uploadState.extractedText.length} characters
                    </div>
                    <div className="p-3 rounded-lg bg-muted max-h-32 overflow-y-auto">
                      <div className="text-xs font-mono">
                        {createDocumentPreview(uploadState.extractedText)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Paste your document content here, such as SOPs, work instructions, quality manuals, or regulatory procedures..."
              value={documentText}
              onChange={(e) => onDocumentChange(e.target.value)}
              className="min-h-48 font-mono text-sm"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{documentText.length} characters</span>
              {currentFilename && (
                <span className="flex items-center gap-1">
                  <File size={14} />
                  {currentFilename}
                </span>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}