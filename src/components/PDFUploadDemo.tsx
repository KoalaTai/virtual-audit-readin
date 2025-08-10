import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Target,
  Activity,
  BarChart,
  BookOpen
} from '@phosphor-icons/react';
import { 
  extractTextFromPDF, 
  validatePDF,
  assessDocumentQuality,
  detectDocumentType,
  formatFileSize,
  createDocumentPreview,
  type PDFExtractionResult,
  type PDFValidationResult,
  type DocumentQualityAssessment,
  type DocumentTypeDetection
} from '@/lib/pdf-parser';
import { performVirtualAudit, type RegulatoryStandard } from '@/lib/virtual-audit';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';
import PDFUploadGuide from './PDFUploadGuide';
import UploadMetrics from './UploadMetrics';

interface UploadedDocument {
  id: string;
  file: File;
  extractedText: string;
  extractionResult: PDFExtractionResult;
  qualityAssessment: DocumentQualityAssessment;
  documentType: DocumentTypeDetection;
  uploadTime: Date;
  auditResults?: { [standard: string]: number }; // Coverage percentages by standard
}

interface UploadState {
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
}

export default function PDFUploadDemo() {
  const [uploadedDocs, setUploadedDocs] = useKV<UploadedDocument[]>('uploaded-documents', []);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isProcessing: false,
    error: null
  });
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file
    const validation = validatePDF(file);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setUploadState({ isUploading: true, isProcessing: false, error: null });
    
    try {
      toast.loading('Processing PDF document...', { id: 'pdf-upload' });

      // Extract text with full analysis
      const extractionResult = await extractTextFromPDF(file, true);
      
      setUploadState({ isUploading: false, isProcessing: true, error: null });
      toast.loading('Analyzing document quality and type...', { id: 'pdf-upload' });

      // Perform comprehensive analysis
      const qualityAssessment = assessDocumentQuality(extractionResult.text);
      const documentType = detectDocumentType(extractionResult.text, file.name);

      // Test against multiple regulatory standards for demonstration
      const standards: RegulatoryStandard[] = [
        'ISO13485', 'FDA_21CFR820', 'EU_MDR', 'FDA_21CFR211', 'ICH_Q10'
      ];
      
      const auditResults: { [standard: string]: number } = {};
      for (const standard of standards) {
        const result = performVirtualAudit(extractionResult.text, standard, file.name);
        auditResults[standard] = result.coveragePercentage;
      }

      const uploadedDoc: UploadedDocument = {
        id: Date.now().toString(),
        file,
        extractedText: extractionResult.text,
        extractionResult,
        qualityAssessment,
        documentType,
        uploadTime: new Date(),
        auditResults
      };

      setUploadedDocs(prevDocs => [uploadedDoc, ...(prevDocs || []).slice(0, 9)]); // Keep last 10
      setSelectedDoc(uploadedDoc);

      toast.success(`Successfully analyzed ${file.name}`, { id: 'pdf-upload' });
      
      if (qualityAssessment.score < 70) {
        toast.warning(`Document quality could be improved (${qualityAssessment.score}/100)`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF';
      setUploadState({ isUploading: false, isProcessing: false, error: errorMessage });
      toast.error(errorMessage, { id: 'pdf-upload' });
    } finally {
      setUploadState({ isUploading: false, isProcessing: false, error: null });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeDocument = (docId: string) => {
    setUploadedDocs(prevDocs => (prevDocs || []).filter(doc => doc.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Needs Work' };
  };

  return (
    <Tabs defaultValue="upload" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload size={16} />
          Upload & Test
        </TabsTrigger>
        <TabsTrigger value="metrics" className="flex items-center gap-2">
          <BarChart size={16} />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="guide" className="flex items-center gap-2">
          <BookOpen size={16} />
          User Guide
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-6">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="text-primary" />
            Upload Your Compliance Documents
          </CardTitle>
          <CardDescription>
            Upload your own PDF documents to test parsing accuracy, document quality assessment, 
            and regulatory compliance analysis across multiple standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-3">
              Need test documents? Download these sample compliance PDFs to test the upload functionality:
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Create a sample PDF-like text document for demonstration
                  const sampleContent = `DESIGN CONTROL PROCEDURE
                  
Document ID: SOP-DEV-001
Version: 2.1
Effective Date: 2024-01-15

1. PURPOSE AND SCOPE
This procedure establishes design controls for medical device development in accordance with FDA 21 CFR 820.30 and ISO 13485:2016 clause 7.3.

2. DESIGN AND DEVELOPMENT PLANNING
2.1 Design and development activities shall be planned and controlled
2.2 Planning shall include:
   a) Design and development stages
   b) Review, verification and validation activities
   c) Responsibilities and authorities
   d) Resource requirements including personnel competencies

3. DESIGN INPUTS
3.1 Design inputs shall be documented and shall include:
   a) Functional and performance requirements
   b) Applicable statutory and regulatory requirements
   c) Risk management requirements
   d) Usability engineering requirements
   e) User needs and intended use

4. DESIGN OUTPUTS
4.1 Design outputs shall be documented and shall include:
   a) Meet the design input requirements
   b) Provide appropriate information for purchasing, production and service provision
   c) Contain or reference device acceptance criteria
   d) Specify characteristics essential for safe and proper use

5. DESIGN REVIEW
5.1 Design reviews shall be conducted at appropriate intervals
5.2 Participants shall include representatives of functions concerned with design stage
5.3 Results and necessary actions shall be documented

6. DESIGN VERIFICATION
6.1 Verification confirms design outputs meet design inputs
6.2 Methods may include:
   a) Design calculations and analyses
   b) Comparison with similar proven designs
   c) Tests and demonstrations
   d) Alternative calculations

7. DESIGN VALIDATION
7.1 Validation confirms product meets user needs and intended uses
7.2 Performed under defined operating conditions
7.3 Where practical, completed prior to delivery or implementation

8. DESIGN TRANSFER
8.1 Transfer from design to production shall ensure design outputs remain valid
8.2 All production specifications and procedures shall be verified

9. DESIGN CHANGES
9.1 Design changes shall be identified, documented, verified or validated
9.2 Impact on constituent parts and products already delivered evaluated
9.3 Changes approved before implementation

10. RECORDS
10.1 Records of design and development activities maintained
10.2 Include evidence of verification and validation
10.3 Evidence of design review participation and results

This document demonstrates typical design control content that would be analyzed against FDA 21 CFR 820.30 and ISO 13485:2016 requirements.`;
                  
                  const blob = new Blob([sampleContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sample-design-control-sop.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast.success('Sample Design Control SOP downloaded');
                }}
              >
                <File size={14} />
                Design Control SOP
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const sampleContent = `CORRECTIVE AND PREVENTIVE ACTION (CAPA) PROCEDURE

Document ID: QMS-CAPA-001
Version: 3.0
Effective Date: 2024-01-15

1. PURPOSE
This procedure establishes requirements for implementing corrective and preventive actions in accordance with FDA 21 CFR 820.100 and ISO 13485:2016 clause 8.5.

2. SCOPE
This procedure applies to all nonconforming products, customer complaints, internal audit findings, management review outputs, and data analysis results.

3. RESPONSIBILITIES
3.1 Quality Manager: Overall CAPA program oversight
3.2 Department Managers: Implementation of assigned actions
3.3 CAPA Team: Investigation and root cause analysis

4. PROCEDURE
4.1 IDENTIFICATION OF NEED FOR ACTION
Sources include:
   a) Customer complaints
   b) Nonconforming product
   c) Internal audit findings
   d) Management review
   e) Data analysis
   f) Service reports
   g) Risk analysis updates

4.2 INVESTIGATION AND ROOT CAUSE ANALYSIS
4.2.1 All issues requiring CAPA shall be investigated
4.2.2 Investigation methods may include:
   a) 5 Why analysis
   b) Fishbone diagrams
   c) Fault tree analysis
   d) Statistical analysis
   e) Process mapping

4.3 ACTION PLANNING
4.3.1 Immediate actions to address immediate nonconformity
4.3.2 Corrective actions to eliminate cause of existing nonconformities
4.3.3 Preventive actions to prevent potential nonconformities

4.4 IMPLEMENTATION
4.4.1 Actions assigned with defined responsibilities
4.4.2 Timelines established based on risk assessment
4.4.3 Resources allocated as necessary

4.5 VERIFICATION AND VALIDATION
4.5.1 Effectiveness of actions verified through:
   a) Follow-up audits
   b) Data analysis
   c) Process monitoring
   d) Product testing

4.6 DOCUMENTATION
4.6.1 All CAPA activities documented
4.6.2 Records maintained per document control procedure
4.6.3 Status tracked until closure

5. RECORDS
Maintain records of:
- CAPA requests and sources
- Investigation results
- Root cause analysis
- Action plans and implementation
- Verification of effectiveness

This procedure ensures systematic approach to continuous improvement and regulatory compliance.`;
                  
                  const blob = new Blob([sampleContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sample-capa-procedure.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast.success('Sample CAPA Procedure downloaded');
                }}
              >
                <File size={14} />
                CAPA Procedure
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const sampleContent = `PHARMACEUTICAL QUALITY SYSTEM PROCEDURE

Document ID: PQS-001
Version: 1.5
Effective Date: 2024-01-15

1. PURPOSE
This procedure establishes the Pharmaceutical Quality System (PQS) in accordance with FDA 21 CFR 211 and ICH Q10 guidelines.

2. SCOPE
This procedure applies to all pharmaceutical manufacturing operations, including active pharmaceutical ingredients (APIs) and finished drug products.

3. QUALITY POLICY
Our organization is committed to:
- Ensuring product quality and patient safety
- Compliance with applicable regulations
- Continuous improvement
- Science and risk-based approaches

4. PHARMACEUTICAL QUALITY SYSTEM ELEMENTS
4.1 PROCESS PERFORMANCE AND PRODUCT QUALITY MONITORING
4.1.1 Key performance indicators established
4.1.2 Statistical process control implemented
4.1.3 Product quality reviews conducted
4.1.4 Trending and analysis performed

4.2 CORRECTIVE AND PREVENTIVE ACTION SYSTEM
4.2.1 CAPA system per 21 CFR 211.180
4.2.2 Root cause analysis methodology
4.2.3 Risk-based approach to investigations
4.2.4 Effectiveness verification

4.3 CHANGE MANAGEMENT SYSTEM
4.3.1 Change control procedures established
4.3.2 Risk assessment for changes
4.3.3 Regulatory notification requirements
4.3.4 Implementation and verification

4.4 MANAGEMENT REVIEW OF PROCESS PERFORMANCE
4.4.1 Periodic management review process
4.4.2 Review of quality metrics
4.4.3 Resource allocation decisions
4.4.4 Strategic quality planning

5. KNOWLEDGE MANAGEMENT
5.1 Product and process knowledge captured
5.2 Knowledge transfer procedures
5.3 Continuous learning integration
5.4 Technology transfer protocols

6. QUALITY RISK MANAGEMENT
6.1 Risk assessment methodologies
6.2 Risk control measures
6.3 Risk communication
6.4 Risk review and monitoring

7. VALIDATION AND QUALIFICATION
7.1 Computer systems validation
7.2 Equipment qualification
7.3 Process validation lifecycle
7.4 Analytical method validation

8. SUPPLIER MANAGEMENT
8.1 Supplier qualification
8.2 Supply chain integrity
8.3 Vendor audits
8.4 Material specifications

This document demonstrates pharmaceutical quality system requirements per FDA and ICH guidelines.`;
                  
                  const blob = new Blob([sampleContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sample-pharmaceutical-qms.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast.success('Sample Pharmaceutical QMS downloaded');
                }}
              >
                <File size={14} />
                Pharmaceutical QMS
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={openFileDialog}
          >
            <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drop your compliance PDF here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                We'll analyze document quality, detect type, and test regulatory coverage
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">Quality Scoring</Badge>
                <Badge variant="outline" className="text-xs">Type Detection</Badge>
                <Badge variant="outline" className="text-xs">Multi-Standard Analysis</Badge>
                <Badge variant="outline" className="text-xs">Text Extraction</Badge>
              </div>
            </div>
          </div>

          {(uploadState.isUploading || uploadState.isProcessing) && (
            <div className="mt-4 p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span>
                  {uploadState.isUploading ? 'Uploading and extracting text...' : 'Analyzing document...'}
                </span>
              </div>
            </div>
          )}

          {uploadState.error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <div className="flex items-center gap-2 font-medium mb-1">
                <AlertCircle size={16} />
                Upload Error
              </div>
              {uploadState.error}
            </div>
          )}
        </CardContent>
      </Card>

      {uploadedDocs && uploadedDocs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary" />
                Uploaded Documents ({uploadedDocs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedDoc?.id === doc.id ? 'bg-primary/10 border-primary' : 'bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(doc.file.size)} • {doc.uploadTime.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.documentType.type}
                        </Badge>
                        <Badge {...getQualityBadge(doc.qualityAssessment.score)} className="text-xs">
                          {doc.qualityAssessment.score}/100
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDocument(doc.id);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Document Analysis */}
          {selectedDoc && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-primary" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Detailed analysis for {selectedDoc.file.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Document Type:</span>
                        <div className="font-medium">{selectedDoc.documentType.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedDoc.documentType.confidence}% confidence
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quality Score:</span>
                        <div className={`font-medium ${getQualityColor(selectedDoc.qualityAssessment.score)}`}>
                          {selectedDoc.qualityAssessment.score}/100
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pages:</span>
                        <div className="font-medium">{selectedDoc.extractionResult.metadata.pageCount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Words:</span>
                        <div className="font-medium">
                          {selectedDoc.qualityAssessment.wordCount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Detected Indicators:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDoc.documentType.indicators.map((indicator, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Content Preview:</span>
                      <div className="p-3 rounded-lg bg-muted text-xs font-mono max-h-32 overflow-y-auto">
                        {createDocumentPreview(selectedDoc.extractedText)}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Quality</span>
                        <span className={`font-bold ${getQualityColor(selectedDoc.qualityAssessment.score)}`}>
                          {selectedDoc.qualityAssessment.score}/100
                        </span>
                      </div>
                      <Progress value={selectedDoc.qualityAssessment.score} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">
                          {Math.round(selectedDoc.qualityAssessment.readabilityScore)}
                        </div>
                        <div className="text-xs text-muted-foreground">Readability</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {selectedDoc.qualityAssessment.structureScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Structure</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {selectedDoc.qualityAssessment.completenessScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Completeness</div>
                      </div>
                    </div>

                    {selectedDoc.qualityAssessment.issues.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-orange-600">Issues:</h4>
                        <ul className="text-sm space-y-1">
                          {selectedDoc.qualityAssessment.issues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDoc.qualityAssessment.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-blue-600">Recommendations:</h4>
                        <ul className="text-sm space-y-1">
                          {selectedDoc.qualityAssessment.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Activity size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <BarChart size={16} />
                        Regulatory Coverage Analysis
                      </h4>
                      {selectedDoc.auditResults && Object.entries(selectedDoc.auditResults).map(([standard, coverage]) => (
                        <div key={standard} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{standard.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-medium">{coverage}%</span>
                          </div>
                          <Progress value={coverage} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-muted text-sm">
                      <div className="font-medium mb-2">Analysis Summary:</div>
                      <p className="text-muted-foreground">
                        Document shows {selectedDoc.auditResults ? 
                          `${Math.round(Object.values(selectedDoc.auditResults).reduce((a, b) => a + b, 0) / Object.values(selectedDoc.auditResults).length)}% average coverage` : 
                          'compliance analysis completed'
                        } across tested regulatory standards. 
                        {selectedDoc.qualityAssessment.score < 70 ? 
                          ' Consider improving document quality for better parsing accuracy.' : 
                          ' Good document quality ensures reliable compliance assessment.'
                        }
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(!uploadedDocs || uploadedDocs.length === 0) && !uploadState.isUploading && !uploadState.isProcessing && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Upload size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No Documents Uploaded Yet</p>
            <p className="text-sm">
              Upload your first PDF document to see detailed parsing accuracy analysis, 
              quality assessment, and regulatory compliance testing.
            </p>
          </CardContent>
        </Card>
      )}
      </TabsContent>

      <TabsContent value="metrics">
        <UploadMetrics uploadedDocs={uploadedDocs || []} />
      </TabsContent>

      <TabsContent value="guide">
        <PDFUploadGuide />
      </TabsContent>
    </Tabs>
  );
}