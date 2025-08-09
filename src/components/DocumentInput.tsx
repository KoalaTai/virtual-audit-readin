import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, File, X, CheckCircle, AlertCircle, BookOpen, Info, Clock } from '@phosphor-icons/react';
import { 
  extractTextFromPDF, 
  isPDFFile, 
  formatFileSize, 
  createDocumentPreview, 
  validatePDF,
  assessDocumentQuality,
  detectDocumentType,
  type PDFExtractionResult,
  type PDFValidationResult,
  type DocumentQualityAssessment,
  type DocumentTypeDetection
} from '@/lib/pdf-parser';
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
  extractionResult: PDFExtractionResult | null;
  validation: PDFValidationResult | null;
  qualityAssessment: DocumentQualityAssessment | null;
  documentType: DocumentTypeDetection | null;
}

export default function DocumentInput({ onDocumentChange, documentText, currentFilename }: DocumentInputProps) {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    isProcessing: false,
    extractedText: '',
    error: null,
    extractionResult: null,
    validation: null,
    qualityAssessment: null,
    documentType: null
  });
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'text'>('samples');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // First, validate the file
    const validation = validatePDF(file);
    
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    // Show warnings if any
    validation.warnings.forEach(warning => {
      toast.warning(warning);
    });

    setUploadState({
      file,
      isProcessing: true,
      extractedText: '',
      error: null,
      extractionResult: null,
      validation,
      qualityAssessment: null,
      documentType: null
    });

    try {
      toast.loading('Extracting and analyzing PDF content...', { id: 'pdf-processing' });
      
      // Extract text with detailed analysis
      const extractionResult = await extractTextFromPDF(file, true);
      const extractedText = extractionResult.text;
      
      // Perform quality assessment
      const qualityAssessment = assessDocumentQuality(extractedText);
      
      // Detect document type
      const documentType = detectDocumentType(extractedText, file.name);
      
      setUploadState({
        file,
        isProcessing: false,
        extractedText,
        error: null,
        extractionResult,
        validation,
        qualityAssessment,
        documentType
      });

      // Update parent component with extracted text
      onDocumentChange(extractedText, file.name);
      
      // Show success message with analysis summary
      const analysisMessage = `${documentType.type} detected (${documentType.confidence}% confidence)`;
      toast.success(`Successfully processed ${file.name}. ${analysisMessage}`, { 
        id: 'pdf-processing' 
      });

      // Show quality warnings if needed
      if (qualityAssessment.score < 70) {
        toast.warning(`Document quality score: ${qualityAssessment.score}/100. Check the analysis for recommendations.`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF file';
      
      setUploadState({
        file,
        isProcessing: false,
        extractedText: '',
        error: errorMessage,
        extractionResult: null,
        validation,
        qualityAssessment: null,
        documentType: null
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
      error: null,
      extractionResult: null,
      validation: null,
      qualityAssessment: null,
      documentType: null
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
                  Supports PDF files up to 50MB with comprehensive analysis
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Quality Assessment</Badge>
                  <Badge variant="outline" className="text-xs">Document Type Detection</Badge>
                  <Badge variant="outline" className="text-xs">Structure Analysis</Badge>
                </div>
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
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>{formatFileSize(uploadState.file.size)}</span>
                        {uploadState.validation && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {uploadState.validation.fileInfo.lastModified.toLocaleDateString()}
                          </span>
                        )}
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
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Processing PDF and analyzing content...
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • Extracting text • Assessing quality • Detecting document type • Analyzing structure
                    </div>
                  </div>
                )}

                {uploadState.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <AlertCircle size={16} />
                      Processing Error
                    </div>
                    {uploadState.error}
                  </div>
                )}

                {/* Document Analysis Results */}
                {uploadState.extractedText && !uploadState.error && (
                  <div className="space-y-4">
                    {/* Document Type Detection */}
                    {uploadState.documentType && (
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Document Analysis</h4>
                          <Badge variant={uploadState.documentType.confidence > 70 ? 'default' : 'secondary'}>
                            {uploadState.documentType.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="font-medium text-primary">{uploadState.documentType.type}</div>
                          <div className="text-muted-foreground">
                            Detected indicators: {uploadState.documentType.indicators.join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quality Assessment */}
                    {uploadState.qualityAssessment && (
                      <div className="p-4 rounded-lg border bg-card space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Quality Assessment</h4>
                          <div className="text-lg font-bold text-primary">
                            {uploadState.qualityAssessment.score}/100
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{Math.round(uploadState.qualityAssessment.readabilityScore)}</div>
                              <div className="text-muted-foreground text-xs">Readability</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{uploadState.qualityAssessment.structureScore}</div>
                              <div className="text-muted-foreground text-xs">Structure</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{uploadState.qualityAssessment.completenessScore}</div>
                              <div className="text-muted-foreground text-xs">Completeness</div>
                            </div>
                          </div>
                          <Progress value={uploadState.qualityAssessment.score} className="h-2" />
                        </div>

                        {uploadState.qualityAssessment.issues.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-orange-600">Issues Identified:</h5>
                            <ul className="text-sm space-y-1">
                              {uploadState.qualityAssessment.issues.map((issue, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {uploadState.qualityAssessment.recommendations.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-blue-600">Recommendations:</h5>
                            <ul className="text-sm space-y-1">
                              {uploadState.qualityAssessment.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Extraction Summary */}
                    <div className="p-4 rounded-lg border bg-card">
                      <h4 className="font-medium mb-2">Extraction Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Characters: </span>
                          <span className="font-medium">{uploadState.extractedText.length.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Words: </span>
                          <span className="font-medium">
                            {uploadState.qualityAssessment?.wordCount.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        {uploadState.extractionResult && (
                          <>
                            <div>
                              <span className="text-muted-foreground">Pages: </span>
                              <span className="font-medium">{uploadState.extractionResult.metadata.pageCount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Created: </span>
                              <span className="font-medium">
                                {uploadState.extractionResult.metadata.creationDate?.toLocaleDateString() || 'Unknown'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {uploadState.extractionResult?.warnings && uploadState.extractionResult.warnings.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-sm font-medium text-amber-600 mb-2">Processing Notes:</h5>
                          <ul className="text-sm space-y-1">
                            {uploadState.extractionResult.warnings.map((warning, index) => (
                              <li key={index} className="flex items-start gap-2 text-amber-700">
                                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-3 p-3 rounded-lg bg-muted max-h-32 overflow-y-auto">
                        <div className="text-xs font-mono">
                          {createDocumentPreview(uploadState.extractedText)}
                        </div>
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