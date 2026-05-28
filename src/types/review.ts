export type Severity = 'critical' | 'high' | 'medium' | 'low' | string

export interface ClassificationData {
  documentType: string
  language: string
  jurisdiction: string
}

export interface ContractSummary {
  documentType: string
  purpose: string
  parties: Array<Record<string, string>>
  effectiveDate: string
  duration: string
  governingLaw: string
  jurisdiction: string
  keyTerms: Record<string, string>
  majorObligations: string[]
  importantClauses: string[]
  missingOrUnclearSections: string[]
  summary: string
}

export interface RiskItem {
  riskId: string
  clause: string
  severity: Severity
  issue: string
  legalImpact: string
  plainEnglishExplanation: string
}

export interface SuggestionItem {
  relatedClause: string
  recommendation: string
  reason: string
  implementationExample: string
}

export interface ReviewResult {
  documentTextPreview: string
  classification: ClassificationData
  summary: ContractSummary | null
  risks: RiskItem[]
  missingProtections: string[]
  analysisNotes: string[]
  suggestions: SuggestionItem[]
  priorityRecommendations: string[]
  overallRiskLevel: string
  overallRecommendationSummary: string
  warnings: string[]
}
