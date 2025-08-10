import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart,
  TrendUp,
  FileText,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload
} from '@phosphor-icons/react';

interface UploadedDocument {
  id: string;
  file: File;
  extractedText: string;
  qualityAssessment: {
    score: number;
    wordCount: number;
    readabilityScore: number;
    structureScore: number;
    completenessScore: number;
  };
  documentType: {
    type: string;
    confidence: number;
  };
  uploadTime: Date;
  auditResults?: { [standard: string]: number };
}

interface UploadMetricsProps {
  uploadedDocs: UploadedDocument[];
}

export default function UploadMetrics({ uploadedDocs }: UploadMetricsProps) {
  if (!uploadedDocs || uploadedDocs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <BarChart size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">No Upload Metrics Available</p>
          <p className="text-sm">
            Upload documents to view comprehensive analytics and trends
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics
  const totalDocs = uploadedDocs.length;
  const avgQualityScore = Math.round(
    uploadedDocs.reduce((sum, doc) => sum + doc.qualityAssessment.score, 0) / totalDocs
  );
  const avgWordCount = Math.round(
    uploadedDocs.reduce((sum, doc) => sum + doc.qualityAssessment.wordCount, 0) / totalDocs
  );
  
  // Document types distribution
  const docTypes = uploadedDocs.reduce((acc, doc) => {
    const type = doc.documentType.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Quality distribution
  const qualityDistribution = {
    excellent: uploadedDocs.filter(doc => doc.qualityAssessment.score >= 80).length,
    good: uploadedDocs.filter(doc => doc.qualityAssessment.score >= 60 && doc.qualityAssessment.score < 80).length,
    poor: uploadedDocs.filter(doc => doc.qualityAssessment.score < 60).length
  };

  // Average compliance coverage (if available)
  const docsWithAuditResults = uploadedDocs.filter(doc => doc.auditResults);
  const avgCoverageByStandard = docsWithAuditResults.length > 0 
    ? Object.keys(docsWithAuditResults[0].auditResults || {}).reduce((acc, standard) => {
        const avg = Math.round(
          docsWithAuditResults.reduce((sum, doc) => 
            sum + (doc.auditResults?.[standard] || 0), 0
          ) / docsWithAuditResults.length
        );
        acc[standard] = avg;
        return acc;
      }, {} as Record<string, number>)
    : {};

  // Recent upload activity
  const recentUploads = uploadedDocs
    .sort((a, b) => b.uploadTime.getTime() - a.uploadTime.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Upload className="text-primary" size={20} />
              <div>
                <div className="text-2xl font-bold">{totalDocs}</div>
                <div className="text-xs text-muted-foreground">Total Uploads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="text-green-600" size={20} />
              <div>
                <div className="text-2xl font-bold">{avgQualityScore}</div>
                <div className="text-xs text-muted-foreground">Avg Quality</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              <div>
                <div className="text-2xl font-bold">{avgWordCount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Avg Words</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendUp className="text-purple-600" size={20} />
              <div>
                <div className="text-2xl font-bold">{Object.keys(docTypes).length}</div>
                <div className="text-xs text-muted-foreground">Doc Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="text-primary" />
              Quality Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm">Excellent (80-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{qualityDistribution.excellent}</span>
                  <div className="w-24">
                    <Progress 
                      value={(qualityDistribution.excellent / totalDocs) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={16} />
                  <span className="text-sm">Good (60-79)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{qualityDistribution.good}</span>
                  <div className="w-24">
                    <Progress 
                      value={(qualityDistribution.good / totalDocs) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={16} />
                  <span className="text-sm">Needs Work (<60)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{qualityDistribution.poor}</span>
                  <div className="w-24">
                    <Progress 
                      value={(qualityDistribution.poor / totalDocs) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-primary" />
              Document Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(docTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{count}</span>
                    <div className="w-24">
                      <Progress 
                        value={(count / totalDocs) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Coverage (if available) */}
      {Object.keys(avgCoverageByStandard).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-primary" />
              Average Compliance Coverage
            </CardTitle>
            <CardDescription>
              Average regulatory coverage across {docsWithAuditResults.length} analyzed documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(avgCoverageByStandard).map(([standard, coverage]) => (
                <div key={standard} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {standard.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-lg font-bold text-primary">{coverage}%</span>
                  </div>
                  <Progress value={coverage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-primary" />
            Recent Upload Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUploads.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{doc.file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {doc.uploadTime.toLocaleString()} • {doc.documentType.type}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={doc.qualityAssessment.score >= 80 ? 'default' : 
                             doc.qualityAssessment.score >= 60 ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {doc.qualityAssessment.score}/100
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}