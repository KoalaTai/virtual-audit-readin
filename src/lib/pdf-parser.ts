import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFExtractionResult {
  text: string;
  metadata: PDFMetadata;
  pages: PDFPageInfo[];
  warnings: string[];
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modDate?: Date;
  keywords?: string;
  pageCount: number;
  encrypted: boolean;
  fileSize: number;
}

export interface PDFPageInfo {
  pageNumber: number;
  text: string;
  wordCount: number;
  hasImages: boolean;
  hasTables: boolean;
}

/**
 * Enhanced PDF text extraction with detailed analysis
 * @param file The PDF file to parse
 * @returns Promise<PDFExtractionResult> Comprehensive extraction results
 */
export async function extractTextFromPDF(file: File): Promise<string>;
export async function extractTextFromPDF(file: File, detailed: true): Promise<PDFExtractionResult>;
export async function extractTextFromPDF(file: File, detailed?: boolean): Promise<string | PDFExtractionResult> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const metadata = await pdf.getMetadata();
    
    let fullText = '';
    const pages: PDFPageInfo[] = [];
    const warnings: string[] = [];
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const annotations = await page.getAnnotations();
      
      // Combine text items with better spacing preservation
      const pageTextItems = textContent.items as any[];
      let pageText = '';
      let prevItem: any = null;
      
      for (const item of pageTextItems) {
        // Add spacing based on positioning
        if (prevItem && item.transform) {
          const yDiff = Math.abs(item.transform[5] - prevItem.transform[5]);
          const xDiff = item.transform[4] - prevItem.transform[4];
          
          // New line for significant vertical difference
          if (yDiff > item.height * 0.5) {
            pageText += '\n';
          }
          // Space for horizontal gap
          else if (xDiff > item.width * 0.3) {
            pageText += ' ';
          }
        }
        
        pageText += item.str;
        prevItem = item;
      }
      
      // Clean up the text
      pageText = pageText
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/(.)\1{4,}/g, '$1') // Remove excessive repetition
        .trim();
      
      if (pageText.length === 0) {
        warnings.push(`Page ${pageNum}: No extractable text found - may contain only images`);
      }
      
      const pageInfo: PDFPageInfo = {
        pageNumber: pageNum,
        text: pageText,
        wordCount: pageText.split(/\s+/).filter(word => word.length > 0).length,
        hasImages: false, // Would need more complex analysis
        hasTables: detectTables(pageText)
      };
      
      pages.push(pageInfo);
      fullText += pageText + '\n';
    }
    
    const cleanedText = fullText.trim();
    
    if (detailed) {
      const pdfMetadata: PDFMetadata = {
        title: metadata.info?.Title,
        author: metadata.info?.Author,
        subject: metadata.info?.Subject,
        creator: metadata.info?.Creator,
        producer: metadata.info?.Producer,
        creationDate: metadata.info?.CreationDate ? new Date(metadata.info.CreationDate) : undefined,
        modDate: metadata.info?.ModDate ? new Date(metadata.info.ModDate) : undefined,
        keywords: metadata.info?.Keywords,
        pageCount: pdf.numPages,
        encrypted: metadata.info?.IsEncrypted || false,
        fileSize: file.size
      };
      
      return {
        text: cleanedText,
        metadata: pdfMetadata,
        pages,
        warnings
      };
    }
    
    return cleanedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file format. Please ensure the file is a valid PDF document.');
      } else if (error.message.includes('password')) {
        throw new Error('PDF is password protected. Please provide an unencrypted version.');
      } else if (error.message.includes('corrupted')) {
        throw new Error('PDF file appears to be corrupted. Please try a different file.');
      }
    }
    
    throw new Error('Failed to extract text from PDF. The file may be corrupted, encrypted, or contain only images.');
  }
}

/**
 * Detects potential table structures in text
 * @param text The text to analyze
 * @returns boolean True if tables are likely present
 */
function detectTables(text: string): boolean {
  // Simple heuristic: look for patterns that suggest tabular data
  const lines = text.split('\n');
  let tableIndicators = 0;
  
  for (const line of lines) {
    // Look for multiple numbers/data separated by spaces
    if (/\d+\s+\d+/.test(line)) tableIndicators++;
    // Look for common table headers
    if (/\b(item|name|date|value|type|status|id|no\.?)\s+/i.test(line)) tableIndicators++;
    // Look for aligned text patterns
    if (/^\s*\S+\s+\S+\s+\S+/.test(line)) tableIndicators++;
  }
  
  return tableIndicators > 2;
}

/**
 * Creates a preview of the document text (first 200 characters)
 * @param text The full document text
 * @returns string A preview of the document
 */
export function createDocumentPreview(text: string): string {
  if (text.length <= 200) return text;
  return text.substring(0, 200) + '...';
}

/**
 * Validates PDF file with comprehensive checks
 * @param file The file to validate
 * @returns Validation result with details
 */
export interface PDFValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo: {
    size: string;
    type: string;
    lastModified: Date;
  };
}

export function validatePDF(file: File): PDFValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // File type validation
  if (!isPDFFile(file)) {
    errors.push('File is not a PDF document');
  }
  
  // File size validation
  const maxSize = 50 * 1024 * 1024; // 50MB
  const warningSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size of 50MB`);
  } else if (file.size > warningSize) {
    warnings.push(`Large file size (${formatFileSize(file.size)}) may take longer to process`);
  }
  
  // Empty file check
  if (file.size < 1024) {
    warnings.push('File appears to be very small - may not contain meaningful content');
  }
  
  // File name validation
  if (file.name.length > 255) {
    warnings.push('File name is very long and may be truncated');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fileInfo: {
      size: formatFileSize(file.size),
      type: file.type || 'application/pdf',
      lastModified: new Date(file.lastModified)
    }
  };
}

/**
 * Validates if a file is a PDF
 * @param file The file to validate
 * @returns boolean True if the file is a PDF
 */
export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Formats file size for display
 * @param bytes The file size in bytes
 * @returns string The formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Advanced document quality assessment
 * @param text The document text to assess
 * @returns Assessment results
 */
export interface DocumentQualityAssessment {
  score: number;
  issues: string[];
  recommendations: string[];
  wordCount: number;
  readabilityScore: number;
  structureScore: number;
  completenessScore: number;
}

export function assessDocumentQuality(text: string): DocumentQualityAssessment {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // Basic metrics
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  
  // Structure assessment
  const hasHeaders = /^\s*\d+\.|\b(section|chapter|part)\s+\d+/im.test(text);
  const hasProcedures = /\b(procedure|process|step|method|shall|must|should)\b/i.test(text);
  const hasRequirements = /\b(requirement|mandatory|compliance|standard|regulation)\b/i.test(text);
  
  // Quality checks
  if (wordCount < 100) {
    issues.push('Document appears too short for comprehensive analysis');
    score -= 20;
  }
  
  if (avgWordsPerSentence > 30) {
    issues.push('Average sentence length is quite long, which may affect readability');
    recommendations.push('Consider breaking long sentences into shorter, clearer statements');
    score -= 10;
  }
  
  if (!hasHeaders) {
    issues.push('Document lacks clear section headers or numbering');
    recommendations.push('Add numbered sections or clear headers to improve structure');
    score -= 15;
  }
  
  if (!hasProcedures && !hasRequirements) {
    issues.push('Document may lack procedural content or clear requirements');
    recommendations.push('Ensure document includes specific procedures, requirements, or actionable content');
    score -= 10;
  }
  
  // Calculate sub-scores
  const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence - 15) * 2);
  const structureScore = hasHeaders ? 80 : 40;
  const completenessScore = (hasProcedures ? 50 : 0) + (hasRequirements ? 50 : 0);
  
  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    wordCount,
    readabilityScore,
    structureScore,
    completenessScore
  };
}

/**
 * Detects document type based on content analysis
 * @param text Document text
 * @param filename Optional filename for additional context
 * @returns Detected document type and confidence
 */
export interface DocumentTypeDetection {
  type: string;
  confidence: number;
  indicators: string[];
}

export function detectDocumentType(text: string, filename?: string): DocumentTypeDetection {
  const lowerText = text.toLowerCase();
  const detections: Array<{type: string, score: number, indicators: string[]}> = [];
  
  // SOP Detection
  const sopIndicators = ['standard operating procedure', 'sop', 'procedure', 'work instruction'];
  const sopScore = sopIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 20 : 0), 0);
  if (sopScore > 0) {
    detections.push({
      type: 'Standard Operating Procedure (SOP)',
      score: sopScore,
      indicators: sopIndicators.filter(ind => lowerText.includes(ind))
    });
  }
  
  // Quality Manual Detection
  const qmIndicators = ['quality manual', 'quality management', 'quality system', 'qms'];
  const qmScore = qmIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 25 : 0), 0);
  if (qmScore > 0) {
    detections.push({
      type: 'Quality Manual',
      score: qmScore,
      indicators: qmIndicators.filter(ind => lowerText.includes(ind))
    });
  }
  
  // Risk Management Detection
  const rmIndicators = ['risk management', 'risk analysis', 'hazard', 'iso 14971'];
  const rmScore = rmIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 25 : 0), 0);
  if (rmScore > 0) {
    detections.push({
      type: 'Risk Management Document',
      score: rmScore,
      indicators: rmIndicators.filter(ind => lowerText.includes(ind))
    });
  }
  
  // Design Controls Detection
  const dcIndicators = ['design control', 'design input', 'design output', 'design verification', 'design validation'];
  const dcScore = dcIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 20 : 0), 0);
  if (dcScore > 0) {
    detections.push({
      type: 'Design Controls Document',
      score: dcScore,
      indicators: dcIndicators.filter(ind => lowerText.includes(ind))
    });
  }
  
  // CAPA Detection
  const capaIndicators = ['corrective action', 'preventive action', 'capa', 'nonconformity'];
  const capaScore = capaIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 25 : 0), 0);
  if (capaScore > 0) {
    detections.push({
      type: 'CAPA Procedure',
      score: capaScore,
      indicators: capaIndicators.filter(ind => lowerText.includes(ind))
    });
  }
  
  // Clinical Evaluation Detection
  const ceIndicators = ['clinical evaluation', 'clinical data', 'post-market', 'clinical study'];
  const ceScore = ceIndicators.reduce((score, indicator) => 
    score + (lowerText.includes(indicator) ? 25 : 0), 0);
  if (ceScore > 0) {
    detections.push({
      type: 'Clinical Evaluation Document',
      score: ceScore,
      indicators: ceIndicators.filter(ind => lowerText.includes(ind))
    });
  }
  
  // Use filename hints
  if (filename) {
    const lowerFilename = filename.toLowerCase();
    detections.forEach(detection => {
      if (lowerFilename.includes(detection.type.toLowerCase().replace(/\s+/g, '-'))) {
        detection.score += 10;
      }
    });
  }
  
  // Return highest scoring detection or generic
  const bestDetection = detections.reduce((best, current) => 
    current.score > best.score ? current : best, 
    { type: 'General Compliance Document', score: 10, indicators: ['regulatory content'] }
  );
  
  return {
    type: bestDetection.type,
    confidence: Math.min(100, bestDetection.score),
    indicators: bestDetection.indicators
  };
}