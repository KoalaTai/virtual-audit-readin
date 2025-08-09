import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChartBar, 
  TrendUp, 
  Warning, 
  CheckCircle, 
  GitCompare, 
  Trophy,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from '@phosphor-icons/react';
import { 
  performComparativeAnalysis, 
  type RegulatoryStandard, 
  type ComparativeAnalysisResult,
  type CrossStandardInsight,
  getStandardDisplayName
} from '@/lib/virtual-audit';
import { toast } from 'sonner';

interface ComparativeAnalysisProps {
  documentText: string;
  onAnalysisComplete: (result: ComparativeAnalysisResult) => void;
  filename?: string;
}

interface StandardSelectionProps {
  selectedStandards: RegulatoryStandard[];
  onStandardToggle: (standard: RegulatoryStandard, checked: boolean) => void;
  onPerformAnalysis: () => void;
  isLoading: boolean;
  disabled: boolean;
}

function StandardSelection({ 
  selectedStandards, 
  onStandardToggle, 
  onPerformAnalysis, 
  isLoading, 
  disabled 
}: StandardSelectionProps) {
  const standardCategories = {
    'Medical Device Standards': [
      'ISO13485' as const,
      'FDA_21CFR820' as const,
      'EU_MDR' as const,
      'UK_MHRA' as const,
      'HEALTH_CANADA' as const,
      'TGA_AUSTRALIA' as const,
      'PMDA_JAPAN' as const
    ],
    'Pharmaceutical Standards': [
      'FDA_21CFR211' as const,
      'ICH_Q10' as const,
      'EU_GMP' as const
    ]
  };

  const standardLabels = {
    'ISO13485': 'ISO 13485 - International Medical Device QMS',
    'FDA_21CFR820': 'FDA 21 CFR 820 - US Quality System Regulation',
    'EU_MDR': 'EU MDR 2017/745 - European Medical Device Regulation',
    'UK_MHRA': 'UK MHRA - Medical Device Regulations',
    'HEALTH_CANADA': 'Health Canada - Medical Device Regulations',
    'TGA_AUSTRALIA': 'TGA Australia - Medical Device Regulations',
    'PMDA_JAPAN': 'PMDA Japan - Medical Device Regulations',
    'FDA_21CFR211': 'FDA 21 CFR 211 - Pharmaceutical cGMP',
    'ICH_Q10': 'ICH Q10 - Pharmaceutical Quality System',
    'EU_GMP': 'EU GMP - Good Manufacturing Practice'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="text-primary" />
          Comparative Analysis Settings
        </CardTitle>
        <CardDescription>
          Select multiple regulatory standards to compare compliance coverage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(standardCategories).map(([category, standards]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">{category}</h4>
            <div className="space-y-2">
              {standards.map((standard) => (
                <div key={standard} className="flex items-center space-x-3">
                  <Checkbox
                    id={standard}
                    checked={selectedStandards.includes(standard)}
                    onCheckedChange={(checked) => onStandardToggle(standard, checked as boolean)}
                  />
                  <label 
                    htmlFor={standard}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {standardLabels[standard]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Selected Standards</span>
            <Badge variant="outline">{selectedStandards.length}</Badge>
          </div>
          
          <Button 
            onClick={onPerformAnalysis} 
            disabled={disabled || isLoading || selectedStandards.length < 2}
            className="w-full"
            size="lg"
          >
            {isLoading 
              ? `Analyzing ${selectedStandards.length} Standards...` 
              : `Compare ${selectedStandards.length} Standards`
            }
          </Button>
          
          {selectedStandards.length < 2 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Select at least 2 standards for comparison
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface OverallMetricsCardProps {
  result: ComparativeAnalysisResult;
}

function OverallMetricsCard({ result }: OverallMetricsCardProps) {
  const { overallMetrics, results } = result;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="text-primary" />
          Comparative Overview
        </CardTitle>
        <CardDescription>
          Overall compliance performance across selected standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-primary">{overallMetrics.averageCoverage}%</div>
            <div className="text-sm text-muted-foreground">Average Coverage</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-green-600">{overallMetrics.bestPerformingStandard.coverage}%</div>
            <div className="text-sm text-muted-foreground">Best Coverage</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getStandardDisplayName(overallMetrics.bestPerformingStandard.standard)}
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-orange-500">{overallMetrics.worstPerformingStandard.coverage}%</div>
            <div className="text-sm text-muted-foreground">Lowest Coverage</div>
            <div className="text-xs text-muted-foreground mt-1">
              {getStandardDisplayName(overallMetrics.worstPerformingStandard.standard)}
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-blue-600">{overallMetrics.totalUniqueClauses}</div>
            <div className="text-sm text-muted-foreground">Unique Clauses</div>
          </div>
        </div>

        {/* Standard Comparison Chart */}
        <div className="space-y-3">
          <h4 className="font-semibold">Coverage by Standard</h4>
          {results
            .sort((a, b) => b.coveragePercentage - a.coveragePercentage)
            .map((result, index) => (
            <div key={result.standard} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && <Trophy size={16} className="text-yellow-500" />}
                  <span className="font-medium">{getStandardDisplayName(result.standard)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{result.coveragePercentage}%</span>
                  {index === 0 ? (
                    <ArrowUp size={16} className="text-green-600" />
                  ) : index === results.length - 1 ? (
                    <ArrowDown size={16} className="text-red-500" />
                  ) : (
                    <Minus size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
              <Progress value={result.coveragePercentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CrossStandardInsightsProps {
  insights: CrossStandardInsight[];
}

function CrossStandardInsights({ insights }: CrossStandardInsightsProps) {
  const getInsightIcon = (type: CrossStandardInsight['type']) => {
    switch (type) {
      case 'common_gap': return Warning;
      case 'unique_coverage': return CheckCircle;
      case 'regulatory_overlap': return Target;
      case 'best_performer': return Trophy;
      default: return ChartBar;
    }
  };

  const getInsightColor = (severity: CrossStandardInsight['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: CrossStandardInsight['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendUp className="text-primary" />
          Cross-Standard Insights
          <Badge variant="outline">{insights.length}</Badge>
        </CardTitle>
        <CardDescription>
          Key patterns and gaps identified across multiple regulatory standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cross-standard patterns identified. This indicates good regulatory alignment.
            </div>
          ) : (
            insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <Icon className={`mt-0.5 ${getInsightColor(insight.severity)}`} size={20} />
                      <div className="flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getSeverityBadge(insight.severity)} className="ml-2">
                      {insight.severity}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {insight.standards.map((standard) => (
                      <Badge key={standard} variant="outline" className="text-xs">
                        {getStandardDisplayName(standard)}
                      </Badge>
                    ))}
                  </div>
                  
                  {insight.clauses.length > 0 && insight.clauses.length <= 3 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Clauses: {insight.clauses.join(', ')}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DetailedResultsProps {
  result: ComparativeAnalysisResult;
}

function DetailedResults({ result }: DetailedResultsProps) {
  return (
    <div className="space-y-6">
      {result.results.map((standardResult) => (
        <Card key={standardResult.standard}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getStandardDisplayName(standardResult.standard)}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{standardResult.coveragePercentage}% coverage</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="text-xl font-bold text-green-600">{standardResult.covered_clauses.length}</div>
                <div className="text-sm text-green-700">Covered Clauses</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                <div className="text-xl font-bold text-orange-600">{standardResult.potential_gaps.length}</div>
                <div className="text-sm text-orange-700">Potential Gaps</div>
              </div>
            </div>
            
            <Progress value={standardResult.coveragePercentage} className="h-2 mb-4" />
            
            {standardResult.potential_gaps.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-orange-700">Priority Gaps to Address:</h4>
                <div className="space-y-1">
                  {standardResult.potential_gaps.slice(0, 3).map((gap, index) => (
                    <div key={index} className="text-xs p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                      <span className="font-medium">{gap.clause}</span> - {gap.title}
                    </div>
                  ))}
                  {standardResult.potential_gaps.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      +{standardResult.potential_gaps.length - 3} more gaps
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ComparativeAnalysis({ documentText, onAnalysisComplete, filename }: ComparativeAnalysisProps) {
  const [selectedStandards, setSelectedStandards] = useState<RegulatoryStandard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ComparativeAnalysisResult | null>(null);

  const handleStandardToggle = (standard: RegulatoryStandard, checked: boolean) => {
    if (checked) {
      setSelectedStandards(prev => [...prev, standard]);
    } else {
      setSelectedStandards(prev => prev.filter(s => s !== standard));
    }
  };

  const handlePerformAnalysis = () => {
    if (selectedStandards.length < 2) {
      toast.error('Please select at least 2 standards for comparison');
      return;
    }

    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const result = performComparativeAnalysis(documentText, selectedStandards, filename);
      setCurrentResult(result);
      onAnalysisComplete(result);
      
      toast.success(`Comparative analysis completed across ${selectedStandards.length} standards`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StandardSelection
            selectedStandards={selectedStandards}
            onStandardToggle={handleStandardToggle}
            onPerformAnalysis={handlePerformAnalysis}
            isLoading={isLoading}
            disabled={!documentText.trim()}
          />
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span>Performing comparative analysis across {selectedStandards.length} regulatory standards...</span>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  This may take a few moments to complete thorough cross-standard evaluation
                </div>
              </CardContent>
            </Card>
          ) : currentResult ? (
            <OverallMetricsCard result={currentResult} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Select regulatory standards and perform analysis to see comparative results
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {currentResult && !isLoading && (
        <>
          <CrossStandardInsights insights={currentResult.crossStandardInsights} />
          
          <Tabs defaultValue="detailed">
            <TabsList>
              <TabsTrigger value="detailed">Standard-by-Standard Results</TabsTrigger>
            </TabsList>
            <TabsContent value="detailed">
              <DetailedResults result={currentResult} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}