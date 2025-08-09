import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, FileText, ChartBar, ClockCounterClockwise, Warning } from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';
import { performVirtualAudit, type RegulatoryStandard, type AuditResult, type ClauseResult } from '@/lib/virtual-audit';
import { toast } from 'sonner';

interface DocumentUploadProps {
  onDocumentChange: (text: string) => void;
  documentText: string;
}

function DocumentUpload({ onDocumentChange, documentText }: DocumentUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-primary" />
          Document Input
        </CardTitle>
        <CardDescription>
          Upload your QMS document or paste the content directly for compliance analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your document content here, such as SOPs, work instructions, or quality manuals..."
          value={documentText}
          onChange={(e) => onDocumentChange(e.target.value)}
          className="min-h-32 font-mono text-sm"
        />
        <div className="mt-2 text-sm text-muted-foreground">
          {documentText.length} characters
        </div>
      </CardContent>
    </Card>
  );
}

interface StandardSelectorProps {
  selectedStandard: RegulatoryStandard;
  onStandardChange: (standard: RegulatoryStandard) => void;
  onPerformAudit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

function StandardSelector({ selectedStandard, onStandardChange, onPerformAudit, isLoading, disabled }: StandardSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regulatory Standard</CardTitle>
        <CardDescription>
          Select the regulatory framework for compliance assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedStandard} onValueChange={onStandardChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select regulatory standard" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <div className="font-semibold px-2 py-1 text-xs text-muted-foreground">Medical Device Standards</div>
            <SelectItem value="ISO13485">ISO 13485 - International Medical Device QMS</SelectItem>
            <SelectItem value="FDA_21CFR820">FDA 21 CFR 820 - US Quality System Regulation</SelectItem>
            <SelectItem value="EU_MDR">EU MDR 2017/745 - European Medical Device Regulation</SelectItem>
            <SelectItem value="UK_MHRA">UK MHRA - Medical Device Regulations</SelectItem>
            <SelectItem value="HEALTH_CANADA">Health Canada - Medical Device Regulations</SelectItem>
            <SelectItem value="TGA_AUSTRALIA">TGA Australia - Medical Device Regulations</SelectItem>
            <SelectItem value="PMDA_JAPAN">PMDA Japan - Medical Device Regulations</SelectItem>
            
            <div className="font-semibold px-2 py-1 text-xs text-muted-foreground mt-3">Pharmaceutical Standards</div>
            <SelectItem value="FDA_21CFR211">FDA 21 CFR 211 - Pharmaceutical cGMP</SelectItem>
            <SelectItem value="ICH_Q10">ICH Q10 - Pharmaceutical Quality System</SelectItem>
            <SelectItem value="EU_GMP">EU GMP - Good Manufacturing Practice</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={onPerformAudit} 
          disabled={disabled || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Analyzing...' : 'Perform Virtual Audit'}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ClauseListProps {
  title: string;
  clauses: ClauseResult[];
  type: 'covered' | 'gaps';
}

function ClauseList({ title, clauses, type }: ClauseListProps) {
  const icon = type === 'covered' ? CheckCircle : Warning;
  const iconColor = type === 'covered' ? 'text-green-600' : 'text-orange-500';
  const badgeVariant = type === 'covered' ? 'default' : 'destructive';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon({ className: iconColor })}
          {title}
          <Badge variant={badgeVariant}>{clauses.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clauses.map((clause, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{clause.clause} - {clause.title}</div>
                  {type === 'covered' && clause.foundKeywords && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {clause.foundKeywords.map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {type === 'gaps' && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Look for: {clause.keywords.slice(0, 3).join(', ')}
                      {clause.keywords.length > 3 && ` +${clause.keywords.length - 3} more`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {clauses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {type === 'covered' ? 'No clauses covered yet' : 'No gaps identified'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface AuditResultsProps {
  result: AuditResult;
}

function AuditResults({ result }: AuditResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="text-primary" />
            Audit Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-green-600">{result.covered_clauses.length}</div>
              <div className="text-sm text-muted-foreground">Covered Clauses</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-orange-500">{result.potential_gaps.length}</div>
              <div className="text-sm text-muted-foreground">Potential Gaps</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-primary">{result.coveragePercentage}%</div>
              <div className="text-sm text-muted-foreground">Coverage</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Compliance Coverage</span>
              <span>{result.coveragePercentage}%</span>
            </div>
            <Progress value={result.coveragePercentage} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <strong>Standard:</strong> {result.standard} • 
            <strong> Analyzed:</strong> {new Date(result.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="gaps">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gaps">Potential Gaps ({result.potential_gaps.length})</TabsTrigger>
          <TabsTrigger value="covered">Covered Clauses ({result.covered_clauses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="gaps" className="mt-4">
          <ClauseList 
            title="Potential Gaps - Priority Review Needed"
            clauses={result.potential_gaps}
            type="gaps"
          />
        </TabsContent>
        <TabsContent value="covered" className="mt-4">
          <ClauseList 
            title="Covered Clauses - Requirements Addressed"
            clauses={result.covered_clauses}
            type="covered"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AuditHistoryProps {
  auditHistory: AuditResult[];
  onSelectAudit: (audit: AuditResult) => void;
}

function AuditHistory({ auditHistory, onSelectAudit }: AuditHistoryProps) {
  if (auditHistory.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No previous audits found. Perform your first audit to start tracking compliance progress.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {auditHistory.map((audit, index) => (
        <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelectAudit(audit)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{audit.standard}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(audit.timestamp).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {audit.documentPreview}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{audit.coveragePercentage}%</div>
                <div className="text-xs text-muted-foreground">
                  {audit.potential_gaps.length} gaps
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function VirtualAuditApp() {
  const [documentText, setDocumentText] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<RegulatoryStandard>('ISO13485');
  const [currentResult, setCurrentResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auditHistory, setAuditHistory] = useKV<AuditResult[]>('audit-history', []);

  const handlePerformAudit = () => {
    if (!documentText.trim()) {
      toast.error('Please enter document content to analyze');
      return;
    }

    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const result = performVirtualAudit(documentText, selectedStandard);
      setCurrentResult(result);
      
      // Add to history
      setAuditHistory(prevHistory => [result, ...(prevHistory || []).slice(0, 9)]); // Keep last 10 audits
      
      toast.success(`Audit completed - ${result.coveragePercentage}% coverage identified`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Virtual Audit Readiness</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive compliance gap assessment across global medical device and pharmaceutical regulations.
            Covers FDA, EU MDR, ISO 13485, Health Canada, TGA, PMDA, ICH guidelines and more.
          </p>
        </div>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audit">New Audit</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <ClockCounterClockwise size={16} />
              Audit History ({auditHistory?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DocumentUpload 
                  documentText={documentText}
                  onDocumentChange={setDocumentText}
                />
              </div>
              <div>
                <StandardSelector
                  selectedStandard={selectedStandard}
                  onStandardChange={setSelectedStandard}
                  onPerformAudit={handlePerformAudit}
                  isLoading={isLoading}
                  disabled={!documentText.trim()}
                />
              </div>
            </div>

            {isLoading && (
              <Card>
                <CardContent className="py-8">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span>Analyzing document against {selectedStandard} requirements...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentResult && !isLoading && (
              <AuditResults result={currentResult} />
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockCounterClockwise className="text-primary" />
                  Audit History
                </CardTitle>
                <CardDescription>
                  Review previous audit results and track compliance improvements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditHistory 
                  auditHistory={auditHistory || []}
                  onSelectAudit={setCurrentResult}
                />
              </CardContent>
            </Card>
            
            {currentResult && (
              <div className="mt-6">
                <AuditResults result={currentResult} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}