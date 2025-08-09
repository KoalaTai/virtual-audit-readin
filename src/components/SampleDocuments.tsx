import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Shield, 
  ClipboardText,
  Beaker,
  Heart
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface SampleDocument {
  id: string;
  title: string;
  description: string;
  category: 'medical-device' | 'pharmaceutical' | 'quality-system';
  standards: string[];
  content: string;
  size: string;
  icon: React.ElementType;
}

interface SampleDocumentsProps {
  onDocumentSelect: (content: string, filename: string) => void;
}

const sampleDocuments: SampleDocument[] = [
  {
    id: 'design-control-sop',
    title: 'Design Control SOP',
    description: 'Standard Operating Procedure for medical device design controls per 21 CFR 820.30',
    category: 'medical-device',
    standards: ['FDA_21CFR820', 'ISO13485'],
    size: '2.3 KB',
    icon: FileText,
    content: `STANDARD OPERATING PROCEDURE
Design Control Process

Document ID: QMS-DC-001
Version: 3.2
Effective Date: March 15, 2024

1. PURPOSE
This procedure establishes the design control process to ensure that medical devices meet user requirements and intended use specifications in compliance with 21 CFR 820.30 and ISO 13485:2016.

2. SCOPE
This procedure applies to all design and development activities for medical devices manufactured by our organization.

3. DESIGN PLANNING
3.1 Design and development planning shall be documented and include:
   - Assignment of design team responsibilities
   - Design review milestones and acceptance criteria
   - Verification and validation activities
   - Risk management activities per ISO 14971

4. DESIGN INPUTS
4.1 Design inputs shall be documented and include:
   - Functional requirements derived from user needs
   - Performance requirements and specifications  
   - Applicable statutory and regulatory requirements
   - Applicable standards and guidelines
   - User interface requirements
   - Risk management file inputs

4.2 Design input requirements shall be:
   - Complete and unambiguous
   - Not contradictory
   - Amenable to verification and validation
   - Reviewed and approved by authorized personnel

5. DESIGN OUTPUTS
5.1 Design outputs shall:
   - Meet design input requirements
   - Include drawings, specifications, and software
   - Identify critical design characteristics
   - Include acceptance criteria for verification
   - Be reviewed and approved before release

6. DESIGN VERIFICATION
6.1 Verification activities shall confirm design outputs meet design inputs through:
   - Design calculations and analyses
   - Bench testing and simulations
   - Engineering evaluations
   - Comparison with similar proven designs

7. DESIGN VALIDATION  
7.2 Validation shall be performed under defined operating conditions on initial production or equivalent:
   - Clinical evaluation when applicable
   - Usability validation
   - Software validation per IEC 62304
   - Biocompatibility testing per ISO 10993

8. DESIGN TRANSFER
8.1 Design transfer procedures shall ensure design outputs are correctly translated into production specifications.

9. DESIGN CHANGES
9.1 All design changes shall be:
   - Identified and documented
   - Reviewed and approved
   - Verified and validated as appropriate
   - Implemented through change control process

10. DESIGN HISTORY FILE
10.1 A Design History File (DHF) shall be maintained containing:
    - Design plan
    - Design inputs and outputs
    - Verification and validation records
    - Design review records
    - Design change documentation

This procedure ensures compliance with FDA Quality System Regulation and ISO 13485 requirements for design controls.`
  },
  {
    id: 'risk-management-plan',
    title: 'Risk Management Plan Template',
    description: 'Comprehensive risk management plan following ISO 14971 for medical device development',
    category: 'medical-device',
    standards: ['ISO14971', 'ISO13485', 'EU_MDR'],
    size: '3.1 KB',
    icon: Shield,
    content: `RISK MANAGEMENT PLAN
Medical Device Risk Assessment

Document ID: RM-PLAN-001
Version: 2.1
Product: [Device Name]
Effective Date: March 20, 2024

1. RISK MANAGEMENT PROCESS
This risk management plan is established in accordance with ISO 14971:2019 "Application of risk management to medical devices" to systematically identify, evaluate, and control risks associated with medical device use.

2. SCOPE AND RESPONSIBILITIES
2.1 This plan applies to all life cycle phases of [Device Name] including:
   - Design and development
   - Manufacturing and production
   - Installation and commissioning  
   - Use and maintenance
   - Decommissioning and disposal

2.2 Risk management team responsibilities:
   - Risk Manager: Overall risk management oversight
   - Design Engineer: Technical risk assessment
   - Clinical Representative: Clinical risk evaluation
   - Regulatory Affairs: Regulatory compliance

3. RISK ANALYSIS METHODOLOGY
3.1 Hazard identification considers:
   - Intended use and reasonably foreseeable misuse
   - Characteristics related to safety
   - Known and foreseeable hazards
   - Hazardous situations and harm

3.2 Risk estimation methodology:
   - Severity assessment using 5-point scale
   - Probability assessment using 5-point scale  
   - Risk matrix for risk level determination
   - ALARP (As Low As Reasonably Practicable) principle

4. RISK ACCEPTABILITY CRITERIA
4.1 Acceptable risk levels:
   - Low risk (1-4): Generally acceptable
   - Medium risk (5-9): Acceptable with risk controls
   - High risk (10-16): Requires immediate risk reduction
   - Very high risk (20-25): Not acceptable

4.2 Benefit-risk analysis considerations:
   - Clinical benefits vs residual risks
   - Comparison with similar devices
   - State of the art technology assessment

5. RISK CONTROL MEASURES
5.1 Risk control hierarchy:
   - Inherent safety by design
   - Protective measures in device/manufacturing
   - Information for safety (labeling, training)

5.2 Risk control effectiveness verification:
   - Design verification testing
   - Usability engineering validation
   - Clinical evaluation data
   - Post-market surveillance data

6. RESIDUAL RISK EVALUATION
6.1 All residual risks must be:
   - Identified and documented
   - Evaluated for acceptability
   - Disclosed to users where appropriate
   - Justified by benefit-risk analysis

7. RISK MANAGEMENT FILE
7.1 The risk management file shall contain:
   - Risk management plan
   - Hazard analysis worksheets
   - Risk assessment matrices
   - Risk control implementation evidence
   - Residual risk evaluation
   - Benefit-risk analysis
   - Risk management report

8. POST-MARKET RISK MANAGEMENT
8.1 Post-market activities include:
   - Adverse event monitoring
   - Complaint analysis and trending
   - Risk-benefit re-evaluation
   - Risk management file updates

This risk management plan ensures systematic identification and control of risks throughout the medical device lifecycle per ISO 14971 requirements.`
  },
  {
    id: 'pharmaceutical-sop',
    title: 'Pharmaceutical Manufacturing SOP',
    description: 'Standard Operating Procedure for pharmaceutical manufacturing following cGMP requirements',
    category: 'pharmaceutical',
    standards: ['FDA_21CFR211', 'ICH_Q10', 'EU_GMP'],
    size: '2.8 KB',
    icon: Beaker,
    content: `STANDARD OPERATING PROCEDURE
Pharmaceutical Manufacturing Operations

Document ID: MANUF-SOP-045
Version: 4.1
Product Line: Oral Solid Dosage Forms
Effective Date: March 10, 2024

1. PURPOSE AND SCOPE
This SOP establishes current Good Manufacturing Practice (cGMP) requirements for pharmaceutical manufacturing operations in compliance with 21 CFR 211 and ICH Q10 guidelines.

2. PERSONNEL QUALIFICATIONS
2.1 All manufacturing personnel must:
   - Complete cGMP training programs
   - Demonstrate competency in assigned operations
   - Undergo periodic retraining and assessment
   - Follow personal hygiene requirements

2.2 Qualified Person responsibilities:
   - Release authority for finished products
   - GMP compliance oversight
   - Batch record review and approval

3. MANUFACTURING PROCESS CONTROLS
3.1 Batch production records shall include:
   - Complete manufacturing instructions
   - In-process control requirements
   - Sampling and testing protocols
   - Equipment identification and status
   - Time limits for processing steps

3.2 Critical process parameters monitoring:
   - Temperature and humidity controls
   - Mixing time and speed parameters
   - Tablet compression force monitoring
   - Coating process controls
   - Drying and curing conditions

4. RAW MATERIAL CONTROLS
4.1 All components must be:
   - Identified with unique lot numbers
   - Tested for identity, strength, quality, purity
   - Stored under appropriate conditions
   - Quarantined until testing complete
   - Approved by Quality Unit before use

4.2 Active pharmaceutical ingredients (APIs):
   - Certificate of analysis review
   - Identity testing confirmation
   - Potency and impurity testing
   - Microbiological limits verification

5. EQUIPMENT VALIDATION AND MAINTENANCE
5.1 Manufacturing equipment shall be:
   - Qualified for intended use (IQ/OQ/PQ)
   - Maintained per preventive maintenance schedule
   - Calibrated according to established procedures
   - Cleaned and sanitized between batches

5.2 Cleaning validation requirements:
   - Validated cleaning procedures
   - Residue limits establishment
   - Cross-contamination prevention
   - Cleaning verification testing

6. IN-PROCESS CONTROLS
6.1 Critical quality attributes monitoring:
   - Weight variation of tablets/capsules
   - Content uniformity testing
   - Dissolution testing at defined intervals
   - Hardness and friability testing
   - Disintegration time verification

6.2 Environmental monitoring:
   - Particulate and microbial monitoring
   - Temperature and humidity recording
   - Differential pressure maintenance
   - Air quality classification verification

7. BATCH DOCUMENTATION
7.1 Batch production records must include:
   - All manufacturing steps executed
   - In-process test results
   - Deviation investigations
   - Material reconciliation
   - Environmental monitoring data

8. FINISHED PRODUCT TESTING
8.1 Release testing requirements:
   - Identity and potency confirmation
   - Impurity and degradation products
   - Microbiological testing
   - Dissolution profile verification
   - Stability indicating methods

9. CHANGE CONTROL
9.1 Manufacturing changes require:
   - Change control documentation
   - Risk assessment evaluation
   - Regulatory notification when required
   - Validation of changes
   - Implementation authorization

This SOP ensures pharmaceutical manufacturing compliance with cGMP regulations and quality system requirements per FDA 21 CFR 211 and ICH Q10.`
  },
  {
    id: 'quality-manual',
    title: 'Quality Management System Manual',
    description: 'Complete QMS manual addressing ISO 13485 and FDA QSR requirements',
    category: 'quality-system',
    standards: ['ISO13485', 'FDA_21CFR820', 'EU_MDR', 'HEALTH_CANADA'],
    size: '4.2 KB',
    icon: BookOpen,
    content: `QUALITY MANAGEMENT SYSTEM MANUAL
Medical Device Quality System

Document ID: QMS-MAN-001  
Version: 5.0
Organization: [Company Name]
Effective Date: March 1, 2024

1. QUALITY MANAGEMENT SYSTEM
1.1 This Quality Management System (QMS) is established to meet requirements of:
   - ISO 13485:2016 Medical devices - Quality management systems
   - FDA 21 CFR 820 Quality System Regulation
   - EU MDR 2017/745 Medical Device Regulation
   - Health Canada Medical Device Regulations

1.2 Quality Policy Statement:
Our organization is committed to providing safe and effective medical devices that meet customer requirements and applicable regulatory standards through continuous improvement of our quality management system.

2. MANAGEMENT RESPONSIBILITY
2.1 Top management demonstrates leadership and commitment by:
   - Establishing quality policy and objectives
   - Ensuring customer and regulatory requirements are met
   - Conducting management reviews
   - Ensuring availability of resources
   - Promoting awareness of regulatory requirements

2.2 Management Representative responsibilities:
   - QMS implementation and maintenance
   - Reporting QMS performance to management
   - Liaison with regulatory authorities
   - Customer communication coordination

3. RESOURCE MANAGEMENT
3.1 Human Resources:
   - Personnel competency requirements
   - Training program implementation  
   - Competence evaluation and records
   - Awareness of quality requirements

3.2 Infrastructure requirements:
   - Facility design and environmental controls
   - Equipment qualification and maintenance
   - IT systems validation and control
   - Support service management

4. PRODUCT REALIZATION
4.1 Planning of product realization includes:
   - Quality objectives and requirements
   - Risk management activities per ISO 14971
   - Design and development planning
   - Verification and validation planning
   - Production and service controls

4.2 Customer-related processes:
   - Customer requirement determination
   - Product requirement review
   - Customer communication protocols
   - Complaint handling procedures

5. DESIGN AND DEVELOPMENT
5.1 Design planning establishes:
   - Design stages and responsibilities
   - Review, verification, validation activities
   - Design transfer procedures
   - Design history file maintenance

5.2 Design inputs include:
   - User requirements and intended use
   - Performance requirements
   - Regulatory and standard requirements
   - Risk management requirements

6. PURCHASING AND SUPPLIER CONTROLS
6.1 Supplier evaluation criteria:
   - Quality system assessment
   - Product quality capability
   - Delivery performance
   - Regulatory compliance status

6.2 Purchasing information specifies:
   - Product specifications
   - Quality requirements
   - Inspection and testing requirements
   - Supplier quality agreements

7. PRODUCTION AND SERVICE PROVISION
7.1 Production controls ensure:
   - Validated processes and procedures
   - Equipment maintenance and calibration
   - Environmental condition control
   - Product identification and traceability

7.2 Product identification and traceability:
   - Unique device identification (UDI)
   - Lot and serial number controls
   - Distribution records maintenance
   - Component traceability systems

8. MEASUREMENT AND IMPROVEMENT
8.1 Monitoring and measurement includes:
   - Customer satisfaction monitoring
   - Internal audit program
   - Process monitoring and measurement
   - Product monitoring and testing

8.2 Control of nonconforming product:
   - Nonconformity identification
   - Segregation and disposition
   - Corrective action implementation
   - Advisory notice procedures

9. CORRECTIVE AND PREVENTIVE ACTION
9.1 CAPA system addresses:
   - Data analysis and trend identification
   - Root cause analysis methodology
   - Corrective action implementation
   - Effectiveness verification
   - Preventive action identification

10. REGULATORY COMPLIANCE
10.1 Regulatory requirements include:
    - Device registration and listing
    - Quality system certification
    - Post-market surveillance
    - Adverse event reporting
    - Change notification procedures

This Quality Management System ensures compliance with applicable medical device regulations and standards for safe and effective product development and manufacturing.`
  },
  {
    id: 'clinical-evaluation',
    title: 'Clinical Evaluation Report Template',
    description: 'Template for clinical evaluation reports under EU MDR and FDA requirements',
    category: 'medical-device', 
    standards: ['EU_MDR', 'FDA_21CFR820', 'ISO14155'],
    size: '2.9 KB',
    icon: Heart,
    content: `CLINICAL EVALUATION REPORT
Medical Device Clinical Assessment

Document ID: CER-001
Version: 2.0
Device: [Medical Device Name]
Classification: [Risk Class]
Date: March 25, 2024

1. EXECUTIVE SUMMARY
This Clinical Evaluation Report (CER) demonstrates the clinical safety and performance of [Device Name] in accordance with EU MDR Article 61 and Annex XIV, and supports regulatory submissions per FDA guidance documents.

2. DEVICE DESCRIPTION AND INTENDED USE
2.1 Device Description:
   - Device name and model numbers
   - Device classification and rule applied
   - Intended purpose and medical indication
   - Target patient population
   - Contraindications and warnings

2.2 Substantial Equivalence Assessment:
   - Predicate device identification
   - Comparative analysis methodology
   - Technological and clinical similarity
   - Performance characteristic comparison

3. CLINICAL EVALUATION METHODOLOGY
3.1 Clinical evaluation pathway:
   - Literature review methodology
   - Clinical investigation requirements  
   - Post-market clinical follow-up plan
   - Combination of clinical evidence sources

3.2 Literature Search Strategy:
   - Database search terms and criteria
   - Inclusion and exclusion criteria
   - Study quality assessment methodology
   - Data extraction and synthesis methods

4. CLINICAL EVIDENCE EVALUATION
4.1 Clinical Literature Analysis:
   - Systematic literature review results
   - Study quality and relevance assessment
   - Clinical data equivalence analysis
   - Gap analysis and evidence limitations

4.2 Clinical Investigation Data:
   - Study design and objectives
   - Primary and secondary endpoints
   - Statistical analysis methodology
   - Safety and efficacy results

5. SAFETY EVALUATION
5.1 Safety Profile Assessment:
   - Adverse event analysis and reporting
   - Risk-benefit analysis methodology
   - Comparison with similar devices
   - Undesirable side effects evaluation

5.2 Risk Management Integration:
   - Clinical risk identification
   - Risk control measure verification
   - Residual risk acceptability
   - Post-market risk monitoring

6. CLINICAL PERFORMANCE EVALUATION
6.1 Performance Characteristics:
   - Primary performance endpoints
   - Secondary performance measures
   - Clinical utility demonstration
   - User performance validation

6.2 Usability and Human Factors:
   - Use error identification
   - Critical task performance
   - Training and labeling adequacy
   - User interface validation

7. BENEFIT-RISK ANALYSIS
7.1 Clinical Benefit Assessment:
   - Therapeutic benefit quantification
   - Quality of life improvements
   - Mortality and morbidity impact
   - Comparison with standard of care

7.2 Risk Assessment:
   - Serious adverse event analysis
   - Device-related complications
   - Long-term safety considerations
   - Risk mitigation strategies

8. POST-MARKET CLINICAL FOLLOW-UP
8.1 PMCF Plan Implementation:
   - Post-market study design
   - Real-world evidence collection
   - Performance monitoring methodology
   - Safety signal detection systems

8.2 Clinical Evidence Updates:
   - Periodic safety update reports
   - Clinical evaluation report updates
   - Literature monitoring procedures
   - Regulatory communication protocols

9. CONCLUSIONS
9.1 Clinical Evidence Adequacy:
   - Sufficient clinical evidence demonstration
   - Acceptable benefit-risk profile
   - Compliance with safety requirements
   - Performance claim substantiation

9.2 Recommendations:
   - Additional clinical data requirements
   - Post-market surveillance activities
   - Labeling and user information updates
   - Regulatory submission strategy

This clinical evaluation report demonstrates the clinical safety and performance of the medical device per EU MDR and FDA regulatory requirements.`
  },
  {
    id: 'complaint-handling',
    title: 'Customer Complaint Handling SOP',
    description: 'Comprehensive procedure for medical device complaint handling and adverse event reporting',
    category: 'quality-system',
    standards: ['FDA_21CFR820', 'ISO13485', 'EU_MDR', 'HEALTH_CANADA', 'TGA_AUSTRALIA'],
    size: '3.4 KB',
    icon: ClipboardText,
    content: `STANDARD OPERATING PROCEDURE
Customer Complaint Handling Process

Document ID: QA-SOP-012
Version: 3.0
Effective Date: March 22, 2024

1. PURPOSE AND SCOPE
This procedure establishes the systematic process for receiving, documenting, investigating, and responding to customer complaints regarding medical devices in compliance with FDA 21 CFR 820.198, ISO 13485:2016, and EU MDR Article 92.

2. DEFINITIONS
2.1 Complaint: Any written, electronic, or oral communication that alleges deficiencies related to identity, quality, durability, reliability, safety, effectiveness, or performance of a device.

2.2 Adverse Event: Any incident where a device may have caused or contributed to death, serious injury, or malfunction that would likely cause death or serious injury if recurrence occurred.

3. COMPLAINT RECEIPT AND DOCUMENTATION
3.1 Complaint Receipt Sources:
   - Direct customer communication
   - Healthcare provider reports
   - Distributor and sales representative reports
   - Social media and online reviews
   - Regulatory authority notifications

3.2 Initial Documentation Requirements:
   - Customer contact information
   - Device identification (model, serial, lot)
   - Complaint description and allegations
   - Patient/user impact assessment
   - Device disposition and availability
   - Supporting documentation collection

4. COMPLAINT CLASSIFICATION
4.1 Severity Classification:
   - Critical: Death, serious injury, or safety hazard
   - Major: Device malfunction affecting performance
   - Minor: Cosmetic or non-performance issues
   - Inquiry: Information request without complaint

4.2 Regulatory Reporting Assessment:
   - FDA MDR reportability evaluation
   - EU EUDAMED incident reporting
   - Health Canada incident reporting
   - TGA adverse event reporting requirements

5. INVESTIGATION PROCESS
5.1 Investigation Team Assignment:
   - Quality assurance lead investigator
   - Technical/engineering expertise
   - Clinical/medical input when required
   - Regulatory affairs consultation

5.2 Investigation Activities:
   - Device examination and testing
   - Manufacturing record review
   - Design history file evaluation
   - Supplier component assessment
   - Root cause analysis methodology

6. CORRECTIVE AND PREVENTIVE ACTION
6.1 CAPA Evaluation Criteria:
   - Complaint trend analysis
   - Risk assessment and impact
   - Regulatory reporting requirements
   - Customer safety considerations
   - Business impact evaluation

6.2 CAPA Implementation:
   - Root cause identification
   - Corrective action planning
   - Implementation timeline
   - Effectiveness verification
   - Documentation requirements

7. REGULATORY REPORTING
7.1 FDA Medical Device Reporting (MDR):
   - 30-day reporting for deaths
   - 5-day malfunction reporting
   - Annual certification requirements
   - Baseline report submissions

7.2 International Reporting:
   - EU EUDAMED serious incident reporting
   - Health Canada mandatory problem reporting
   - TGA adverse event reporting
   - Competent authority notifications

8. CUSTOMER COMMUNICATION
8.1 Acknowledgment Requirements:
   - Initial receipt confirmation (2 business days)
   - Investigation status updates
   - Final response with findings
   - CAPA implementation notification

8.2 Communication Standards:
   - Professional and empathetic tone
   - Clear explanation of findings
   - Appropriate corrective actions
   - Contact information for follow-up

9. TRENDING AND ANALYSIS
9.1 Complaint Data Analysis:
   - Monthly trending reports
   - Product performance indicators
   - Customer satisfaction metrics
   - Regulatory reporting statistics

9.2 Management Review Input:
   - Complaint summary statistics
   - CAPA effectiveness metrics
   - Regulatory compliance status
   - Customer feedback trends

10. RECORD KEEPING
10.1 Complaint File Contents:
    - Original complaint documentation
    - Investigation records and findings
    - CAPA documentation
    - Regulatory reporting submissions
    - Customer correspondence

10.2 Retention Requirements:
    - Complaint records: Device lifetime + 2 years
    - Investigation reports: Permanent retention
    - Regulatory submissions: Per regulation
    - Customer communications: 7 years minimum

11. TRAINING AND COMPETENCY
11.1 Personnel Training Requirements:
    - Complaint handling procedures
    - Regulatory reporting obligations
    - Investigation methodologies
    - Customer service standards

This procedure ensures systematic complaint handling and regulatory compliance for medical device customer feedback and adverse event management.`
  }
];

export default function SampleDocuments({ onDocumentSelect }: SampleDocumentsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medical-device' | 'pharmaceutical' | 'quality-system'>('all');
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'medical-device', label: 'Medical Device', icon: Heart },
    { id: 'pharmaceutical', label: 'Pharmaceutical', icon: Beaker },
    { id: 'quality-system', label: 'Quality System', icon: Shield },
  ] as const;

  const filteredDocuments = selectedCategory === 'all' 
    ? sampleDocuments 
    : sampleDocuments.filter(doc => doc.category === selectedCategory);

  const toggleExpanded = (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  const handleDocumentSelect = (document: SampleDocument) => {
    onDocumentSelect(document.content, `${document.title}.txt`);
    toast.success(`Loaded "${document.title}" for analysis`);
  };

  const handleDownload = (document: SampleDocument) => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded "${document.title}"`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="text-primary" />
          Sample Compliance Documents
        </CardTitle>
        <CardDescription>
          Load realistic compliance documents to test PDF parsing accuracy and regulatory analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category Filter */}
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon size={16} />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Document List */}
          <div className="space-y-4">
            {filteredDocuments.map((document) => {
              const Icon = document.icon;
              const isExpanded = expandedDocs.has(document.id);
              
              return (
                <Card key={document.id} className="overflow-hidden">
                  <Collapsible 
                    open={isExpanded}
                    onOpenChange={() => toggleExpanded(document.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 text-left">
                            <Icon className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                              <CardTitle className="text-base">{document.title}</CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {document.description}
                              </CardDescription>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {document.standards.slice(0, 3).map(standard => (
                                  <Badge key={standard} variant="outline" className="text-xs">
                                    {standard}
                                  </Badge>
                                ))}
                                {document.standards.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{document.standards.length - 3} more
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {document.size}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Document Preview */}
                          <div className="p-4 rounded-lg bg-muted max-h-64 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap">
                              {document.content.substring(0, 800)}
                              {document.content.length > 800 && '\n\n[Content continues...]'}
                            </pre>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleDocumentSelect(document)}
                              className="flex items-center gap-2"
                            >
                              <FileText size={16} />
                              Load for Analysis
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleDownload(document)}
                              className="flex items-center gap-2"
                            >
                              <Download size={16} />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents found for the selected category
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}