import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Target,
  Info,
  BookOpen,
  TrendUp
} from '@phosphor-icons/react';

export default function PDFUploadGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="text-primary" />
            PDF Upload Testing Guide
          </CardTitle>
          <CardDescription>
            Learn how to effectively test PDF parsing accuracy and document quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Upload size={18} />
              Getting Started with PDF Upload
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium mb-2">Step 1: Choose Your Document</p>
                <p>Select a compliance-related PDF such as SOPs, work instructions, quality manuals, or regulatory procedures. The tool works best with text-based PDFs (not scanned images).</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium mb-2">Step 2: Upload and Analyze</p>
                <p>Drag and drop your PDF or click to browse. The system will extract text, assess document quality, detect document type, and analyze regulatory compliance across multiple standards.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium mb-2">Step 3: Review Results</p>
                <p>Examine the quality assessment, document type detection accuracy, and regulatory coverage analysis to understand parsing effectiveness.</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target size={18} />
              Understanding the Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-primary">Document Quality Assessment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <TrendUp size={14} className="text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Quality Score (0-100)</p>
                      <p className="text-muted-foreground">Overall document quality based on structure, readability, and completeness</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Structure Analysis</p>
                      <p className="text-muted-foreground">Evaluation of headers, sections, and document organization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText size={14} className="text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium">Readability Score</p>
                      <p className="text-muted-foreground">Text complexity and sentence structure assessment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-primary">Regulatory Coverage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Target size={14} className="text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium">Multi-Standard Analysis</p>
                      <p className="text-muted-foreground">Coverage percentage across FDA, ISO, EU MDR, and other standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-yellow-600 mt-1" />
                    <div>
                      <p className="font-medium">Gap Identification</p>
                      <p className="text-muted-foreground">Missing regulatory requirements and compliance gaps</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-cyan-600 mt-1" />
                    <div>
                      <p className="font-medium">Document Type Detection</p>
                      <p className="text-muted-foreground">Automatic classification (SOP, Manual, Procedure, etc.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Quality Score Interpretation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="bg-green-600">80-100</Badge>
                  <span className="font-medium">Excellent</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Well-structured document with clear sections, good readability, and comprehensive content suitable for compliance analysis.
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-yellow-600">60-79</Badge>
                  <span className="font-medium">Good</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Decent document structure with minor issues. May benefit from improved organization or clearer language.
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">Below 60</Badge>
                  <span className="font-medium">Needs Work</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Document may have structural issues, poor formatting, or incomplete content affecting analysis accuracy.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Best Practices for Testing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">Recommended Document Types</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Standard Operating Procedures (SOPs)</li>
                  <li>• Quality Manuals</li>
                  <li>• Work Instructions</li>
                  <li>• Validation Protocols</li>
                  <li>• Risk Management Plans</li>
                  <li>• CAPA Procedures</li>
                  <li>• Design Control Documents</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-orange-600">Tips for Better Results</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use text-based PDFs (not scanned images)</li>
                  <li>• Ensure documents have clear structure</li>
                  <li>• Include regulatory references</li>
                  <li>• Test with different document sizes</li>
                  <li>• Compare results across document types</li>
                  <li>• Use documents with known compliance status</li>
                  <li>• Upload both good and poor quality examples</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="text-blue-600 mt-1" size={16} />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Testing Note</p>
                <p className="text-blue-700 dark:text-blue-300">
                  This tool is designed for testing PDF parsing accuracy and document analysis capabilities. 
                  Results should be validated against actual regulatory requirements and are not intended 
                  to replace professional compliance assessment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}