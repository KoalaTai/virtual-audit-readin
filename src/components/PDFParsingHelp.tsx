import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Info, 
  FileText, 
  Upload, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  BookOpen,
  TestTube
} from '@phosphor-icons/react';

export default function PDFParsingHelp() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="text-primary" />
            PDF Parsing Guide
          </CardTitle>
          <CardDescription>
            Learn how to effectively use the PDF parsing and accuracy testing features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upload">Upload Tips</TabsTrigger>
              <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    The Virtual Audit tool uses advanced PDF parsing to extract text from compliance documents 
                    for regulatory analysis. Understanding the parsing process helps ensure accurate results.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen size={16} className="text-green-600" />
                        Sample Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Pre-loaded compliance documents including SOPs, risk management plans, 
                        and quality manuals for immediate testing.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Upload size={16} className="text-blue-600" />
                        PDF Upload
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Upload your own PDF documents up to 10MB. Supports text-based PDFs 
                        and scanned documents with OCR capabilities.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target size={16} className="text-purple-600" />
                        Accuracy Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Real-time analysis of parsing quality with metrics for 
                        keyword detection, formatting preservation, and content integrity.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">How It Works</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                      <div>
                        <p className="font-medium">Document Processing</p>
                        <p className="text-sm text-muted-foreground">PDF files are processed to extract raw text content while preserving structure</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                      <div>
                        <p className="font-medium">Text Analysis</p>
                        <p className="text-sm text-muted-foreground">Extracted text is analyzed for regulatory keywords and compliance terminology</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                      <div>
                        <p className="font-medium">Quality Assessment</p>
                        <p className="text-sm text-muted-foreground">Parsing accuracy is evaluated and potential issues are identified</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                      <div>
                        <p className="font-medium">Compliance Analysis</p>
                        <p className="text-sm text-muted-foreground">Text is matched against regulatory standards to identify coverage gaps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Best Practices for PDF Upload</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        Recommended PDF Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span className="text-sm">Text-based PDFs (created from Word, etc.)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span className="text-sm">High-resolution scanned documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span className="text-sm">Standard fonts (Arial, Times, Calibri)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span className="text-sm">Well-structured documents</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2 text-red-600">
                        <AlertTriangle size={16} />
                        PDF Types to Avoid
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">×</Badge>
                        <span className="text-sm">Image-only PDFs without OCR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">×</Badge>
                        <span className="text-sm">Password-protected documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">×</Badge>
                        <span className="text-sm">Heavily formatted or decorative text</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">×</Badge>
                        <span className="text-sm">Documents with complex layouts</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">File Size and Format Guidelines</h5>
                  <div className="p-4 rounded-lg bg-muted space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Maximum file size:</span>
                      <Badge>10 MB</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Supported format:</span>
                      <Badge variant="outline">PDF only</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Optimal page count:</span>
                      <Badge variant="outline">1-50 pages</Badge>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For best results, use text-based PDFs created directly from word processors. 
                    Scanned documents may have lower parsing accuracy depending on image quality.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="accuracy" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Understanding Parsing Accuracy</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-green-600">Excellent</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-green-600 mb-2">95%+</div>
                      <div className="space-y-2">
                        <div className="text-xs">• High keyword detection</div>
                        <div className="text-xs">• Structure preserved</div>
                        <div className="text-xs">• No formatting issues</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-blue-600">Good</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-blue-600 mb-2">80%+</div>
                      <div className="space-y-2">
                        <div className="text-xs">• Adequate keyword detection</div>
                        <div className="text-xs">• Minor formatting issues</div>
                        <div className="text-xs">• Usable for analysis</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-yellow-600">Fair</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">60%+</div>
                      <div className="space-y-2">
                        <div className="text-xs">• Partial keyword detection</div>
                        <div className="text-xs">• Some formatting issues</div>
                        <div className="text-xs">• Review recommended</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-red-600">Poor</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-red-600 mb-2">&lt;60%</div>
                      <div className="space-y-2">
                        <div className="text-xs">• Low keyword detection</div>
                        <div className="text-xs">• Major formatting issues</div>
                        <div className="text-xs">• Requires attention</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Quality Metrics Explained</h5>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border">
                      <div className="font-medium text-sm">Character/Word Count</div>
                      <div className="text-xs text-muted-foreground">Total extracted content volume</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="font-medium text-sm">Keyword Density</div>
                      <div className="text-xs text-muted-foreground">Percentage of regulatory terminology detected</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="font-medium text-sm">Structure Preservation</div>
                      <div className="text-xs text-muted-foreground">Whether paragraphs and formatting are maintained</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="font-medium text-sm">Formatting Issues</div>
                      <div className="text-xs text-muted-foreground">Problems like spacing, characters, or layout</div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Documents with "Excellent" or "Good" ratings are optimal for compliance analysis. 
                    "Fair" documents may still be usable but should be reviewed for accuracy.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Automated Testing Suite</h4>
                
                <Alert>
                  <TestTube className="h-4 w-4" />
                  <AlertDescription>
                    The test suite validates PDF parsing accuracy using predefined compliance documents 
                    with known content and expected keywords.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h5 className="font-medium">Test Categories</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Design Control</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-xs">
                          <div>• FDA 21 CFR 820.30 compliance</div>
                          <div>• Design inputs/outputs</div>
                          <div>• Verification/validation</div>
                          <div>• Document control terms</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Risk Management</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-xs">
                          <div>• ISO 14971 terminology</div>
                          <div>• Hazard identification</div>
                          <div>• Risk assessment terms</div>
                          <div>• Control measures</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Quality System</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-xs">
                          <div>• ISO 13485 requirements</div>
                          <div>• Management responsibility</div>
                          <div>• Process controls</div>
                          <div>• CAPA terminology</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Test Results Interpretation</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <CheckCircle className="text-green-600" size={20} />
                      <div>
                        <div className="font-medium text-sm">Passed Tests</div>
                        <div className="text-xs text-muted-foreground">≥80% keyword detection with minimal issues</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <AlertTriangle className="text-red-600" size={20} />
                      <div>
                        <div className="font-medium text-sm">Failed Tests</div>
                        <div className="text-xs text-muted-foreground">&lt;80% keyword detection or significant parsing issues</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Running Tests</h5>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Click "Run Test Suite" to start automated testing</li>
                    <li>2. Monitor progress as each test document is processed</li>
                    <li>3. Review detailed results for each test case</li>
                    <li>4. Download the comprehensive test report</li>
                    <li>5. Use results to validate parsing accuracy</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}