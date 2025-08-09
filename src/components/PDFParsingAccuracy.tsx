import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  BarChart,
  Eye,
  ClipboardText
} from '@phosphor-icons/react';

interface ParsingAccuracyMetrics {
  characterCount: number;
  wordCount: number;
  lineCount: number;
  paragraphCount: number;
  keywordDensity: number;
  readabilityScore: number;
  structurePreserved: boolean;
  formattingIssues: string[];
  extractionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ParsedDocumentAnalysis {
  originalFilename: string;
  extractedText: string;
  metrics: ParsingAccuracyMetrics;
  timestamp: Date;
}

interface PDFParsingAccuracyProps {
  parsedDocuments: ParsedDocumentAnalysis[];
}

export default function PDFParsingAccuracy({ parsedDocuments }: PDFParsingAccuracyProps) {
  const [selectedDocument, setSelectedDocument] = useState<ParsedDocumentAnalysis | null>(null);

  // Calculate parsing accuracy metrics
  const calculateMetrics = (text: string): ParsingAccuracyMetrics => {
    const characterCount = text.length;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const lineCount = lines.length;
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Calculate keyword density (regulatory terms)
    const regulatoryKeywords = [
      'quality', 'compliance', 'regulation', 'standard', 'procedure', 'control',
      'verification', 'validation', 'documentation', 'requirement', 'management',
      'system', 'process', 'audit', 'safety', 'risk', 'device', 'pharmaceutical'
    ];
    
    const keywordMatches = regulatoryKeywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      return count + (text.match(regex)?.length || 0);
    }, 0);
    
    const keywordDensity = Math.round((keywordMatches / wordCount) * 100);

    // Simple readability score based on average sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
    const readabilityScore = Math.max(0, Math.min(100, 100 - avgWordsPerSentence * 2));

    // Check for common formatting issues
    const formattingIssues: string[] = [];
    if (text.includes('  ')) formattingIssues.push('Multiple spaces detected');
    if (!/^[A-Z]/.test(text.trim())) formattingIssues.push('Improper capitalization');
    if (text.includes('\f')) formattingIssues.push('Form feed characters present');
    if (text.match(/\d+\s*\.\s*\d+/)) formattingIssues.push('Potential decimal formatting issues');
    
    // Assess structure preservation
    const structurePreserved = text.includes('\n') && paragraphCount > 1 && lineCount > paragraphCount;

    // Determine extraction quality
    let extractionQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (characterCount > 500 && keywordDensity > 2 && formattingIssues.length === 0) {
      extractionQuality = 'excellent';
    } else if (characterCount > 200 && keywordDensity > 1 && formattingIssues.length <= 2) {
      extractionQuality = 'good';
    } else if (characterCount > 50 && formattingIssues.length <= 4) {
      extractionQuality = 'fair';
    }

    return {
      characterCount,
      wordCount,
      lineCount,
      paragraphCount,
      keywordDensity,
      readabilityScore: Math.round(readabilityScore),
      structurePreserved,
      formattingIssues,
      extractionQuality
    };
  };

  // Get quality score and color
  const getQualityInfo = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return { score: 95, color: 'text-green-600', bg: 'bg-green-100' };
      case 'good':
        return { score: 80, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'fair':
        return { score: 60, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      default:
        return { score: 30, color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const overallMetrics = parsedDocuments.length > 0 ? {
    totalDocuments: parsedDocuments.length,
    averageWords: Math.round(parsedDocuments.reduce((sum, doc) => 
      sum + calculateMetrics(doc.extractedText).wordCount, 0) / parsedDocuments.length),
    excellentQuality: parsedDocuments.filter(doc => 
      calculateMetrics(doc.extractedText).extractionQuality === 'excellent').length,
    successRate: Math.round((parsedDocuments.filter(doc => 
      calculateMetrics(doc.extractedText).characterCount > 100).length / parsedDocuments.length) * 100)
  } : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            PDF Parsing Accuracy Analysis
          </CardTitle>
          <CardDescription>
            Detailed analysis of PDF text extraction quality and compliance document parsing accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {parsedDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No PDF documents analyzed yet</p>
              <p className="text-sm">Upload PDF documents to see parsing accuracy metrics and analysis</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Metrics */}
              {overallMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{overallMetrics.totalDocuments}</div>
                    <div className="text-sm text-muted-foreground">Documents Parsed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-green-600">{overallMetrics.successRate}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-blue-600">{overallMetrics.averageWords}</div>
                    <div className="text-sm text-muted-foreground">Avg Words</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-yellow-600">{overallMetrics.excellentQuality}</div>
                    <div className="text-sm text-muted-foreground">Excellent Quality</div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Document List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Parsed Documents</h3>
                {parsedDocuments.map((doc, index) => {
                  const metrics = calculateMetrics(doc.extractedText);
                  const qualityInfo = getQualityInfo(metrics.extractionQuality);
                  
                  return (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors" 
                          onClick={() => setSelectedDocument(doc)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              <FileText size={16} />
                              {doc.originalFilename}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {metrics.wordCount} words • {metrics.paragraphCount} paragraphs • 
                              Parsed {doc.timestamp.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={qualityInfo.color}>
                                {metrics.extractionQuality.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {metrics.keywordDensity}% regulatory terms
                              </Badge>
                              {metrics.formattingIssues.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {metrics.formattingIssues.length} issues
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{qualityInfo.score}%</div>
                            <div className="text-xs text-muted-foreground">Quality Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Detailed Analysis */}
              {selectedDocument && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="text-primary" />
                      Detailed Analysis: {selectedDocument.originalFilename}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="metrics">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                        <TabsTrigger value="issues">Issues</TabsTrigger>
                        <TabsTrigger value="preview">Text Preview</TabsTrigger>
                      </TabsList>

                      <TabsContent value="metrics" className="space-y-4">
                        {(() => {
                          const metrics = calculateMetrics(selectedDocument.extractedText);
                          const qualityInfo = getQualityInfo(metrics.extractionQuality);
                          
                          return (
                            <div className="space-y-4">
                              {/* Quality Score */}
                              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                <div>
                                  <h4 className="font-semibold">Overall Quality</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Extraction quality assessment
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${qualityInfo.color}`}>
                                    {metrics.extractionQuality.toUpperCase()}
                                  </div>
                                  <Progress value={qualityInfo.score} className="w-24 mt-1" />
                                </div>
                              </div>

                              {/* Content Metrics */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border">
                                  <div className="text-lg font-bold">{metrics.characterCount.toLocaleString()}</div>
                                  <div className="text-sm text-muted-foreground">Characters</div>
                                </div>
                                <div className="p-3 rounded-lg border">
                                  <div className="text-lg font-bold">{metrics.wordCount.toLocaleString()}</div>
                                  <div className="text-sm text-muted-foreground">Words</div>
                                </div>
                                <div className="p-3 rounded-lg border">
                                  <div className="text-lg font-bold">{metrics.paragraphCount}</div>
                                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                                </div>
                                <div className="p-3 rounded-lg border">
                                  <div className="text-lg font-bold">{metrics.keywordDensity}%</div>
                                  <div className="text-sm text-muted-foreground">Regulatory Terms</div>
                                </div>
                              </div>

                              {/* Additional Metrics */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Readability Score</span>
                                  <span className="text-sm">{metrics.readabilityScore}/100</span>
                                </div>
                                <Progress value={metrics.readabilityScore} className="h-2" />
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Structure Preserved</span>
                                  <Badge variant={metrics.structurePreserved ? 'default' : 'destructive'}>
                                    {metrics.structurePreserved ? 'Yes' : 'No'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </TabsContent>

                      <TabsContent value="issues" className="space-y-4">
                        {(() => {
                          const metrics = calculateMetrics(selectedDocument.extractedText);
                          
                          return (
                            <div className="space-y-4">
                              {metrics.formattingIssues.length === 0 ? (
                                <div className="text-center py-8">
                                  <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
                                  <p className="text-lg font-medium text-green-600">No Formatting Issues Detected</p>
                                  <p className="text-sm text-muted-foreground">
                                    The PDF was parsed cleanly without formatting problems
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <AlertTriangle className="text-yellow-600" size={20} />
                                    Formatting Issues ({metrics.formattingIssues.length})
                                  </h4>
                                  {metrics.formattingIssues.map((issue, index) => (
                                    <div key={index} className="p-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
                                      <div className="text-sm">{issue}</div>
                                    </div>
                                  ))}
                                  
                                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <h5 className="font-medium text-blue-900 mb-2">Recommendations</h5>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                      <li>• Review the extracted text for accuracy</li>
                                      <li>• Consider re-scanning the original document at higher resolution</li>
                                      <li>• Verify that regulatory terms are correctly captured</li>
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </TabsContent>

                      <TabsContent value="preview" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Extracted Text Preview</h4>
                            <Badge variant="outline">
                              {selectedDocument.extractedText.length} characters
                            </Badge>
                          </div>
                          
                          <div className="max-h-96 overflow-y-auto p-4 rounded-lg bg-muted border">
                            <pre className="text-xs font-mono whitespace-pre-wrap">
                              {selectedDocument.extractedText.substring(0, 2000)}
                              {selectedDocument.extractedText.length > 2000 && '\n\n[Content continues...]'}
                            </pre>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              const blob = new Blob([selectedDocument.extractedText], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `extracted_${selectedDocument.originalFilename}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <ClipboardText size={16} className="mr-2" />
                            Download Extracted Text
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}